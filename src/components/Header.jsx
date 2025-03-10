import React, { useContext } from "react";
import AddNewForm from "./common/AddNewForm";
import { SlPlus } from "react-icons/sl";
import { useModal } from "../contexts/ModalContext";
import { ThemeContext } from "../contexts/ThemeContext";
import Switch from "react-switch";

const categories = ["Work", "Personal", "Shopping", "Other"];
const sortOptions = [
  { name: "Incomplete First", value: "completed asc" },
  { name: "Completed First", value: "completed desc" },
  { name: "A-Z", value: "title asc" },
  { name: "Z-A", value: "title desc" },
];

const Header = ({ addTask, filterTasks, sortTasks }) => {
  const { openModalForm } = useModal();
  const { theme, toggleTheme } = useContext(ThemeContext);

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
      <div className="title">
        <h2>TO DO:</h2>
        <Switch
          checked={theme === "dark"}
          onChange={toggleTheme}
          onColor="#9ba5aa"
          onHandleColor="#4f4c4c"
          handleDiameter={25}
          uncheckedIcon={false}
          checkedIcon={false}
          height={15}
          width={48}
          className="react-switch"
        />
      </div>
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
        <select className="select-dropdown" name="sort" onChange={handleSort}>
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
