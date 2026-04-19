using MongoDB.Driver;

class TaskService
{
    private readonly IMongoCollection<TaskObj> _tasksCollection;

    public TaskService(MongoDbSettings settings)
    {
        var mongoClient = new MongoClient(settings.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(settings.DatabaseName);
        _tasksCollection = mongoDatabase.GetCollection<TaskObj>(settings.CollectionName);
    }
    public async Task<List<TaskObj>> GetAllAsync()
    {
        return await _tasksCollection.Find(_ => true).ToListAsync();
    }
    public async Task<TaskObj?> GetByIdAsync(string id)
    {
        return await _tasksCollection.Find(task => task.Id == id).FirstOrDefaultAsync();
    }
    public async Task CreateAsync(TaskObj newTask)
    {
        await _tasksCollection.InsertOneAsync(newTask);
    }
    public async Task<long> DeleteAsync(string id)
    {
        var result = await _tasksCollection.DeleteOneAsync(task => task.Id == id);
        return result.DeletedCount;
    }
    public async Task UpdateAsync(string id, TaskObj updatedTask)
    {
        await _tasksCollection.ReplaceOneAsync(task => task.Id == id, updatedTask);
    }
    public async Task<List<TaskObj>> GetCompletedAsync()
    {
        return await _tasksCollection.Find(task => task.Completed).ToListAsync();
    }
    public async Task<List<TaskObj>> GetPendingAsync()
    {
        return await _tasksCollection.Find(task => !task.Completed).ToListAsync();
    }
}