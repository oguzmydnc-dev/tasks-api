const rawApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5218"

const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "")

async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    throw new Error(errorMessage)
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
