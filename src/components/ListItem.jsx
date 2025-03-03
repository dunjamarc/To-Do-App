import React from "react";
import { SlPencil, SlTrash } from "react-icons/sl";
import { useModal } from "../contexts/ModalContext";

const ListItem = ({ task, editTask, deleteTask }) => {
  const { openModal } = useModal();

  const onToggleChecked = () => {
    editTask(task.id, { completed: !task.completed });
  };

  const onEditTask = () => {
    openModal(
      <input
        className="input-text"
        type="text"
        defaultValue={task.title}
        onChange={(e) => (task.title = e.target.value)}
        minLength={3}
        maxLength={35}
        size={32}
      />,
      () => editTask(task.id, { title: task.title }),
      "Save"
    );
  };

  const onDeleteTask = () => {
    openModal(
      <p>Are you sure you want to delete this task?</p>,
      () => deleteTask(task.id),
      "Delete"
    );
  };

  return (
    <div className="list-item">
      <div className="item-title">
        <input
          type="checkbox"
          id={task.title}
          checked={task.completed}
          onChange={onToggleChecked}
        />
        <p className="label" htmlFor={task.title}>
          {task.title}
        </p>
      </div>
      <SlPencil title="Edit" onClick={onEditTask} />
      <SlTrash title="Delete" onClick={onDeleteTask} />
    </div>
  );
};

export default ListItem;
