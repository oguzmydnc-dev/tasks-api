# Software Design Document (SDD)
## Project: Tasks Dashboard

## 1. Purpose

Tasks Dashboard is a full-stack task management project built for learning, portfolio development, and progressive backend/frontend skill development.

The project started as a backend-only ASP.NET Core Minimal API application and later evolved into a full-stack application with a React + Vite frontend.

This document describes the architecture, scope, technical choices, folder structure, workflows, coding expectations, and future direction of the project so that a coding agent such as Codex can work on the project consistently.

---

## 2. Project Goals

### Primary goals
- Build a functional task management application
- Practice backend development with ASP.NET Core Minimal API
- Practice MongoDB integration
- Practice frontend development with React + Vite
- Practice component-based UI design
- Practice clean Git workflow with feature branches and milestone releases

### Secondary goals
- Establish a maintainable folder structure
- Improve code organization through services and components
- Prepare the project for authentication and authorization
- Prepare the project for role-based access and an admin panel

---

## 3. Current Scope

### Backend
- CRUD for tasks
- MongoDB persistence
- Validation
- Completed / pending filtering
- Swagger / OpenAPI support
- Service layer for task data access

### Frontend
- Task list rendering
- Create task form
- Edit task name
- Toggle completed state
- Delete task with confirmation modal
- Filtering
- Dashboard stats cards
- Loading state
- Success toast feedback
- Responsive layout
- Local SVG icons
- API request abstraction in a service module

### Completed milestone
- v0.1.0: first frontend + backend milestone

---

## 4. Out of Scope for Now

The following are intentionally not completed yet and should be treated as future work unless explicitly requested:
- Authentication
- JWT
- Register / login UI
- Role-based access
- Admin dashboard
- User ownership of tasks
- Docker
- Automated tests
- Deployment pipeline

---

## 5. Repository Structure

```text
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
│   │   ├── components/
│   │   │   ├── StatsCards.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── TaskList.jsx
│   │   ├── services/
│   │   │   └── taskApi.js
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
│   └── vite.config.js
│
├── ListApi.sln
├── README.md
├── COMMIT_GUIDE.md
├── CHANGELOG.md
└── .gitmessage.txt
```

---

## 6. Architecture Overview

## 6.1 Backend Architecture

The backend follows a lightweight structure based on ASP.NET Core Minimal API.

### Responsibilities
- `Program.cs`
  - application bootstrapping
  - route definitions
  - middleware setup
  - dependency setup
- `TaskService.cs`
  - communication with MongoDB
  - task collection access
  - CRUD database operations
- models / request records
  - `TaskObj.cs`
  - `TaskCrt.cs`
  - `TaskPut.cs`
  - `MongoDbSettings.cs`

### Backend design intention
The backend should remain simple, readable, and easy to extend.
Business/data-access concerns should move into service classes rather than being kept directly inside route handlers.

---

## 6.2 Frontend Architecture

The frontend follows a component-based React structure.

### Responsibilities
- `App.jsx`
  - page-level orchestration
  - top-level state
  - event handlers
  - integration with services and components
- `services/taskApi.js`
  - all HTTP requests to backend
  - base API URL resolution through Vite env config
- components
  - `StatsCards.jsx`
  - `TaskForm.jsx`
  - `TaskList.jsx`
  - `TaskItem.jsx`
- `icons.jsx`
  - local SVG icon components

### Frontend design intention
The frontend should keep UI components presentational where possible.
API details should stay inside the service module, not be duplicated across components.

---

## 7. Data Model

## 7.1 Task model

### Stored task
```json
{
  "id": "mongo-object-id-string",
  "name": "Learn MongoDB",
  "completed": false
}
```

### Fields
- `id`: MongoDB ObjectId string
- `name`: task title
- `completed`: boolean completion flag

---

## 8. API Design

### GET `/tasks`
Returns all tasks

### GET `/tasks/{id}`
Returns one task by id

### GET `/tasks/completed`
Returns completed tasks

### GET `/tasks/pending`
Returns pending tasks

### POST `/tasks`
Creates a new task

Request:
```json
{
  "taskName": "New task"
}
```

### PUT `/tasks/{id}`
Updates task name and completion state

Request:
```json
{
  "taskName": "Updated task",
  "completed": true
}
```

### DELETE `/tasks/{id}`
Deletes a task

---

## 9. Validation Rules

### Backend validation
- task name cannot be empty
- task name cannot be whitespace only
- MongoDB id must be valid ObjectId format

### Frontend validation
- prevent empty task submission
- show visible error message
- apply visual input error feedback

---

## 10. UI/UX Rules

### Design direction
- modern
- minimal
- dark theme
- green accent palette
- clean spacing
- responsive layout

### Existing UX behavior
- loading state while fetching tasks
- toast feedback after successful operations
- delete confirmation modal
- dashboard stat cards
- completed/pending filtering

### UI constraints
- avoid cluttered layouts
- use consistent button sizes in action areas
- prefer subtle surfaces over aggressive gradients
- maintain accessibility and readability

---

## 11. Environment Configuration

## 11.1 Backend
MongoDB configuration is stored in:
- `backend/appsettings.json`
- `backend/appsettings.Development.json`

Sensitive credentials should not be committed.

## 11.2 Frontend
The frontend must use Vite environment variables.

Required:
```env
VITE_API_BASE_URL=http://localhost:5218
```

The frontend should never hardcode environment-specific API URLs if configuration can be used.

---

## 12. Git Workflow

### Branching rules
- never work directly on `main`
- use feature branches for every distinct task
- use release branches for milestone preparation if needed

### Branch naming examples
- `feature/frontend-loading-state`
- `feature/frontend-delete-confirmation`
- `feature/auth-foundation`
- `release/v0.1.0`

### Commit rules
Use small, focused, readable commits.

Examples:
- `feat: add register endpoint`
- `fix: prevent empty task submission`
- `refactor: extract task list into component`
- `docs: update README for v0.1.0`

---

## 13. Release Strategy

### Current releases
- `v0.0.1` → backend-only milestone
- `v0.1.0` → full-stack frontend CRUD milestone

### Versioning intent
Use semantic versioning style:
- patch for small fixes
- minor for new milestone features
- major when the project becomes significantly more stable/public

Examples:
- `v0.1.1` → bugfix after current release
- `v0.2.0` → auth milestone
- `v1.0.0` → stable milestone after auth/role/admin maturity

---

## 14. Near-Term Roadmap

### Next major block: authentication
Planned order:
1. user model
2. user collection
3. register endpoint
4. password hashing
5. login endpoint
6. JWT generation
7. frontend login/register pages
8. protected routes

### Then
- user-specific task ownership
- role system
- admin panel

---

## 15. Coding Rules for Agents

A coding agent working on this project should follow these rules:

- preserve current folder structure
- prefer incremental changes over sweeping rewrites
- keep backend and frontend concerns separate
- do not introduce unnecessary packages when a simple local solution already exists
- keep UI consistent with the existing dark + green dashboard style
- keep API calls inside `taskApi.js`
- avoid working directly on `main`
- propose branch names and commit messages
- prefer maintainable code over clever code
- do not remove existing working behavior without explicit instruction
- when adding major functionality, update README and CHANGELOG if appropriate

---

## 16. Definition of Done

A task is considered done when:
- the code works locally
- backend and frontend both still run
- no existing behavior is unintentionally broken
- the change matches the current architecture
- commit message is clear
- the branch is ready to merge or release

---

## 17. Summary

This project is a structured full-stack learning project with real portfolio value.
It should evolve gradually, with disciplined Git usage, clear milestones, and maintainable code organization.
