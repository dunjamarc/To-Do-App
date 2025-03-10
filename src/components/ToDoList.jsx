import React from "react";
import ListItem from "./ListItem";
import { ClipLoader } from "react-spinners";

const ToDoList = ({ tasks, editTask, deleteTask, loading }) => {

  return (
    <div>
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          task={task}
          editTask={editTask}
          deleteTask={deleteTask}
        ></ListItem>
      ))}
      <ClipLoader
        loading={loading}
        aria-label="Loading Spinner"
      />
    </div>
  );
};

export default ToDoList;
