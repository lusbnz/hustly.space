import React from "react";
import "./common.css";

const InputForm = ({
  title,
  placeholder,
  register,
  name,
  required,
  isEditor,
}) => {
  return (
    <div className="input-form">
      <label>{title}</label>
      {isEditor ? (
        <textarea
          placeholder={placeholder}
          {...(register && register(name, { required }))}
        />
      ) : (
        <input
          placeholder={placeholder}
          {...(register && register(name, { required }))}
        />
      )}
    </div>
  );
};

export default InputForm;
