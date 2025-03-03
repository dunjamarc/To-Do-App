import React from "react";
import ListItem from "./ListItem";

const ToDoList = ({ tasks, editTask, deleteTask }) => {

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
    </div>
  );
};

export default ToDoList;
