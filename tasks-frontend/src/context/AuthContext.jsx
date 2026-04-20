import { useEffect, useState } from "react"
import AuthContext from "./authContext"
import { loginApi, registerApi } from "../services/authApi"

const AUTH_TOKEN_STORAGE_KEY = "tasks-dashboard-auth-token"

function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || ""
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
      return
    }

    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  }, [token])

  async function login(credentials) {
    const response = await loginApi(credentials)
    setToken(response?.token || "")
    return response
  }

  async function register(credentials) {
    return await registerApi(credentials)
  }

  function logout() {
    setToken("")
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: Boolean(token),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
