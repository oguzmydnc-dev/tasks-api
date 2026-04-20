import { useEffect, useState } from "react"
import App from "./App.jsx"
import { useAuth } from "./context/useAuth"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"

function normalizePath(pathname) {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/"

  if (
    normalizedPath === "/" ||
    normalizedPath === "/login" ||
    normalizedPath === "/register"
  ) {
    return normalizedPath
  }

  return "/"
}

function getCurrentPath() {
  return normalizePath(window.location.pathname)
}

function navigateTo(path, setPath) {
  const nextPath = normalizePath(path)

  if (window.location.pathname !== nextPath) {
    window.history.pushState({}, "", nextPath)
  }

  window.scrollTo(0, 0)
  setPath(nextPath)
}

function getResolvedPath(path, isAuthenticated) {
  if (!isAuthenticated && path === "/") {
    return "/login"
  }

  if (isAuthenticated && (path === "/login" || path === "/register")) {
    return "/"
  }

  return path
}

function AppRouter() {
  const { isAuthenticated, isAuthLoading } = useAuth()
  const [path, setPath] = useState(() => getCurrentPath())
  const resolvedPath = isAuthLoading ? path : getResolvedPath(path, isAuthenticated)

  useEffect(() => {
    function handlePopState() {
      setPath(getCurrentPath())
    }

    window.addEventListener("popstate", handlePopState)

    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    if (!isAuthLoading && resolvedPath !== path) {
      navigateTo(resolvedPath, setPath)
    }
  }, [isAuthLoading, path, resolvedPath])

  function navigate(pathname) {
    navigateTo(pathname, setPath)
  }

  if (isAuthLoading) {
    return (
      <div className="app-shell">
        <div className="loading-state">Loading session...</div>
      </div>
    )
  }

  if (resolvedPath === "/login") {
    return <LoginPage navigate={navigate} />
  }

  if (resolvedPath === "/register") {
    return <RegisterPage navigate={navigate} />
  }

  return <App navigate={navigate} />
}

export default AppRouter
