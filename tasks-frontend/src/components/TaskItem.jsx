import { CheckCircle2, CircleDashed, Pencil, Trash2, Save, X } from "../icons";

function TaskItem({
  task,
  editingTaskId,
  editTaskName,
  setEditTaskName,
  startEdit,
  cancelEdit,
  updateTaskName,
  toggleTaskStatus,
  openDeleteModal,
}) {
  const isEditing = editingTaskId === task.id;

  return (
    <li
      className={`task-item ${task.completed ? "completed" : "pending"}`}
    >
      {isEditing ? (
        <>
          <div className="task-edit-area">
            <input
              type="text"
              value={editTaskName}
              onChange={(e) => setEditTaskName(e.target.value)}
            />

            <span className={`status-badge ${task.completed ? "done" : "todo"}`}>
              {task.completed ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
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
              {task.completed ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
              {task.completed ? "Completed" : "Pending"}
            </span>
          </div>

          <div className="task-actions">
            <button
              className="btn btn-secondary"
              onClick={() => startEdit(task)}
            >
              <Pencil size={16} />
              Edit
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => toggleTaskStatus(task)}
            >
              {task.completed ? <CircleDashed size={16} /> : <CheckCircle2 size={16} />}
              {task.completed ? "Mark Pending" : "Mark Completed"}
            </button>

            <button
              className="btn btn-danger"
              onClick={() => openDeleteModal(task)}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TaskItem;