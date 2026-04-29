import { useAuth } from "../context/useAuth"

function AdminPage({ navigate }) {
  const { currentUser, logout } = useAuth()

  return (
    <div className="app-shell">
      <div className="page-topbar">
        <button className="brand-button" onClick={() => navigate("/")}>
          Tasks Dashboard
        </button>

        <div className="auth-actions">
          <span className="status-pill">
            {currentUser?.email || "Admin"}
          </span>
          <button className="btn btn-ghost" onClick={() => navigate("/")}>
            Back to Dashboard
          </button>
          <button className="btn btn-ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="hero">
        <span className="eyebrow">Admin Only</span>
        <h1>Admin Area</h1>
        <p>
          This is a minimal placeholder route for admin-only frontend access.
          Management features can be added here later without changing the
          current dashboard flow.
        </p>
      </div>

      <div className="card">
        <h2>Role foundation ready</h2>
        <p>
          Your account has admin access, so this route is available. No admin
          management actions are enabled yet.
        </p>
      </div>
    </div>
  )
}

export default AdminPage
