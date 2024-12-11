import React from "react";
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
  const handleKeyDown = (e) => {
    if (isNumber && ["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    if (maxValue && e.target.value.length > maxValue) {
      e.target.value = e.target.value.slice(0, maxValue);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="input-form">
      <label>{title}</label>
      {isEditor ? (
        <textarea
          placeholder={placeholder}
          style={tstyle}
          maxLength={maxValue}
          {...(register && register(name, { required }))}
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
