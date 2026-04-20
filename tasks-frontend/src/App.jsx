import { useEffect, useState } from "react";
import "./App.css";
import {
  CheckCircle2,
  CircleDashed,
  ListTodo,
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
} from "./icons";
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "./services/taskApi";

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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [taskToDelete, setTaskToDelete] = useState(null);

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.filter((task) => !task.completed).length;

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [success]);

  async function fetchTasks() {
    setLoading(true);

    try {
      const data = await getTasksApi(filter);
      setTasks(data);
    } catch (error) {
      console.error(error);
      setError("Tasks could not be fetched.");
    } finally {
      setLoading(false);
    }
  }

  async function createTask(e) {
    e.preventDefault();

    if (isEmptyOrSpaces(taskName)) {
      setError("Task name can't be empty.");
      return;
    }

    try {
      await createTaskApi(taskName);

      setError("");
      setTaskName("");
      setSuccess("Task created successfully.");
      await fetchTasks();
    } catch (error) {
      setError("Something went wrong.");
      console.error(error);
    }
  }

  function openDeleteModal(task) {
    setTaskToDelete(task);
  }

  function closeDeleteModal() {
    setTaskToDelete(null);
  }

  async function confirmDeleteTask() {
    if (!taskToDelete) return;

    try {
      await deleteTaskApi(taskToDelete.id);

      setError("");
      setSuccess("Task deleted successfully.");
      setTaskToDelete(null);
      await fetchTasks();
    } catch (error) {
      setError("Something went wrong while deleting.");
      console.error(error);
    }
  }

  async function toggleTaskStatus(task) {
    try {
      await updateTaskApi(task.id, {
        taskName: task.name,
        completed: !task.completed,
      });

      setError("");
      setSuccess("Task status updated.");
      await fetchTasks();
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
      await updateTaskApi(task.id, {
        taskName: editTaskName,
        completed: task.completed,
      });

      setError("");
      setEditingTaskId(null);
      setEditTaskName("");
      setSuccess("Task updated successfully.");
      await fetchTasks();
    } catch (error) {
      setError("Something went wrong while updating.");
      console.error(error);
    }
  }

  return (
    <div className="app-shell">
      {success && <div className="toast toast-success">{success}</div>}

      <div className="hero">
        <h1>Tasks Dashboard</h1>
        <p>
          Minimal, modern and clean task management interface powered by your
          ASP.NET Core + MongoDB API.
        </p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-top">
            <span>All Tasks</span>
            <ListTodo size={18} />
          </div>
          <strong>{tasks.length}</strong>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Completed</span>
            <CheckCircle2 size={18} />
          </div>
          <strong>{completedCount}</strong>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Pending</span>
            <CircleDashed size={18} />
          </div>
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
              <Plus size={16} />
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
                className={`btn btn-secondary ${
                  filter === "completed" ? "active" : ""
                }`}
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

          {loading ? (
            <div className="loading-state">Loading tasks...</div>
          ) : tasks.length === 0 ? (
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
                        <span className={`status-badge ${task.completed ? "done" : "todo"}`}>
                          {task.completed ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <CircleDashed size={14} />
                          )}
                          {task.completed ? "Completed" : "Pending"}
                        </span>
                      </div>

                      <div className="task-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => updateTaskName(task)}
                        >
                          <Save size={16} />
                          Save
                        </button>

                        <button className="btn btn-ghost" onClick={cancelEdit}>
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="task-main">
                        <strong>{task.name}</strong>
                        <span className={`status-badge ${task.completed ? "done" : "todo"}`}>
                          {task.completed ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <CircleDashed size={14} />
                          )}
                          {task.completed ? "Completed" : "Pending"}
                        </span>
                      </div>

                      <div className="task-actions">
                        <button className="btn btn-secondary" onClick={() => startEdit(task)}>
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button className="btn btn-ghost" onClick={() => toggleTaskStatus(task)}>
                          {task.completed ? (
                            <CircleDashed size={16} />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                          {task.completed ? "Mark Pending" : "Mark Completed"}
                        </button>

                        <button className="btn btn-danger" onClick={() => openDeleteModal(task)}>
                          <Trash2 size={16} />
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

      {taskToDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Task</h3>
            <p>
              Are you sure you want to delete <strong>{taskToDelete.name}</strong>?
            </p>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDeleteTask}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;