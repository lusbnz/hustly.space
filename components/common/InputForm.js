import React from "react";
import './common.css';

const InputForm = ({ title, placeholder }) => {
  return (
    <div className="input-form">
      <label>{title}</label>
      <input placeholder={placeholder} />
    </div>
  );
};

export default InputForm;
