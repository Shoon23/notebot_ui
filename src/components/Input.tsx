import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  className?: string;
}

const Input: React.FC<InputProps> = ({ icon, className, ...inputProps }) => {
  return (
    <label
      className={`input input-bordered flex items-center gap-2 ${className}`}
    >
      {icon && <span className="icon">{icon}</span>}
      <input className="grow" {...inputProps} />
    </label>
  );
};

export default Input;
