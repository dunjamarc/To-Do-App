import React from "react";
import AddNewForm from "./AddNewForm";
import { SlPlus } from "react-icons/sl";
import { useModal } from "../contexts/ModalContext";

const Header = ({ addTask }) => {
  const { openModalForm } = useModal();

  const handleOpenModal = () => {
    openModalForm(
      (props) => <AddNewForm {...props} />,
      (formData) => {
        if (!formData.title.trim() || !formData.category.trim()) {
          alert("All fields are required");
          return;
        }
        addTask(formData);
      },
      "Add Task"
    );
  };

  return (
    <div className="header">
      <h2>TO DO:</h2>
      <SlPlus className="add-new" title="Add new" onClick={handleOpenModal} />
    </div>
  );
};

export default Header;
