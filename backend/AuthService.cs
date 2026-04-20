using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;

class AuthService
{
    private readonly IMongoCollection<User> _usersCollection;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public AuthService(MongoDbSettings settings)
    {
        var mongoClient = new MongoClient(settings.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(settings.DatabaseName);
        _usersCollection = mongoDatabase.GetCollection<User>(settings.UsersCollectionName);
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

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }
}
