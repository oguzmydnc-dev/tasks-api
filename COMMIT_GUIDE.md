# Commit Guide

This project uses a simple and consistent commit style.

## Goal

Commits should be:
- small
- focused
- readable
- easy to scan later

A commit should describe one clear change.

---

## Format

```text
type: short summary
```

### Examples
```text
feat: add login endpoint
feat: create task stats cards
fix: handle empty task name validation
refactor: move task API calls into service module
style: improve responsive layout for mobile
docs: update README for v0.1.0
chore: reorganize backend into separate folder
```

---

## Allowed Types

### `feat`
New feature

### `fix`
Bug fix

### `refactor`
Code cleanup without changing behavior

### `style`
UI / styling / layout changes

### `docs`
Documentation changes

### `chore`
Project maintenance / setup / config

---

## Rules

### 1. One commit = one purpose
Bad:
```text
feat: add login page and fix navbar and update README
```

Good:
```text
feat: add login page
fix: correct navbar alignment
docs: update README auth section
```

### 2. Use lowercase
Good:
```text
feat: add task filter buttons
```

Bad:
```text
Feat: Add Task Filter Buttons
```

### 3. Keep it short
Good:
```text
fix: prevent invalid task id requests
```

Bad:
```text
fix: added a lot of validation and changed many things related to ids
```

### 4. Write what changed
Bad:
```text
fix: final version
fix: last update
fix: maybe works now
```

Good:
```text
fix: handle loading state correctly
fix: close delete modal after task removal
```

---

## Recommended Workflow

1. create a feature branch
2. make a focused change
3. test it
4. commit with a clear message
5. push it

Example:

```bash
git checkout -b feature/auth-foundation
git add .
git commit -m "feat: add user model for auth"
git push -u origin feature/auth-foundation
```
