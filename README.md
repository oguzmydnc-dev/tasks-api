# Tasks Dashboard

A full-stack task management project built with:

- **ASP.NET Core Minimal API**
- **MongoDB**
- **React**
- **Vite**

This project started as a backend learning project and evolved into a modern full-stack task dashboard with task management, filtering, editing, status updates, and responsive UI support.

---

## Overview

Tasks Dashboard is a learning and portfolio project that combines a REST-style backend API with a responsive frontend interface.

The backend handles task storage and business logic using ASP.NET Core and MongoDB.  
The frontend provides a clean dashboard experience where users can create, update, filter, and manage tasks visually.

---

## Features

### Backend
- Create a new task
- Get all tasks
- Get a single task by ID
- Update a task
- Delete a task
- Get completed tasks
- Get pending tasks
- Register a new user
- Log in with an existing user
- Generate a JWT on successful login
- Validate empty task names
- Validate MongoDB ObjectId format
- Validate register email format
- Verify passwords with ASP.NET Core password hashing
- MongoDB Atlas integration
- Swagger / OpenAPI support

### Frontend
- Display all tasks
- Create tasks from the UI
- Edit task names
- Toggle task status
- Delete tasks
- Filter by all / completed / pending
- Dashboard stats cards
- Loading state
- Success toast feedback
- Delete confirmation modal
- Responsive layout
- Local SVG icon support
- API service layer separation
- Component-based UI structure
- Auth API service foundation
- JWT token persistence in localStorage
- Login and register screens
- Lightweight client-side routing for auth pages

---

## Tech Stack

### Backend
- ASP.NET Core Minimal API
- MongoDB
- MongoDB Atlas
- MongoDB.Driver
- Swagger UI / OpenAPI

### Frontend
- React
- Vite
- CSS
- Local SVG icons

---

## Project Structure

```bash
tasks-api/
├── backend/
│   ├── Properties/
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── ListApi.csproj
│   ├── Program.cs
│   ├── MongoDbSettings.cs
│   ├── TaskCrt.cs
│   ├── TaskObj.cs
│   ├── TaskPut.cs
│   └── TaskService.cs
│
├── tasks-frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── components/
│   │   │   ├── AuthScreen.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── TaskList.jsx
│   │   ├── context/
│   │   │   ├── authContext.js
│   │   │   ├── AuthContext.jsx
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   ├── authApi.js
│   │   │   └── taskApi.js
│   │   ├── AppRouter.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── icons.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
│
├── ListApi.sln
├── README.md
└── .gitignore
```

---

## Backend API Endpoints

### Get all tasks
`GET /tasks`

### Get a task by ID
`GET /tasks/{id}`

### Create a new task
`POST /tasks`

```json
{
  "taskName": "Learn ASP.NET Core"
}
```

### Register a new user
`POST /auth/register`

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

### Log in
`POST /auth/login`

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

Returns `200 OK` with a JWT token for valid credentials and `401 Unauthorized` for invalid login attempts.

### Update a task
`PUT /tasks/{id}`

```json
{
  "taskName": "Learn MongoDB",
  "completed": true
}
```

### Delete a task
`DELETE /tasks/{id}`

### Get completed tasks
`GET /tasks/completed`

### Get pending tasks
`GET /tasks/pending`

---

## Response Codes

- `200 OK` → successful request
- `201 Created` → resource created successfully
- `400 Bad Request` → invalid input
- `404 Not Found` → task not found

---

## Validation

This project includes validation for:
- empty task names
- task names containing only whitespace
- invalid MongoDB ObjectId values
- empty passwords during registration
- invalid email format during registration
- empty passwords during login
- invalid email format during login

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/oguzmydnc-dev/tasks-api.git
cd tasks-api
```

### 2. Backend Setup

Go to the backend folder:

```bash
cd backend
```

Restore dependencies:

```bash
dotnet restore
```

Configure your MongoDB connection in `appsettings.Development.json`:

```json
{
  "MongoDbSettings": {
    "ConnectionString": "YOUR_MONGODB_CONNECTION_STRING",
    "DatabaseName": "TaskDb",
    "CollectionName": "Tasks",
    "UsersCollectionName": "Users"
  },
  "JwtSettings": {
    "Issuer": "TasksDashboard",
    "Audience": "TasksDashboardClient",
    "Key": "CHANGE_THIS_TO_A_LONG_RANDOM_DEVELOPMENT_KEY",
    "ExpirationMinutes": 60
  }
}
```

> Do not commit real MongoDB credentials to GitHub.

Run the backend:

```bash
dotnet watch run
```

or:

```bash
dotnet run
```

Swagger UI will be available at:

```text
http://localhost:5218/swagger
```

### 3. Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd tasks-frontend
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

#### `.env.local`
```env
VITE_API_BASE_URL=http://localhost:5218
```

Run the frontend:

```bash
npm run dev
```

---

## Frontend Environment Variables

Example file:

#### `.env.example`
```env
VITE_API_BASE_URL=http://localhost:5218
```

---

## Development Notes

- The frontend communicates with the backend through a dedicated API service module.
- Task operations are handled through reusable React components.
- The project uses local SVG icon components instead of third-party icon dependencies.
- The current setup is split into separate `backend` and `tasks-frontend` folders for better maintainability.
- The backend now includes initial auth foundation files with register, login, and JWT token generation.
- The frontend now includes a lightweight auth provider that persists the JWT token in `localStorage` and exposes `login`, `register`, and `logout` helpers.
- The frontend now includes login and register pages with a small built-in router, without adding a routing package yet.

---

## Learning Goals

This project helped me practice:

- backend API development with ASP.NET Core Minimal API
- MongoDB integration
- CRUD operations
- validation and error handling
- async/await usage
- service layer separation
- frontend development with React + Vite
- component-based UI design
- API integration from frontend to backend
- responsive dashboard design
- Git branch workflow and milestone-based development

---

## Release Milestones

- `v0.0.1` → Initial backend-only release
- `v0.1.0` → Full frontend CRUD dashboard milestone

---

## Future Improvements

- authentication / authorization
- protected pages
- role-based access
- admin panel
- user-specific task ownership
- Docker support
- tests
- deployment

---

## License

This project was created for learning and portfolio purposes.
