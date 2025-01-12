import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import QuizNameInput from "../GenerateQuiz/QuizNameInput";
import "./edit-quiz-modal.css";
import { iMCQQuestion } from "@/repository/QuizRepository";
import useStorageService from "@/hooks/useStorageService";
import TextAreaInput from "../GenerateQuiz/TextAreaInput";
interface EditNoteModalProps {
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  quiz_name: string;
  description?: string;
  setQuiz: React.Dispatch<React.SetStateAction<iMCQQuestion>>;
  quiz_id: number;
}

const EditQuizModal: React.FC<EditNoteModalProps> = ({
  isEdit,
  setIsEdit,
  quiz_name,
  description,
  setQuiz,
  quiz_id,
}) => {
  const [formData, setFormData] = useState({
    quiz_name: "",
    description: "",
  });
  const storageServ = useStorageService();
  useEffect(() => {
    if (isEdit) {
      setFormData({
        quiz_name: quiz_name,
        description: description ?? "",
      });
    }
  }, [quiz_name, description, isEdit]);
  const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await storageServ.quizRepo.updateQuizDetail(
        quiz_id,
        formData.quiz_name,
        formData.description
      );

      setQuiz((prev) => ({
        ...prev,
        quiz_name: formData.quiz_name,
        description: formData.description ?? "",
      }));

      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChangeDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      quiz_name: e.target.value,
    }));
  };
  return (
    <IonModal isOpen={isEdit}>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="danger" onClick={() => setIsEdit(false)}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle slot="end">Edit Quiz</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="ion-padding"
        style={{
          borderRadius: "1rem",
        }}
      >
        <form onSubmit={handleSubmitUpdate}>
          <QuizNameInput
            value={formData.quiz_name}
            handleOnChangeName={handleOnChangeName}
          />
          <TextAreaInput
            placeHolder="Enter description here..."
            label="Description"
            value={formData.description as string}
            handleOnChangeDescription={handleOnChangeDescription}
            rows={20}
          />
          <button
            disabled={!formData.quiz_name}
            type="submit"
            className="submit-edited-btn"
          >
            Update
          </button>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default EditQuizModal;
