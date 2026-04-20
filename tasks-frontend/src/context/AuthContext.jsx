import { useEffect, useState } from "react"
import AuthContext from "./authContext"
import { getMeApi, loginApi, registerApi } from "../services/authApi"
import {
  clearStoredAuthToken,
  getStoredAuthToken,
  setStoredAuthToken,
} from "../services/authToken"

function normalizeUser(user) {
  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    createdAtUtc: user.createdAtUtc || null,
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredAuthToken())
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(() => Boolean(getStoredAuthToken()))

  useEffect(() => {
    if (token) {
      setStoredAuthToken(token)
      return
    }

    clearStoredAuthToken()
  }, [token])

  useEffect(() => {
    let isActive = true

    async function loadCurrentUser() {
      if (!token) {
        setCurrentUser(null)
        setIsAuthLoading(false)
        return
      }

      setIsAuthLoading(true)

      try {
        const user = await getMeApi(token)

        if (!isActive) {
          return
        }

        setCurrentUser(normalizeUser(user))
      } catch {
        if (!isActive) {
          return
        }

        clearStoredAuthToken()
        setToken("")
        setCurrentUser(null)
      } finally {
        if (isActive) {
          setIsAuthLoading(false)
        }
      }
    }

    loadCurrentUser()

    return () => {
      isActive = false
    }
  }, [token])

  async function login(credentials) {
    const response = await loginApi(credentials)
    setToken(response?.token || "")
    setCurrentUser(normalizeUser(response?.user))
    return response
  }

  async function register(credentials) {
    return await registerApi(credentials)
  }

  function logout() {
    setToken("")
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: Boolean(token),
        currentUser,
        isAuthLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
