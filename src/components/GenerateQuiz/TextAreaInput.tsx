import React from "react";
import "./generate-form.css";

interface TextAreaInputProps {
  value: string;
  handleOnChangeDescription: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  rows: number;
  placeHolder: string;
  label: string;
}
const TextAreaInput: React.FC<TextAreaInputProps> = ({
  handleOnChangeDescription,
  value,
  rows,
  placeHolder,
  label,
}) => {
  return (
    <div
      style={{
        marginTop: "15px",
      }}
    >
      <div
        style={{
          marginBottom: "5px",
        }}
      >
        {label}
      </div>
      <textarea
        value={value}
        onChange={handleOnChangeDescription}
        rows={rows}
        placeholder={placeHolder}
        className="quiz-description-input"
      />
    </div>
  );
};

export default TextAreaInput;
