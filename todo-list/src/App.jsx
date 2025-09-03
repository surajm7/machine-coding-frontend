import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask }]);
    setNewTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text: editText } : task)));
    setEditingId(null);
    setEditText("");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>To-Do List</h2>

      {/* Input + Add Button */}
      <div style={{ display: "flex", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ flex: 1, padding: "6px" }}
        />
        <button onClick={addTask} style={{ marginLeft: "5px", padding: "6px 12px" }}>
          Add
        </button>
      </div>

      {/* Task List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "6px",
              border: "1px solid #ccc",
              marginBottom: "6px",
              borderRadius: "4px",
            }}
          >
            {editingId === task.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ flex: 1, padding: "4px" }}
                />
                <button
                  onClick={() => saveEdit(task.id)}
                  style={{ marginLeft: "5px", padding: "4px 8px" }}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span>{task.text}</span>
                <div>
                  <button
                    onClick={() => startEdit(task.id, task.text)}
                    style={{ marginRight: "5px", padding: "4px 8px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{ padding: "4px 8px" }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
