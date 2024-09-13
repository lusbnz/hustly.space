import React from 'react';
import './common.css';

const Badge = ({backgroundColor, color, name}) => {
  return (
    <span className={`badge bg-[${backgroundColor}] text-[${color}]`}>{name}</span>
  )
}

export default Badge