const AUTH_TOKEN_STORAGE_KEY = "tasks-dashboard-auth-token"
export const AUTH_SESSION_CLEARED_EVENT = "tasks-dashboard-auth-session-cleared"

export function getStoredAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || ""
}

export function setStoredAuthToken(token) {
  if (!token) {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    return
  }

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
}

export function clearStoredAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
}

export function clearAuthSession(reason = "logout") {
  clearStoredAuthToken()
  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_CLEARED_EVENT, {
      detail: { reason },
    }),
  )
}

export function getAuthHeaders(headers = {}, token = getStoredAuthToken()) {
  if (!token) {
    return headers
  }

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  }
}
