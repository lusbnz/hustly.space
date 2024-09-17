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
      className={`btn ${border && `border-[1px] border-[#484848]`}`}
      style={{
        backgroundColor: backgroundColor || "#ffffff",
        color: color || "#000000",
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
