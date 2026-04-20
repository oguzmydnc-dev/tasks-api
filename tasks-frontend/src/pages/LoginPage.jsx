import { useState } from "react"
import AuthScreen from "../components/AuthScreen"
import { useAuth } from "../context/useAuth"

function LoginPage({ navigate }) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function resetForm() {
    setEmail("")
    setPassword("")
    setError("")
    setLoading(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login({ email, password })
      navigate("/")
    } catch (error) {
      setError(error.message || "Login could not be completed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreen
      title="Welcome back"
      description="Log in with your existing account to continue using the tasks dashboard."
      submitLabel="Log in"
      loading={loading}
      error={error}
      success=""
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={handleSubmit}
      alternateText="Need an account?"
      alternateActionLabel="Create one"
      onAlternateAction={() => {
        resetForm()
        navigate("/register")
      }}
      onTopbarAction={() => {
        resetForm()
        navigate("/register")
      }}
      navigate={navigate}
    />
  )
}

export default LoginPage
