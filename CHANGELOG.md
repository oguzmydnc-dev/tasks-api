# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

### Added
- Backend auth foundation with `User`, `RegisterRequest`, `LoginRequest`, and `AuthService`
- Initial `POST /auth/register` endpoint with email validation, duplicate email check, and password hashing
- Initial `POST /auth/login` endpoint with normalized email lookup and password verification
- JWT configuration model and backend JWT authentication setup
- Frontend auth API service and auth state foundation with localStorage token persistence
- Frontend login and register pages with lightweight client-side routing
- Minimal protected frontend routing for auth redirects and dashboard access control
- Frontend `/auth/me` integration for restoring the authenticated user from a stored JWT
- User-owned task access with JWT-protected task endpoints

### Changed
- Added `UsersCollectionName` to backend MongoDB settings
- Login now returns a JWT token on successful authentication

---

## [v0.1.0] - Frontend CRUD dashboard milestone

### Added
- React + Vite frontend
- Task list UI
- Task creation from frontend
- Task editing
- Task status toggle
- Task delete flow with confirmation modal
- Completed / pending filters
- Dashboard stats cards
- Success toast feedback
- Responsive layout
- Local SVG icons
- API service module

### Changed
- Reorganized repository into `backend/` and `tasks-frontend/`
- Updated README for full-stack structure

---

## [v0.0.1] - Initial backend API release

### Added
- ASP.NET Core Minimal API backend
- MongoDB integration
- CRUD endpoints for tasks
- Swagger / OpenAPI
- Basic validation
