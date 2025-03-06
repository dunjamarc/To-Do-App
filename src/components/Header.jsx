import React from "react";
import AddNewForm from "./common/AddNewForm";
import { SlPlus } from "react-icons/sl";
import { useModal } from "../contexts/ModalContext";

const categories = ["Work", "Personal", "Shopping", "Other"];

const Header = ({ addTask, filterTasks }) => {
  const { openModalForm } = useModal();

  const handleOpenModal = () => {
    openModalForm(
      null,
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
      <div className="filter">
        <button className="category-filter" onClick={() => filterTasks("all")}>
          All
        </button>
        {categories.map((cat, i) => (
          <button
            key={i}
            className="category-filter"
            onClick={() => filterTasks(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <SlPlus className="add-new" title="Add new" onClick={handleOpenModal} />
    </div>
  );
};

export default Header;
