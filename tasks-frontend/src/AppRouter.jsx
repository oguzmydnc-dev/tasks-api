import { useEffect, useState } from "react"
import App from "./App.jsx"
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

function AppRouter() {
  const [path, setPath] = useState(() => getCurrentPath())

  useEffect(() => {
    function handlePopState() {
      setPath(getCurrentPath())
    }

    window.addEventListener("popstate", handlePopState)

    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  function navigate(pathname) {
    navigateTo(pathname, setPath)
  }

  if (path === "/login") {
    return <LoginPage navigate={navigate} />
  }

  if (path === "/register") {
    return <RegisterPage navigate={navigate} />
  }

  return <App navigate={navigate} />
}

export default AppRouter
