import { useEffect, useState } from "react";
import "./App.css";

function isEmptyOrSpaces(str) {
  return !str || str.trim() === "";
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [filter, setFilter] = useState("all");
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.filter((task) => !task.completed).length;

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  async function fetchTasks() {
    let url = "http://localhost:5218/tasks";

    if (filter === "completed") {
      url = "http://localhost:5218/tasks/completed";
    } else if (filter === "pending") {
      url = "http://localhost:5218/tasks/pending";
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Tasks could not be fetched:", error);
    }
  }

  async function createTask(e) {
    e.preventDefault();

    if (isEmptyOrSpaces(taskName)) {
      setError("Task name can't be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5218/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskName: taskName,
        }),
      });

      if (!response.ok) {
        setError("Task could not be created.");
        return;
      }

      setError("");
      setTaskName("");
      fetchTasks();
    } catch (error) {
      setError("Something went wrong.");
      console.error(error);
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`http://localhost:5218/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError("Task could not be deleted.");
        return;
      }

      setError("");
      fetchTasks();
    } catch (error) {
      setError("Something went wrong while deleting.");
      console.error(error);
    }
  }

  async function toggleTaskStatus(task) {
    try {
      const response = await fetch(`http://localhost:5218/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskName: task.name,
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        setError("Task could not be updated.");
        return;
      }

      setError("");
      fetchTasks();
    } catch (error) {
      setError("Something went wrong while updating.");
      console.error(error);
    }
  }

  function startEdit(task) {
    setEditingTaskId(task.id);
    setEditTaskName(task.name);
    setError("");
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setEditTaskName("");
  }

  async function updateTaskName(task) {
    if (isEmptyOrSpaces(editTaskName)) {
      setError("Task name can't be empty.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5218/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskName: editTaskName,
          completed: task.completed,
        }),
      });

      if (!response.ok) {
        setError("Task could not be updated.");
        return;
      }

      setError("");
      setEditingTaskId(null);
      setEditTaskName("");
      fetchTasks();
    } catch (error) {
      setError("Something went wrong while updating.");
      console.error(error);
    }
  }

  return (
    <div className="app-shell">
      <div className="hero">
        <h1>Tasks Dashboard</h1>
        <p>
          Minimal, modern and clean task management interface powered by your
          ASP.NET Core + MongoDB API.
        </p>
      </div>
      
      <div className="stats-row">
        <div className="stat-card">
          <span>All Tasks</span>
          <strong>{tasks.length}</strong>
        </div>
        <div className="stat-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>
        <div className="stat-card">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Create Task</h2>

          <form onSubmit={createTask} className="task-form">
            <input
              type="text"
              placeholder="Enter a task..."
              value={taskName}
              className={error ? "input-error" : ""}
              onChange={(e) => {
                setTaskName(e.target.value);
                setError("");
              }}
            />
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="card">
          <div className="filter-row">
            <h2>All Tasks</h2>

            <div className="filter-buttons">
              <button
                className={`btn btn-secondary ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`btn btn-secondary ${filter === "completed" ? "active" : ""}`}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
              <button
                className={`btn btn-secondary ${filter === "pending" ? "active" : ""}`}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">No tasks found.</div>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`task-item ${task.completed ? "completed" : "pending"}`}
                >
                  {editingTaskId === task.id ? (
                    <>
                      <div className="task-edit-area">
                        <input
                          type="text"
                          value={editTaskName}
                          onChange={(e) => setEditTaskName(e.target.value)}
                        />
                        <span
                          className={`status-badge ${task.completed ? "done" : "todo"}`}
                        >
                          {task.completed ? "Completed" : "Pending"}
                        </span>
                      </div>

                      <div className="task-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => updateTaskName(task)}
                        >
                          Save
                        </button>
                        <button className="btn btn-ghost" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="task-main">
                        <strong>{task.name}</strong>
                        <span
                          className={`status-badge ${task.completed ? "done" : "todo"}`}
                        >
                          {task.completed ? "Completed" : "Pending"}
                        </span>
                      </div>

                      <div className="task-actions">
                        <button
                          className="btn btn-secondary"
                          onClick={() => startEdit(task)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => toggleTaskStatus(task)}
                        >
                          {task.completed ? "Mark Pending" : "Mark Completed"}
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;