import { clearAuthSession, getAuthHeaders } from "./authToken"

const rawApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5218"

const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "")

async function getErrorMessage(response, fallbackMessage) {
  const contentType = response.headers.get("content-type")

  if (contentType && contentType.includes("application/json")) {
    const data = await response.json()
    return data?.message || fallbackMessage
  }

  const text = await response.text()
  return text || fallbackMessage
}

async function createHttpError(response, fallbackMessage) {
  const error = new Error(await getErrorMessage(response, fallbackMessage))
  error.status = response.status
  return error
}

async function handleResponse(
  response,
  errorMessage,
  { clearOnUnauthorized = false } = {},
) {
  if (!response.ok) {
    if (clearOnUnauthorized && response.status === 401) {
      clearAuthSession("expired")
    }

    throw await createHttpError(response, errorMessage)
  }

  const contentType = response.headers.get("content-type")

  if (contentType && contentType.includes("application/json")) {
    return await response.json()
  }

  return null
}

export async function registerApi({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  return await handleResponse(response, "Registration could not be completed.")
}

export async function loginApi({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  return await handleResponse(response, "Login could not be completed.")
}

export async function getMeApi(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders({}, token),
  })

  return await handleResponse(response, "Authenticated user could not be loaded.")
}

export async function getUsersApi(token) {
  const response = await fetch(`${API_BASE_URL}/auth/users`, {
    headers: getAuthHeaders({}, token),
  })

  return await handleResponse(response, "Users could not be loaded.", {
    clearOnUnauthorized: true,
  })
}
