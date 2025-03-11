import React, {
  forwardRef,
  useState,
} from "react";

const InputText = forwardRef(
  (
    {
      minLength = 1,
      maxLength = 50,
      size = 30,
      labelText = "",
      placeholder = "",
      value,
      onChange,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(value || "");

    const handleChange = (e) => {
      setInputValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <>
        <label htmlFor="name">{labelText}</label>
        <input
          ref={ref}
          value={value !== undefined ? value : inputValue}
          onChange={(e) => handleChange(e)}
          className="input-text"
          id="name"
          type="text"
          name="title"
          minLength={minLength}
          maxLength={maxLength}
          size={size}
          placeholder={placeholder}
        />
      </>
    );
  }
);

export default InputText;
