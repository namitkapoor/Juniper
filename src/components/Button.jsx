import React from 'react';
import '../style/button.css';

const Button = ({ 
  children, 
  className = '', 
  onClick, 
  disabled = false, 
  ...props 
}) => {
  return (
    <button
      className={`custom-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

