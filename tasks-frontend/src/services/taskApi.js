import { getAuthHeaders } from "./authToken";

const rawApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5218";

const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

function getTasksUrl(filter) {
  if (filter === "completed") {
    return `${API_BASE_URL}/tasks/completed`;
  }

  if (filter === "pending") {
    return `${API_BASE_URL}/tasks/pending`;
  }

  return `${API_BASE_URL}/tasks`;
}

async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return null;
}

export async function getTasksApi(filter = "all") {
  const response = await fetch(getTasksUrl(filter), {
    headers: getAuthHeaders(),
  });
  return await handleResponse(response, "Tasks could not be fetched.");
}

export async function createTaskApi(taskName) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      taskName: taskName,
    }),
  });

  return await handleResponse(response, "Task could not be created.");
}

export async function updateTaskApi(id, taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(taskData),
  });

  return await handleResponse(response, "Task could not be updated.");
}



export async function deleteTaskApi(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Task could not be deleted.");
  }

  return true;
}
