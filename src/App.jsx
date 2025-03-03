import "./App.css";
import ToDoList from "./components/ToDoList";
import Header from "./components/Header";
import React, { useState, useEffect } from "react";
import { ModalProvider } from "./contexts/ModalContext";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL + "?_limit=10");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (formData) => {
    const newTask = { id: Date.now(), title: formData.title, completed: false, category: formData.category };
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
      const data = await response.json();
      setTasks((prevTasks) => [{ ...data, id: newTask.id }, ...prevTasks]); // functional update pattern
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const editTask = async (id, updateField) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateField),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, ...updateField } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <ModalProvider>
      <Header addTask={addTask}></Header>
      <ToDoList
        tasks={tasks}
        editTask={editTask}
        deleteTask={deleteTask}
      />
    </ModalProvider>
  );
}

export default App;
