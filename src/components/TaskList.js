import React, { useState, useEffect } from "react";
import "./TaskList.css";

export default function TaskList() {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("pomodoro-tasks");
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [newTaskName, setNewTaskName] = useState("");

    useEffect(() => {
        localStorage.setItem("pomodoro-tasks", JSON.stringify(tasks));
    }, [tasks]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newTaskName.trim()) {
            const newTask = {
                id: Date.now(),
                name: newTaskName.trim(),
                completed: false,
            };
            setTasks([...tasks, newTask]);
            setNewTaskName("");
        }
    };

    const toggleTask = (taskId) => {
        setTasks(
            tasks.map((task) => {
                if (task.id === taskId) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            })
        );
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    return (
        <div className="card mb-3">
            <div className="card-header bg-primary">
                <h2 className="h5 mb-0">Tasks</h2>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="task-form mb-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Add a new task..."
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            type="submit"
                            aria-label="Add task"
                        >
                            <i className="fa-solid fa-plus" />
                        </button>
                    </div>
                </form>
                <div className="task-list">
                    {tasks.length === 0 ? (
                        <div className="text-center text-muted">
                            <i
                                className="fa-solid fa-list-check mb-2"
                                style={{ fontSize: "2rem" }}
                            ></i>
                            <p>No tasks yet. Add one to get started!</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`task-item d-flex align-items-center p-2 mb-2 ${
                                    task.completed ? "completed" : ""
                                }`}
                            >
                                <div className="form-check flex-grow-1">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={task.completed}
                                        onChange={() => toggleTask(task.id)}
                                    />
                                    <label className="form-check-label">
                                        {task.name}
                                    </label>
                                </div>
                                <button
                                    className="btn btn-sm btn-link text-danger"
                                    onClick={() => deleteTask(task.id)}
                                    aria-label="Delete task"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
