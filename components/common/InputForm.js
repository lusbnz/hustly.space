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
  onChange
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
          defaultValue={defaultValue}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default InputForm;
