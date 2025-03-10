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
  const [pageCounter, setPageCounter] = useState(1);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageCounter(1);
    fetchTasks(1, false);
  }, [sortBy, order]);

  const fetchTasks = async (page = 1, append = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}?_page=${page}&_limit=10&_sort=${sortBy}&_order=${order}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();

      if (data.length === 0) {
        setHasMoreItems(false);
        return;
      }

      setTasks((prevTasks) => (append ? [...prevTasks, ...data] : data));
      setAllTasks((prevTasks) => (append ? [...prevTasks, ...data] : data));
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const sortTasks = (option) => {
    const [sorted, sortOrder] = option.split(" ");
    if (sorted === sortBy && sortOrder === order) {
      return;
    }
    setTasks([]);
    setSortBy(sorted);
    setOrder(sortOrder);
  };

  const loadMoreItems = () => {
    setPageCounter((prev) => prev + 1);
    fetchTasks(pageCounter + 1, true);
  };

  return (
    <ModalProvider>
      <Header
        addTask={addTask}
        filterTasks={filterTasks}
        sortTasks={sortTasks}
      ></Header>
      <ToDoList
        tasks={tasks}
        editTask={editTask}
        deleteTask={deleteTask}
        loading={loading}
      />
      {hasMoreItems && !loading && (
        <button className="more-items" onClick={loadMoreItems}>
          More Items
        </button>
      )}
    </ModalProvider>
  );
}

export default App;
