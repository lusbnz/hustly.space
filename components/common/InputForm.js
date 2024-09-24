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
  tstyle
}) => {
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
          placeholder={placeholder}
          type={isPassword ? "password" : "text"}
          {...(register && register(name, { required }))}
        />
      )}
    </div>
  );
};

export default InputForm;
