import React from "react";
import "./common.css";

const ButtonPrimary = ({ type, title, onClick }) => {
  return (
    <button className="btn-primary" type={type} onClick={onClick}>
      {title}
    </button>
  );
};

export default ButtonPrimary;
