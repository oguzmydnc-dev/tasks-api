import { Plus } from "../icons";

function TaskForm({
  taskName,
  setTaskName,
  createTask,
  error,
  setError,
}) {
  return (
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
  );
}

export default TaskForm;