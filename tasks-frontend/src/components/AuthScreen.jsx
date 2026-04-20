import { useAuth } from "../context/useAuth"

function AuthScreen({
  title,
  description,
  submitLabel,
  loading,
  error,
  success,
  email,
  setEmail,
  password,
  setPassword,
  passwordAutoComplete = "current-password",
  onSubmit,
  alternateText,
  alternateActionLabel,
  onAlternateAction,
  navigate,
}) {
  const { isAuthenticated } = useAuth()

  const topbarAction = isAuthenticated
    ? {
        label: "Back to Dashboard",
        path: "/",
      }
    : alternateActionLabel === "Create one"
      ? {
          label: "Create account",
          path: "/register",
        }
      : {
          label: "Back to Login",
          path: "/login",
        }

  return (
    <div className="app-shell auth-shell">
      <div className="page-topbar">
        <button className="brand-button" onClick={() => navigate("/")}>
          Tasks Dashboard
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => navigate(topbarAction.path)}
        >
          {topbarAction.label}
        </button>
      </div>

      <div className="auth-layout">
        <div className="hero auth-hero">
          <span className="eyebrow">Auth Foundation</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="card auth-card">
          <form className="auth-form-stack" onSubmit={onSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete={passwordAutoComplete}
                required
              />
            </label>

            <button className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? "Please wait..." : submitLabel}
            </button>
          </form>

          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="auth-switch">
            <span>{alternateText}</span>
            <button
              className="link-button"
              type="button"
              onClick={onAlternateAction}
            >
              {alternateActionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthScreen
