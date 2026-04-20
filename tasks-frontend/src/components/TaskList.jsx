import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  loading,
  editingTaskId,
  editTaskName,
  setEditTaskName,
  startEdit,
  cancelEdit,
  updateTaskName,
  toggleTaskStatus,
  openDeleteModal,
}) {
  if (loading) {
    return <div className="loading-state">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return <div className="empty-state">No tasks found.</div>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          editingTaskId={editingTaskId}
          editTaskName={editTaskName}
          setEditTaskName={setEditTaskName}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          updateTaskName={updateTaskName}
          toggleTaskStatus={toggleTaskStatus}
          openDeleteModal={openDeleteModal}
        />
      ))}
    </ul>
  );
}

export default TaskList;