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
    public async Task<List<TaskObj>> GetAllAsync(string userId)
    {
        return await _tasksCollection.Find(task => task.UserId == userId).ToListAsync();
    }
    public async Task<TaskObj?> GetByIdAsync(string id, string userId)
    {
        return await _tasksCollection
            .Find(task => task.Id == id && task.UserId == userId)
            .FirstOrDefaultAsync();
    }
    public async Task CreateAsync(TaskObj newTask)
    {
        await _tasksCollection.InsertOneAsync(newTask);
    }
    public async Task<long> DeleteAsync(string id, string userId)
    {
        var result = await _tasksCollection.DeleteOneAsync(task => task.Id == id && task.UserId == userId);
        return result.DeletedCount;
    }
    public async Task UpdateAsync(string id, string userId, TaskObj updatedTask)
    {
        await _tasksCollection.ReplaceOneAsync(task => task.Id == id && task.UserId == userId, updatedTask);
    }
    public async Task<List<TaskObj>> GetCompletedAsync(string userId)
    {
        return await _tasksCollection
            .Find(task => task.UserId == userId && task.Completed)
            .ToListAsync();
    }
    public async Task<List<TaskObj>> GetPendingAsync(string userId)
    {
        return await _tasksCollection
            .Find(task => task.UserId == userId && !task.Completed)
            .ToListAsync();
    }
}
