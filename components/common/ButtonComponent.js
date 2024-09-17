import React from "react";
import "./common.css";

const ButtonComponent = ({
  type,
  title,
  onClick,
  icon,
  backgroundColor,
  color,
  border
}) => {
  
  return (
    <button
      className={`btn`}
      style={{
        backgroundColor: backgroundColor || "#ffffff",
        color: color || "#000000",
        border: border ? "1px solid #343434" : "none",
      }}
      type={type}
      onClick={onClick}
    >
      {icon && icon}
      {title}
    </button>
  );
};

export default ButtonComponent;
