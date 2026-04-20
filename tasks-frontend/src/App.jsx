import { useEffect, useState } from "react";
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
import StatsCards from "./components/StatsCards";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskItem from "./components/TaskItem";
import { useAuth } from "./context/useAuth";

function isEmptyOrSpaces(str) {
  return !str || str.trim() === "";
}

async function fetchTasksData(filter, setLoading, setTasks, setError) {
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

function App({ navigate = () => {} }) {
  const { isAuthenticated, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchTasksData(filter, setLoading, setTasks, setError);
  }, [filter]);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [success]);

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
      await fetchTasksData(filter, setLoading, setTasks, setError);
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
      await fetchTasksData(filter, setLoading, setTasks, setError);
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
      await fetchTasksData(filter, setLoading, setTasks, setError);
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
      await fetchTasksData(filter, setLoading, setTasks, setError);
    } catch (error) {
      setError("Something went wrong while updating.");
      console.error(error);
    }
  }

  return (
    <div className="app-shell">
      {success && <div className="toast toast-success">{success}</div>}

      <div className="page-topbar">
        <button className="brand-button" onClick={() => navigate("/")}>
          Tasks Dashboard
        </button>

        <div className="auth-actions">
          {isAuthenticated ? (
            <>
              <span className="status-pill">Signed in</span>
              <button className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => navigate("/login")}>
                Login
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      <div className="hero">
        <h1>Tasks Dashboard</h1>
        <p>
          Minimal, modern and clean task management interface powered by your
          ASP.NET Core + MongoDB API.
        </p>
      </div>

      <StatsCards tasks={tasks} />

      <div className="grid">
        <TaskForm
          taskName={taskName}
          setTaskName={setTaskName}
          createTask={createTask}
          error={error}
          setError={setError}
        />

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

          <TaskList
            tasks={tasks}
            loading={loading}
            editingTaskId={editingTaskId}
            editTaskName={editTaskName}
            setEditTaskName={setEditTaskName}
            startEdit={startEdit}
            cancelEdit={cancelEdit}
            updateTaskName={updateTaskName}
            toggleTaskStatus={toggleTaskStatus}
            openDeleteModal={openDeleteModal}
          />
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
