import React from "react";
import "./msg-card.css";
interface MessageInputProps {
  value: string;
  handleOnChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeHolder: string;
  label: string;
}
const MessageInput: React.FC<MessageInputProps> = ({
  handleOnChangeName,
  value,
  placeHolder,
  label,
}) => {
  return (
    <div
      style={{
        height: "80px",
        width: "100%",
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
        className="msg-input-box"
        placeholder={placeHolder}
      />
    </div>
  );
};

export default MessageInput;
