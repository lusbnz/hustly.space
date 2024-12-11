import React, { useState } from "react";
import "./common.css";

const InputForm = ({
  title,
  placeholder,
  register,
  name,
  required,
  isEditor,
  isPassword,
  tstyle,
  defaultValue,
  onChange,
  isNumber,
  isAuth,
  maxValue,
}) => {
  const [value, setValue] = useState(defaultValue || "");

  const handleKeyDown = (e) => {
    if (isNumber && ["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (maxValue && newValue.length > maxValue) {
      return;
    }
    setValue(newValue);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="input-form">
      <label>
        {title}
        {maxValue && (
          <span className="value-counter">
            {` (${value.length}/${maxValue})`}
          </span>
        )}
      </label>
      {isEditor ? (
        <textarea
          placeholder={placeholder}
          style={tstyle}
          maxLength={maxValue}
          {...(register && register(name, { required }))}
          onChange={handleChange}
        />
      ) : (
        <input
          style={
            isAuth
              ? { height: "46px", lineHeight: "1.5" }
              : { height: "36px", lineHeight: "1.5" }
          }
          placeholder={placeholder}
          type={isPassword ? "password" : isNumber ? "number" : "text"}
          {...(register && register(name, { required }))}
          defaultValue={defaultValue}
          onChange={handleChange}
          min={isNumber ? 18 : undefined}
          onKeyDown={handleKeyDown}
          maxLength={maxValue}
        />
      )}
    </div>
  );
};

export default InputForm;
