import { clearAuthSession, getAuthHeaders } from "./authToken";

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

async function getErrorMessage(response, fallbackMessage) {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    return data?.message || fallbackMessage;
  }

  const text = await response.text();
  return text || fallbackMessage;
}

async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthSession("expired");
    }

    const error = new Error(await getErrorMessage(response, errorMessage));
    error.status = response.status;
    throw error;
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return null;
}

export async function getTasksApi(filter = "all", token) {
  const response = await fetch(getTasksUrl(filter), {
    headers: getAuthHeaders({}, token),
  });
  return await handleResponse(response, "Tasks could not be fetched.");
}

export async function createTaskApi(taskName, token) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }, token),
    body: JSON.stringify({
      taskName: taskName,
    }),
  });

  return await handleResponse(response, "Task could not be created.");
}

export async function updateTaskApi(id, taskData, token) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }, token),
    body: JSON.stringify(taskData),
  });

  return await handleResponse(response, "Task could not be updated.");
}



export async function deleteTaskApi(id, token) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders({}, token),
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthSession("expired");
    }

    const error = new Error(await getErrorMessage(response, "Task could not be deleted."));
    error.status = response.status;
    throw error;
  }

  return true;
}
