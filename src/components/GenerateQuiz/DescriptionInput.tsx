import React from "react";
import "./generate-form.css";

interface DescriptionInputProps {
  value: string;
  handleOnChangeDescription: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  rows: number;
}
const DescriptionInput: React.FC<DescriptionInputProps> = ({
  handleOnChangeDescription,
  value,
  rows,
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
        Desciption
      </div>
      <textarea
        value={value}
        onChange={handleOnChangeDescription}
        rows={rows}
        placeholder="Enter description here..."
        className="quiz-description-input"
      />
    </div>
  );
};

export default DescriptionInput;
