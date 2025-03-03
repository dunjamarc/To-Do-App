import React, { useState, useEffect } from "react";
import InputText from "./InputText";

const categories = ["Work", "Personal", "Shopping", "Other"];

const AddNewForm = ({ onDataChange }) => {
  const [formData, setFormData] = useState({ title: "", category: "" });

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
  };

  return (
    <div className="add-new-item">
      <InputText
        value={formData.title}
        onChange={handleChange}
        name="title"
        minLength={3}
        maxLength={35}
        size={32}
        labelText={"Add new:"}
      ></InputText>
      <select
        className="select-category"
        value={formData.category}
        name="category"
        onChange={handleChange}
      >
        <option value="">Select Category</option>
        {categories.map((cat, i) => (
          <option key={i} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AddNewForm;
