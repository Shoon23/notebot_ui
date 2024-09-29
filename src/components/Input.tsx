import React from "react";
import { Input as ShadcnInput } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  className?: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  icon,
  className,
  label,
  ...inputProps
}) => {
  return (
    <div
      className={`${className} w-full flex items-center border rounded-md px-3 hover:border-2`}
    >
      {icon && <span className="icon ">{icon}</span>}
      {/* {label && <Label>{label}</Label>} */}
      <ShadcnInput
        className="w-full focus:border-none border-none focus:ring-0 hover:border-none"
        {...inputProps}
      />
    </div>
  );
};

export default Input;
