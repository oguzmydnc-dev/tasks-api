import { useState } from "react"
import AuthScreen from "../components/AuthScreen"
import { useAuth } from "../context/useAuth"

function RegisterPage({ navigate }) {
  const { register } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await register({ email, password })
      setSuccess("Account created. You can log in now.")
      setEmail("")
      setPassword("")
    } catch (error) {
      setError(error.message || "Registration could not be completed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreen
      title="Create your account"
      description="Register a new account to start the authentication flow without changing the current dashboard behavior."
      submitLabel="Register"
      loading={loading}
      error={error}
      success={success}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      passwordAutoComplete="new-password"
      onSubmit={handleSubmit}
      alternateText="Already have an account?"
      alternateActionLabel="Log in"
      onAlternateAction={() => navigate("/login")}
      navigate={navigate}
    />
  )
}

export default RegisterPage
