import React from "react";
import "./generate-form.css";
interface InputProps {
  value: string;
  handleOnChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeHolder: string;
  label: string;
}
const Input: React.FC<InputProps> = ({
  handleOnChangeName,
  value,
  placeHolder,
  label,
}) => {
  return (
    <div
      style={{
        height: "80px",
        marginBottom: "12px",
      }}
    >
      <p
        style={{
          marginBottom: "5px",
        }}
      >
        {label}
      </p>

      <input
        value={value}
        onChange={handleOnChangeName}
        type="text"
        className="input-box"
        placeholder={placeHolder}
      />
    </div>
  );
};

export default Input;
