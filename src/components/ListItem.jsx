import React from "react";
import { SlPencil, SlTrash } from "react-icons/sl";
import { useModal } from "../contexts/ModalContext";
import AddNewForm from "./common/AddNewForm";

const ListItem = ({ task, editTask, deleteTask }) => {
  const { openModal, openModalForm } = useModal();

  const onToggleChecked = () => {
    editTask(task.id, { completed: !task.completed });
  };

  const onEditTask = () => {
    openModalForm(
      task,
      (props) => <AddNewForm {...props} />,
      (formData) => {
        if (!formData.title.trim() || !formData.category.trim()) {
          alert("All fields are required");
          return;
        }
        editTask(task.id, formData);
      },
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
