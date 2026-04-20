using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi(options =>
{
    options.OpenApiVersion = Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_0;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var mongoDbSettings = builder.Configuration
    .GetSection("MongoDbSettings")
    .Get<MongoDbSettings>();
var jwtSettings = builder.Configuration
    .GetSection("JwtSettings")
    .Get<JwtSettings>();

if (mongoDbSettings is null)
{
    throw new Exception("MongoDbSettings not found.");
}
if (jwtSettings is null)
{
    throw new Exception("JwtSettings not found.");
}
if (string.IsNullOrWhiteSpace(jwtSettings.Key))
{
    throw new Exception("JwtSettings.Key not found.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
            ClockSkew = TimeSpan.Zero
        };
    });
builder.Services.AddAuthorization();

var taskService = new TaskService(mongoDbSettings);
var authService = new AuthService(mongoDbSettings, jwtSettings);

var app = builder.Build();

app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();

bool IsTaskNameInvalid(string taskName)
{
    return string.IsNullOrWhiteSpace(taskName);
}

bool IsMongoIdInvalid(string id)
{
    return !ObjectId.TryParse(id, out _);
}

var emailValidator = new EmailAddressAttribute();

bool IsEmailInvalid(string? email)
{
    return string.IsNullOrWhiteSpace(email) || !emailValidator.IsValid(email);
}

bool IsPasswordInvalid(string? password)
{
    return string.IsNullOrWhiteSpace(password);
}

string? GetAuthenticatedUserId(ClaimsPrincipal user)
{
    return user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? user.FindFirst("sub")?.Value;
}

if (app.Environment.IsDevelopment())
{

    app.MapOpenApi();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
}

app.MapPost("/auth/register", async (RegisterRequest request) =>
{
    if (IsEmailInvalid(request.Email))
    {
        return Results.BadRequest("A valid email is required.");
    }

    if (IsPasswordInvalid(request.Password))
    {
        return Results.BadRequest("Password can't be empty.");
    }

    var user = await authService.RegisterAsync(request.Email, request.Password);

    if (user is null)
    {
        return Results.Conflict("A user with this email already exists.");
    }

    return Results.Created($"/auth/users/{user.Id}", new
    {
        user.Id,
        user.Email,
        user.CreatedAtUtc
    });
});

app.MapPost("/auth/login", async (LoginRequest request) =>
{
    if (IsEmailInvalid(request.Email))
    {
        return Results.BadRequest("A valid email is required.");
    }

    if (IsPasswordInvalid(request.Password))
    {
        return Results.BadRequest("Password can't be empty.");
    }

    var user = await authService.LoginAsync(request.Email, request.Password);

    if (user is null)
    {
        return Results.Unauthorized();
    }

    var token = authService.GenerateToken(user);

    return Results.Ok(new
    {
        Message = "Login successful.",
        Token = token,
        User = new
        {
            user.Id,
            user.Email,
            user.CreatedAtUtc
        }
    });
});

app.MapGet("/auth/test", () =>
{
    return Results.Ok("You are authenticated.");
})
.RequireAuthorization();

app.MapGet("/auth/me", (ClaimsPrincipal user) =>
{
    var userId = GetAuthenticatedUserId(user);

    var email =
        user.FindFirst(ClaimTypes.Email)?.Value ??
        user.FindFirst("email")?.Value;

    return Results.Ok(new
    {
        Id = userId,
        Email = email
    });
})
.RequireAuthorization();

app.MapPost("/tasks", async (TaskCrt request, ClaimsPrincipal user) =>
{
    var userId = GetAuthenticatedUserId(user);

    if (string.IsNullOrWhiteSpace(userId))
    {
        return Results.Unauthorized();
    }

    if (IsTaskNameInvalid(request.TaskName))
    {
        return Results.BadRequest("Task name can't be empty.");
    }

    var newTask = new TaskObj
    {
        UserId = userId,
        Name = request.TaskName,
        Completed = false
    };

    await taskService.CreateAsync(newTask);

    return Results.Created($"/tasks/{newTask.Id}", newTask);
})
.RequireAuthorization();

app.MapDelete("/tasks/{id}", async (string id, ClaimsPrincipal user) =>
{
    var userId = GetAuthenticatedUserId(user);

    if (string.IsNullOrWhiteSpace(userId))
    {
        return Results.Unauthorized();
    }

    if (IsMongoIdInvalid(id))
    {
        return Results.BadRequest("Invalid task id.");
    }

    var deletedCount = await taskService.DeleteAsync(id, userId);

    if (deletedCount == 0)
    {
        return Results.NotFound("Task not found.");
    }

    return Results.Ok("Task deleted.");
})
.RequireAuthorization();

app.MapPut("/tasks/{id}", async (string id, TaskPut request, ClaimsPrincipal user) =>
{
    var userId = GetAuthenticatedUserId(user);

    if (string.IsNullOrWhiteSpace(userId))
    {
        return Results.Unauthorized();
    }

    if (IsMongoIdInvalid(id))
    {
        return Results.BadRequest("Invalid task id.");
    }
    
    var task = await taskService.GetByIdAsync(id, userId);

    if (task is null)
    {
        return Results.NotFound("Task not found.");
    }
    if (IsTaskNameInvalid(request.TaskName))
    {
        return Results.BadRequest("Task name can't be empty.");
    }

    task.Name = request.TaskName;
    task.Completed = request.Completed;

    await taskService.UpdateAsync(id, userId, task);

    return Results.Ok(task);
}
)
.RequireAuthorization();

app.MapGet("/tasks/completed", async (ClaimsPrincipal user) => {
    var userId = GetAuthenticatedUserId(user);

    if (string.IsNullOrWhiteSpace(userId))
    {
        return Results.Unauthorized();
    }

    var completedTasks = await taskService.GetCompletedAsync(userId);

    return Results.Ok(completedTasks);
})
.RequireAuthorization();

app.MapGet("/tasks/pending", async (ClaimsPrincipal user) => {
    var userId = GetAuthenticatedUserId(user);

    if (string.IsNullOrWhiteSpace(userId))
    {
        return Results.Unauthorized();
    }
    
    var pendingTasks = await taskService.GetPendingAsync(userId);

    return Results.Ok(pendingTasks);
})
.RequireAuthorization();

app.MapGet("/tasks/{id}", async (string id, ClaimsPrincipal user) =>
{
    var userId = GetAuthenticatedUserId(user);

    if (string.IsNullOrWhiteSpace(userId))
    {
        return Results.Unauthorized();
    }

    if (IsMongoIdInvalid(id))
    {
        return Results.BadRequest("Invalid task id.");
    }

    var task = await taskService.GetByIdAsync(id, userId);

    if (task is null)
    {
        return Results.NotFound("Task not found.");
    }

    return Results.Ok(task);
}
)
.RequireAuthorization();

app.MapGet("/tasks", async (ClaimsPrincipal user) =>
{
    var userId = GetAuthenticatedUserId(user);

    if (string.IsNullOrWhiteSpace(userId))
    {
        return Results.Unauthorized();
    }

    var tasks = await taskService.GetAllAsync(userId);
    return Results.Ok(tasks);
})
.RequireAuthorization();

app.Run();





