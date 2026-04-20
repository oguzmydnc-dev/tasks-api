import { CheckCircle2, CircleDashed, ListTodo } from "../icons";

function StatsCards({ tasks }) {
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.filter((task) => !task.completed).length;

  return (
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
  );
}

export default StatsCards;