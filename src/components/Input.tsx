import React from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  icon,
  className = "",
}) => {
  return (
    <label
      className={`input input-bordered flex items-center gap-2 ${className}`}
    >
      {icon && <span className="icon">{icon}</span>}
      <input type={type} className="grow" placeholder={placeholder} />
    </label>
  );
};

export default Input;
