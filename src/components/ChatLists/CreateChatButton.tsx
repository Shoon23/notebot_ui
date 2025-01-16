import React from "react";
import "./style.css";

interface CreateChatButtonProps {
  chatForm: {
    chat_name: string;
    note_id: number;
  };
}
const CreateChatButton: React.FC<CreateChatButtonProps> = ({ chatForm }) => {
  return (
    <button
      type="button"
      className="create-chat-btn"
      disabled={!chatForm.chat_name || chatForm.note_id === 0}
    >
      Create
    </button>
  );
};

export default CreateChatButton;
