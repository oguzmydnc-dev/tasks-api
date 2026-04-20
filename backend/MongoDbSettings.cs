using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

class MongoDbSettings
{
    public string ConnectionString { get; set; } = "";
    public string DatabaseName { get; set; } = "";
    public string CollectionName { get; set; } = "";
    public string UsersCollectionName { get; set; } = "";
}
