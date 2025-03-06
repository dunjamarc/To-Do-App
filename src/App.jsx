import "./App.css";
import ToDoList from "./components/ToDoList";
import Header from "./components/Header";
import React, { useState, useEffect } from "react";
import { ModalProvider } from "./contexts/ModalContext";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [pageCounter, setPageCounter] = useState(2);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL + "?_limit=10");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);
        setAllTasks(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (formData) => {
    const newTask = {
      id: Date.now(),
      title: formData.title,
      completed: false,
      category: formData.category,
    };
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
      setAllTasks((prevTasks) => {
        // functional update pattern
        const updatedTasks = [{ ...data, id: newTask.id }, ...prevTasks];
        applyFilter(updatedTasks, currentFilter);
        return updatedTasks;
      });
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
      setAllTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task.id === id ? { ...task, ...updateField } : task
        );
        applyFilter(updatedTasks, currentFilter);
        return updatedTasks;
      });
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
      setAllTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task.id !== id);
        applyFilter(updatedTasks, currentFilter);
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const applyFilter = (taskList, category) => {
    if (category === "all") {
      setTasks(taskList);
    } else {
      const filtered = taskList.filter(
        (task) => Object.hasOwn(task, "category") && task.category === category
      );
      setTasks(filtered);
    }
  };

  const filterTasks = (category) => {
    setCurrentFilter(category);
    applyFilter(allTasks, category);
  };

  const loadMoreItems = () => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${API_URL}?_page=${pageCounter}&_limit=10`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();

        if (data.length === 0) {
          setHasMoreItems(false);
          return;
        }

        setTasks((prevTasks) => [...prevTasks, ...data]);
        setAllTasks((prevTasks) => [...prevTasks, ...data]);
        setPageCounter((prevPage) => prevPage + 1);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTasks();
  };

  return (
    <ModalProvider>
      <Header addTask={addTask} filterTasks={filterTasks}></Header>
      <ToDoList tasks={tasks} editTask={editTask} deleteTask={deleteTask} />
      {hasMoreItems && (
        <button className="more-items" onClick={loadMoreItems}>
          More Items
        </button>
      )}
    </ModalProvider>
  );
}

export default App;
