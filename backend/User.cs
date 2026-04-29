using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string Email { get; set; } = "";
    public string Role { get; set; } = "User";
    public string PasswordHash { get; set; } = "";
    public DateTime CreatedAtUtc { get; set; }
}
