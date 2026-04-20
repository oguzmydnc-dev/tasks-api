using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

class TaskObj
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string UserId { get; set; } = "";
    public string Name { get; set; } = "";
    public bool Completed { get; set; }

}
