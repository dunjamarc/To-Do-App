import React from "react";
import AddNewForm from "./common/AddNewForm";
import { SlPlus } from "react-icons/sl";
import { useModal } from "../contexts/ModalContext";

const categories = ["Work", "Personal", "Shopping", "Other"];
const sortOptions = [
  { name: "Incomplete First", value: "completed asc" },
  { name: "Completed First", value: "completed desc" },
  { name: "A-Z", value: "title asc" },
  { name: "Z-A", value: "title desc" },
];

const Header = ({ addTask, filterTasks, sortTasks }) => {
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

  const handleSort = (e) => {
    sortTasks(e.target.value);
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
      <div className="sort-add-new">
        <select className="sort" name="sort" onChange={handleSort}>
          <option value="">Sort By</option>
          {sortOptions.map((option, i) => (
            <option key={i} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <SlPlus className="add-new" title="Add new" onClick={handleOpenModal} />
      </div>
    </div>
  );
};

export default Header;
