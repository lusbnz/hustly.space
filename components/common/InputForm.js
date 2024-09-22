import React from "react";
import './common.css';

const InputForm = ({ title, placeholder, register, name, required }) => {
  return (
    <div className="input-form">
      <label>{title}</label>
      <input
        placeholder={placeholder}
        {...(register && register(name, { required }))}
      />
    </div>
  );
};

export default InputForm;