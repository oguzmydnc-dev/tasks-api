import { useEffect, useState } from "react"
import { useAuth } from "../context/useAuth"
import { getUsersApi } from "../services/authApi"

function AdminPage({ navigate }) {
  const { token, currentUser, logout } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isActive = true

    async function loadUsers() {
      setLoading(true)
      setError("")

      try {
        const data = await getUsersApi(token)

        if (!isActive) {
          return
        }

        setUsers(data || [])
      } catch (error) {
        if (!isActive) {
          return
        }

        if (error.status === 401) {
          return
        }

        setError(error.message || "Users could not be loaded.")
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      isActive = false
    }
  }, [token])

  function formatCreatedAt(createdAtUtc) {
    if (!createdAtUtc) {
      return "Created date unavailable"
    }

    return `Created ${new Date(createdAtUtc).toLocaleString()}`
  }

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
        <div className="filter-row">
          <h2>All Users</h2>
          <span className="status-pill">{users.length} users</span>
        </div>

        {loading ? <div className="loading-state">Loading users...</div> : null}
        {!loading && error ? <div className="error-message">{error}</div> : null}
        {!loading && !error && users.length === 0 ? (
          <div className="empty-state">No users found.</div>
        ) : null}

        {!loading && !error && users.length > 0 ? (
          <ul className="task-list">
            {users.map((user) => (
              <li key={user.id} className="task-item pending">
                <div className="task-main">
                  <strong>{user.email}</strong>
                  <span>{formatCreatedAt(user.createdAtUtc)}</span>
                </div>

                <span className="status-badge todo">{user.role || "User"}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

export default AdminPage
