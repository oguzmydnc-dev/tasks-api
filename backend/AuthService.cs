using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

class AuthService
{
    private const string DefaultUserRole = "User";
    private readonly IMongoCollection<User> _usersCollection;
    private readonly PasswordHasher<User> _passwordHasher = new();
    private readonly JwtSettings _jwtSettings;

    public AuthService(MongoDbSettings settings, JwtSettings jwtSettings)
    {
        var mongoClient = new MongoClient(settings.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(settings.DatabaseName);
        _usersCollection = mongoDatabase.GetCollection<User>(settings.UsersCollectionName);
        _jwtSettings = jwtSettings;
    }

    public async Task<User?> RegisterAsync(string email, string password)
    {
        var normalizedEmail = NormalizeEmail(email);
        var existingUser = await GetByEmailAsync(normalizedEmail);

        if (existingUser is not null)
        {
            return null;
        }

        var user = new User
        {
            Email = normalizedEmail,
            Role = DefaultUserRole,
            CreatedAtUtc = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, password);

        await _usersCollection.InsertOneAsync(user);

        return user;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var normalizedEmail = NormalizeEmail(email);

        return await _usersCollection
            .Find(user => user.Email == normalizedEmail)
            .FirstOrDefaultAsync();
    }

    public async Task<User?> LoginAsync(string email, string password)
    {
        var user = await GetByEmailAsync(email);

        if (user is null)
        {
            return null;
        }

        var verifyResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);

        if (verifyResult == PasswordVerificationResult.Failed)
        {
            return null;
        }

        if (verifyResult == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _passwordHasher.HashPassword(user, password);
            await _usersCollection.ReplaceOneAsync(existingUser => existingUser.Id == user.Id, user);
        }

        return user;
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _usersCollection
            .Find(_ => true)
            .SortBy(user => user.Email)
            .ToListAsync();
    }

    public string GenerateToken(User user)
    {
        var userRole = string.IsNullOrWhiteSpace(user.Role) ? DefaultUserRole : user.Role;

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id ?? user.Email),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id ?? ""),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, userRole)
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }
}
