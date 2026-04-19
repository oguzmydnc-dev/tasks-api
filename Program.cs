using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi(options =>
{
    options.OpenApiVersion = Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_0;
});

var mongoDbSettings = builder.Configuration
    .GetSection("MongoDbSettings")
    .Get<MongoDbSettings>();

if (mongoDbSettings is null)
{
    throw new Exception("MongoDbSettings not found.");
}

var taskService = new TaskService(mongoDbSettings);

var app = builder.Build();

bool IsTaskNameInvalid(string taskName)
{
    return string.IsNullOrWhiteSpace(taskName);
}

bool IsMongoIdInvalid(string id)
{
    return !ObjectId.TryParse(id, out _);
}

if (app.Environment.IsDevelopment())
{

    app.MapOpenApi();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
}

app.MapPost("/tasks", async (TaskCrt request) =>
{
    if (IsTaskNameInvalid(request.TaskName))
    {
        return Results.BadRequest("Task name can't be empty.");
    }

    var newTask = new TaskObj
    {
        Name = request.TaskName,
        Completed = false
    };

    await taskService.CreateAsync(newTask);

    return Results.Created($"/tasks/{newTask.Id}", newTask);
});

app.MapDelete("/tasks/{id}", async (string id) =>
{
    if (IsMongoIdInvalid(id))
    {
        return Results.BadRequest("Invalid task id.");
    }

    var deletedCount = await taskService.DeleteAsync(id);

    if (deletedCount == 0)
    {
        return Results.NotFound("Task not found.");
    }

    return Results.Ok("Task deleted.");
});

app.MapPut("/tasks/{id}", async (string id, TaskPut request) =>
{
    if (IsMongoIdInvalid(id))
    {
        return Results.BadRequest("Invalid task id.");
    }
    
    var task = await taskService.GetByIdAsync(id);

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

    await taskService.UpdateAsync(id, task);

    return Results.Ok(task);
}
);

app.MapGet("/tasks/completed", async () => {

    var completedTasks = await taskService.GetCompletedAsync();

    return Results.Ok(completedTasks);
});

app.MapGet("/tasks/pending", async () => {
    
    var pendingTasks = await taskService.GetPendingAsync();

    return Results.Ok(pendingTasks);
});

app.MapGet("/tasks/{id}", async (string id) =>
{
    if (IsMongoIdInvalid(id))
    {
        return Results.BadRequest("Invalid task id.");
    }

    var task = await taskService.GetByIdAsync(id);

    if (task is null)
    {
        return Results.NotFound("Task not found.");
    }

    return Results.Ok(task);
}
);

app.MapGet("/tasks", async () =>
{
    var tasks = await taskService.GetAllAsync();
    return Results.Ok(tasks);
});

app.Run();






