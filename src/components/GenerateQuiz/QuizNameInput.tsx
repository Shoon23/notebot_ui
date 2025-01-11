import React from "react";
import "./generate-form.css";
interface QuizNameInputProps {
  value: string;
  handleOnChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const QuizNameInput: React.FC<QuizNameInputProps> = ({
  handleOnChangeName,
  value,
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
        Quiz Name
      </p>

      <input
        value={value}
        onChange={handleOnChangeName}
        type="text"
        className="input-box"
        placeholder="Enter Quiz Name"
      />
    </div>
  );
};

export default QuizNameInput;
