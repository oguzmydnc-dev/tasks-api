import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:5218/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Taskler alınamadı:", error);
    }
  }

  return (
    <div className="container">
      <h1>Tasks API Frontend</h1>

      <div className="card">
        <h2>All Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <div>
                  <strong>{task.name}</strong>
                  <p>Status: {task.completed ? "Completed" : "Pending"}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;