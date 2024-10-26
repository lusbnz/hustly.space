import React from "react";
import "./common.css";

const Badge = ({ backgroundColor, color, name }) => {
  return (
    <div
      className={`badge`}
      style={{
        backgroundColor: backgroundColor || "#E2E2E2",
        color: color || "#000000",
      }}
    >
      {name}
    </div>
  );
};

export default Badge;
