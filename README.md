# Tasks API

A simple and modern **Task Management API** built with **ASP.NET Core Minimal API** and **MongoDB**.

This project was created to practice backend fundamentals such as:

- CRUD operations
- HTTP methods
- request/response handling
- validation
- MongoDB integration
- service layer separation
- API testing with Swagger

---

## Features

- Create a new task
- Get all tasks
- Get a single task by ID
- Update a task
- Delete a task
- Get completed tasks
- Get pending tasks
- Validate empty task names
- Validate MongoDB ObjectId format
- MongoDB Atlas integration
- Swagger / OpenAPI support

---

## Tech Stack

- **ASP.NET Core Minimal API**
- **MongoDB**
- **MongoDB Atlas**
- **MongoDB.Driver**
- **Swagger UI / OpenAPI**

---

## Project Structure

```bash id="fwljxv"
TasksApi/
│
├── Program.cs
├── TaskService.cs
├── TaskObj.cs
├── MongoDbSettings.cs
├── TaskCrt.cs
├── TaskPut.cs
├── appsettings.json
└── README.md
Task Model
{
  "id": "6654ef2b1d9b2c7a7b9b1234",
  "name": "Learn MongoDB",
  "completed": false
}

The id field is stored as a MongoDB ObjectId.

API Endpoints
Get all tasks

GET /tasks

Get a task by id

GET /tasks/{id}

Create a new task

POST /tasks

Request body
{
  "taskName": "Learn ASP.NET Core"
}
Update a task

PUT /tasks/{id}

Request body
{
  "taskName": "Learn MongoDB",
  "completed": true
}
Delete a task

DELETE /tasks/{id}

Get completed tasks

GET /tasks/completed

Get pending tasks

GET /tasks/pending

Response Codes
200 OK → successful request
201 Created → resource created successfully
400 Bad Request → invalid input
404 Not Found → task not found
Validation

This project includes basic validation for:

empty task names
task names containing only whitespace
invalid MongoDB ObjectId values
Setup
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/tasks-api.git
cd tasks-api
2. Restore dependencies
dotnet restore
3. Configure appsettings.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "MongoDbSettings": {
    "ConnectionString": "YOUR_MONGODB_CONNECTION_STRING",
    "DatabaseName": "TaskDb",
    "CollectionName": "Tasks"
  }
}

Do not commit your real MongoDB credentials to GitHub.

4. Run the project
dotnet watch run

or

dotnet run
Swagger

After running the project, open Swagger UI:

http://localhost:5218/swagger

The port may be different on your machine.

Learning Goals

This project helped me practice:

building a REST-style API with Minimal API
connecting a .NET backend to MongoDB
using async/await in database operations
separating database logic into a service layer
validating incoming data
testing endpoints with Swagger
Future Improvements

Possible next steps for this project:

search endpoint
pagination
sorting
CreatedAt / UpdatedAt fields
PATCH /tasks/{id}/complete
authentication / authorization
frontend integration
Docker support
unit and integration tests
License

This project was created for learning and practice purposes.
=======
# tasks-api
>>>>>>> 950acded290c10f422094eff5f41e4c1f68ea15b
