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
  isAuth
}) => {
  const handleKeyDown = (e) => {
    if (isNumber && ["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="input-form">
      <label>{title}</label>
      {isEditor ? (
        <textarea
          placeholder={placeholder}
          style={tstyle}
          {...(register && register(name, { required }))}
        />
      ) : (
        <input
          style={isAuth ? {height: "46px"} : {}}
          placeholder={placeholder}
          type={isPassword ? "password" : isNumber ? "number" : "text"}
          {...(register && register(name, { required }))}
          defaultValue={defaultValue}
          onChange={onChange}
          min={isNumber ? 18 : undefined}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};

export default InputForm;
