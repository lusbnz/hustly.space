import React from "react";
import "./common.css";

const Badge = ({ backgroundColor, color, name }) => {
  return (
    <span
      className={`badge`}
      style={{
        backgroundColor: backgroundColor || "#E2E2E2",
        color: color || "#000000",
      }}
    >
      {name}
    </span>
  );
};

export default Badge;
