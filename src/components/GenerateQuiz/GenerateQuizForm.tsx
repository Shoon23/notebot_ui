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
import Input from "./Input";
import TextAreaInput from "./TextAreaInput";
import { Filesystem, Directory } from "@capacitor/filesystem";

export const b64toBlob = (
  b64Data: string,
  contentType = "",
  sliceSize = 512
): Blob => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
};

const GenerateQuizForm = () => {
  const [genQuizForm, setGenQuizForm] = useState<{
    quiz_name: string;
    question_type: string;
    blooms_taxonomy_level: string;
    num_questions: number;
    note_id: number;
    description: string;
  }>({
    quiz_name: "",
    blooms_taxonomy_level: "",
    description: "",
    note_id: 0,
    num_questions: 0,
    question_type: "",
  });

  const [selectedNote, setSelectedNote] = useState<{
    note_name: string;
    note_content: string | null;
    note_path: string | null;
  }>({
    note_name: "",
    note_content: "",
    note_path: "",
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
    { value: "10", label: "10" },
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

  const handleSelectNumQuestions = (selectedValue: string) => {
    updateForm("num_questions", Number(selectedValue));
  };
  // Helper function to convert a base64 string to a Blob

  const handleSubmit = async () => {
    try {
      await present({ message: "Generating Quiz..." });
      const apiUrl =
        "https://test-backend-9dqr.onrender.com/generate-questions";
      let fileBlob: Blob | null = null;
      let filename: string | null = null;

      // If a file path exists, read the file using Capacitor Filesystem.
      if (selectedNote.note_path) {
        // Remove any "file://" prefix if present.
        let filePath = selectedNote.note_path;
        if (filePath.startsWith("file://")) {
          filePath = filePath.replace("file://", "");
        }
        // Read the file from Directory.Documents (adjust if needed)
        const fileResult = await Filesystem.readFile({
          path: filePath, // Relative path (e.g., folderName/file.name)
          directory: Directory.Data,
        });
        const base64Data = fileResult.data as any; // Base64 encoded string

        // Determine MIME type based on file extension
        let mimeType = "application/octet-stream";
        if (filePath.toLowerCase().endsWith(".pdf")) {
          mimeType = "application/pdf";
        } else if (filePath.toLowerCase().endsWith(".docx")) {
          mimeType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        // Convert the Base64 string to a Blob.
        fileBlob = b64toBlob(base64Data, mimeType);
        filename = filePath.split("/").pop() || "uploadfile";
      }

      // Always use FormData to send the data.
      const formData = new FormData();
      // Append the file if available.
      if (fileBlob && filename) {
        formData.append("file", fileBlob, filename);
      }
      formData.append(
        "blooms_taxonomy_level",
        genQuizForm.blooms_taxonomy_level
      );
      formData.append("num_questions", String(genQuizForm.num_questions));
      formData.append("question_type", genQuizForm.question_type);
      // Append note content (or fallback to an empty string).
      formData.append("content_text", selectedNote.note_content || "");

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        // Do not manually set the Content-Type header; the browser sets it automatically.
      });
      // Validate the response.
      const data = await response.json();
      let quiz_data = null;
      const { quiz_name, note_id, ...others } = genQuizForm;
      switch (genQuizForm.question_type) {
        case "essay":
          quiz_data = await storageServ.quizRepo.saveEssayQuestion(
            { note_id, quiz_name, ...others },
            data,
            null
          );
          break;
        case "mcq":
          quiz_data = await storageServ.quizRepo.save_generated_mcq(
            { note_id, quiz_name, ...others },
            data,
            null
          );
          break;
        case "true-or-false":
        case "short-answer":
          quiz_data =
            await storageServ.quizRepo.saved_gen_true_false_or_short_answer(
              { note_id, quiz_name, ...others },
              data,
              null
            );
          break;
        default:
          console.error("Unknown question type");
      }
      router.push("/quiz/" + quiz_data?.quiz_id, "forward", "pop");
    } catch (error) {
      setIsOpen(true);
      console.error(error);
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
      <Input
        placeHolder="Enter Quiz Name"
        value={genQuizForm.quiz_name}
        handleOnChangeName={handleOnChangeName}
        label={"Quiz Name"}
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
        selectHandler={handleSelectNumQuestions}
        label="Number Of Question"
        options={genQuizForm.question_type !== "essay" ? numbers : essayNumbers}
      />

      {/* {!selectedNote.note_name ? ( */}
      <ChooseNoteModal
        setForms={setGenQuizForm}
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
