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
      className={`btn ${border && `border-[1px] border-[#${color}]`}`}
      style={{
        backgroundColor: backgroundColor || "#000000",
        color: color || "#ffffff",
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
