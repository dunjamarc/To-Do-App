import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const InputText = forwardRef(
  (
    {
      minLength = 1,
      maxLength = 50,
      size = 30,
      labelText = "",
      value,
      onChange,
    },
    ref
  ) => {
    const localRef = useRef(null);
    const [inputValue, setInputValue] = useState(value || "");

    useImperativeHandle(ref, () => ({
      clear: () => {
        setInputValue("");
        if (localRef.current) {
          localRef.current.value = "";
        }
      },
      getValue: () => (localRef.current ? localRef.current.value : ""),
    }));

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
          ref={localRef}
          value={value !== undefined ? value : inputValue}
          onChange={(e) => handleChange(e)}
          className="input-text"
          id="name"
          type="text"
          name="title"
          minLength={minLength}
          maxLength={maxLength}
          size={size}
        />
      </>
    );
  }
);

export default InputText;
