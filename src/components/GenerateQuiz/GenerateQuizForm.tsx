import {
  IonAlert,
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  useIonLoading,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useState } from "react";
import "./generate-form.css";
import SelectOption from "../SelectOption/SelectOption";
import { fileTray, colorWand } from "ionicons/icons";
import ChooseNoteModal from "../ChooseNoteModal";
import { Note } from "@/databases/models/note";
import useStorageService from "@/hooks/useStorageService";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import DescriptionInput from "./TextAreaInput";
import QuizNameInput from "./QuizNameInput";
import TextAreaInput from "./TextAreaInput";

const GenerateQuizForm = () => {
  const [genQuizForm, setGenQuizForm] = useState<{
    quiz_name: string;
    question_type: string;
    blooms_taxonomy_level: string;
    difficulty: string;
    num_questions: number;
    note_id: number;
    description: string;
  }>({
    quiz_name: "",
    blooms_taxonomy_level: "",
    description: "",
    difficulty: "",
    note_id: 0,
    num_questions: 0,
    question_type: "",
  });

  const [selectedNote, setSelectedNote] = useState<{
    note_name: string;
    note_content: string;
  }>({
    note_name: "",
    note_content: "",
  });

  const storageServ = useStorageService();
  const router = useIonRouter();
  const quizType = [
    { value: "mcq", label: "Multiple Choice" },
    { value: "true-or-false", label: "True/False" },
    { value: "short-answer", label: "Short Answer" },
    { value: "essay", label: "Essay" },
  ];

  const bloomsLevel = [
    { value: "evaluating", label: "Evaluating" },
    { value: "remembering", label: "Remembering" },
    { value: "understanding", label: "Understanding" },
    { value: "applying", label: "Applying" },
    { value: "analyzing", label: "Analyzing" },
  ];
  const difficultyLevels = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];
  const [isOpen, setIsOpen] = useState(false);

  const numbers = [
    { value: "5", label: "5" },
    // { value: "10", label: "10" },
    // { value: "15", label: "15" },
  ];

  const essayNumbers = [{ value: "1", label: "1" }];
  const updateForm = (key: string, value: string | number) => {
    setGenQuizForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const [present, dismiss] = useIonLoading();

  const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    updateForm("quiz_name", value);
  };

  const handleOnChangeDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;

    updateForm("description", value);
  };

  const handleSelectQuizType = (selectedValue: string) => {
    updateForm("question_type", selectedValue);
  };

  const handleSelectBloomLevel = (selectedValue: string) => {
    updateForm("blooms_taxonomy_level", selectedValue);
  };

  const handleSelectBloomDifficulty = (selectedValue: string) => {
    updateForm("difficulty", selectedValue);
  };

  const handleSelectNumQuestions = (selectedValue: string) => {
    updateForm("num_questions", Number(selectedValue));
  };
  const handleSubmit = async () => {
    try {
      await present({
        message: "Genrating Quiz...",
      });

      const { quiz_name, note_id, ...others } = genQuizForm;

      const options = {
        url: "https://test-backend-9dqr.onrender.com/generate-questions",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        data: {
          ...others,
          content_text: selectedNote.note_content,
        },
      };

      const response: HttpResponse = await CapacitorHttp.post(options);
      const data = response.data;
      let quiz_data = null;
      switch (genQuizForm.question_type) {
        case "essay":
          quiz_data = await storageServ.quizRepo.saveEssayQuestion(
            {
              note_id,
              quiz_name,
              ...others,
            },

            data
          );
          break;
        case "mcq":
          quiz_data = await storageServ.quizRepo.save_generated_mcq(
            {
              note_id,
              quiz_name,
              ...others,
            },

            data
          );
          break;
        case "true-or-false":
        case "short-answer":
          quiz_data =
            await storageServ.quizRepo.saved_gen_true_false_or_short_answer(
              {
                note_id,
                quiz_name,
                ...others,
              },
              data
            );

          break;
      }
      router.push("/quiz/" + quiz_data?.quiz_id, "forward", "pop");
    } catch (error) {
      setIsOpen(true);
      console.log(error);
    } finally {
      dismiss();
    }
  };

  return (
    <form
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <QuizNameInput
        value={genQuizForm.quiz_name}
        handleOnChangeName={handleOnChangeName}
      />
      <IonAlert
        isOpen={isOpen}
        header="Something Went Wrong"
        buttons={["Action"]}
        onDidDismiss={() => setIsOpen(false)}
      ></IonAlert>
      <SelectOption
        selectHandler={handleSelectQuizType}
        label="Quiz Type"
        options={quizType}
      />
      <SelectOption
        selectHandler={handleSelectBloomLevel}
        label="Blooms Level"
        options={bloomsLevel}
      />

      <SelectOption
        selectHandler={handleSelectBloomDifficulty}
        label="Difficulty"
        options={difficultyLevels}
      />

      <SelectOption
        selectHandler={handleSelectNumQuestions}
        label="Number Of Question"
        options={genQuizForm.question_type !== "essay" ? numbers : essayNumbers}
      />

      {/* {!selectedNote.note_name ? ( */}
      <ChooseNoteModal
        setGenQuizForm={setGenQuizForm}
        setSelectedNote={setSelectedNote}
        selectedNote={selectedNote}
      ></ChooseNoteModal>
      {/* // ) : (
      //   <>{selectedNote.note_name}</>
      // )} */}
      <TextAreaInput
        placeHolder="Enter description here..."
        label="Description"
        value={genQuizForm.description}
        handleOnChangeDescription={handleOnChangeDescription}
        rows={10}
      />
      <button
        onClick={handleSubmit}
        type="button"
        className="quiz-gen-generate-btn"
        disabled={
          !genQuizForm.quiz_name ||
          !genQuizForm.blooms_taxonomy_level ||
          !genQuizForm.difficulty ||
          genQuizForm.note_id === 0 ||
          !genQuizForm.question_type ||
          genQuizForm.num_questions === 0
        }
      >
        Generate
        <IonIcon icon={colorWand}></IonIcon>
      </button>
    </form>
  );
};

export default GenerateQuizForm;
