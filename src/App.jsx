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
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const pageLimit = 10;

  useEffect(() => {
    setPageCounter(1);
    fetchTasks(1, false, searchQuery);
  }, [sortBy, order, searchQuery]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchInput]);

  const fetchTasks = async (page = 1, append = false, searchQuery = "") => {
    setLoading(true);
    try {
      let url = `${API_URL}?_page=${page}&_limit=${pageLimit}&_sort=${sortBy}&_order=${order}`;
      if (searchQuery.trim()) {
        url += `&title_like=${encodeURIComponent(searchQuery)}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      if (data.length === 0) {
        setHasMoreItems(false);
        setTasks([]);
        return;
      }
      showLoadMoreButton(data);
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
    let filtered =
      category === "all"
        ? taskList
        : taskList.filter(
            (task) =>
              Object.hasOwn(task, "category") && task.category === category
          );

    showLoadMoreButton(filtered);
    setTasks((prev) =>
      JSON.stringify(prev) !== JSON.stringify(filtered) ? filtered : prev
    );
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

  const searchTask = (search) => {
    setSearchInput(search);
  };

  const loadMoreItems = () => {
    setPageCounter((prev) => prev + 1);
    fetchTasks(pageCounter + 1, true, searchQuery);
  };

  const showLoadMoreButton = (list) => {
    list.length < pageLimit ? setHasMoreItems(false) : setHasMoreItems(true);
  };

  return (
    <ModalProvider>
      <Header
        addTask={addTask}
        filterTasks={filterTasks}
        sortTasks={sortTasks}
        searchTask={searchTask}
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
