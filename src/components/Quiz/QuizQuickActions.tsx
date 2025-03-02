import React, { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import TextAreaInput from "../GenerateQuiz/TextAreaInput";
import useStorageService from "@/hooks/useStorageService";
import { iMCQQuestion, QuestionWithOptions } from "@/repository/QuizRepository";
import SelectOption from "../SelectOption/SelectOption";

interface QuizQuickActionsProps {
  question_type: string;
  setQuiz: React.Dispatch<React.SetStateAction<iMCQQuestion>>;
  quiz_id: number;
  isSelectQuestion: boolean;
}

const QuizQuickActions: React.FC<QuizQuickActionsProps> = ({
  question_type,
  quiz_id,
  setQuiz,
  isSelectQuestion,
}) => {
  const [isAdd, setIsdAdd] = useState(false);
  const [questionData, setQuestionData] = useState(initQuestion);
  const storageServ = useStorageService();
  // Handle changes for the main question content
  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionData((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  };

  // Handle changes for an option at a specific index
  const handleOptionChange =
    (index: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newOptions = questionData.options.map((option, i) =>
        i === index ? { ...option, content: e.target.value } : option
      );
      setQuestionData((prev) => ({
        ...prev,
        options: newOptions,
      }));
    };

  // Handle change for the answer (assumed to be the first option)
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newOptions = questionData.options.map((option, i) =>
      i === 0 ? { ...option, content: e.target.value } : option
    );
    setQuestionData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  // Handle change for the explanation (assumed to be for the first option)
  const handleExplanationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newOptions = questionData.options.map((option, i) =>
      i === 0 ? { ...option, explanation: e.target.value } : option
    );
    setQuestionData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  // Compute form validity.
  // The main question and answer (first option) must not be empty.
  let isFormValid =
    questionData.content.trim() !== "" &&
    questionData.options[0].content.trim() !== "";

  if (question_type !== "mcq") {
    // For non-MCQ, also check that the explanation is not empty.
    isFormValid =
      isFormValid && questionData.options[0]?.explanation?.trim() !== "";
  } else {
    // For MCQ, all distractor options (options where is_answer is false) must not be empty.
    const distractorsValid = questionData.options
      .filter((opt) => !opt.is_answer)
      .every((opt) => opt.content.trim() !== "");
    isFormValid = isFormValid && distractorsValid;
  }

  // Handle submission based on question type
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let savedQuestion: QuestionWithOptions;

      if (question_type === "mcq") {
        savedQuestion = await storageServ.quizRepo.saveSingleMCQQuestion(
          quiz_id,
          questionData
        );
      } else {
        const submissionData = {
          ...questionData,
          options: questionData.options.slice(0, 1),
        };
        // Save using the short answer / true-false repository function.
        savedQuestion =
          await storageServ.quizRepo.saveSingleShortAnswerOrTFQuestion(
            quiz_id,
            submissionData
          );
      }

      console.log(savedQuestion);
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        num_questions: prevQuiz.num_questions + 1,
        questions: [...prevQuiz.questions, savedQuestion],
      }));
      setIsdAdd(false);
    } catch (error) {
      console.log(error);
    }
  };
  // Hardware back button handler that resets edit mode
  const backButtonHandler = (event: any) => {
    // Register with a high priority so it overrides default behavior
    event.detail.register(100, (processNextHandler: any) => {
      setIsdAdd(false);
      setQuestionData(initQuestion);
      processNextHandler();
    });
  };

  // Register the back button handler when the view is active
  useIonViewDidEnter(() => {
    document.addEventListener("ionBackButton", backButtonHandler);
  });

  // Remove the back button handler when leaving the view
  useIonViewWillLeave(() => {
    document.removeEventListener("ionBackButton", backButtonHandler);
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 5,
          alignItems: "center",
          justifyContent: "center",
          height: "55px",
          marginBottom: "10px",
        }}
      >
        <button className="view-note-btn">View Note</button>
        <button
          className="add-question-btn"
          disabled={question_type === "essay" || isSelectQuestion}
          onClick={() => setIsdAdd(true)}
        >
          Add Questions
        </button>
      </div>

      <IonModal isOpen={isAdd}>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                color="danger"
                onClick={() => {
                  setQuestionData(initQuestion);
                  setIsdAdd(false);
                }}
              >
                Cancel
              </IonButton>
            </IonButtons>
            <IonTitle slot="end">Add Question</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" style={{ borderRadius: "1rem" }}>
          <form onSubmit={handleAdd}>
            {/* Main Question Input */}
            <TextAreaInput
              value={questionData.content}
              handleOnChangeDescription={handleQuestionChange}
              rows={5}
              placeHolder="Enter your question here"
              label="Question"
            />

            {/* Answer Input (for non-MCQ, assumed to be the first option) */}
            {question_type !== "true-or-false" ? (
              <TextAreaInput
                value={questionData.options[0].content}
                handleOnChangeDescription={handleAnswerChange}
                rows={3}
                placeHolder="Enter the answer"
                label="Answer"
              />
            ) : (
              <SelectOption
                label={"Answer"}
                options={[
                  {
                    label: "True",
                    value: "True",
                  },
                  {
                    label: "False",
                    value: "False",
                  },
                ]}
                selectHandler={function (selectedValue: string): void {
                  setQuestionData((prev) => {
                    const newOptions = [...prev.options];
                    newOptions[0] = {
                      ...newOptions[0],
                      content: selectedValue,
                    };
                    return { ...prev, options: newOptions };
                  });
                }}
              ></SelectOption>
            )}
            {/* Triple condition rendering */}
            {question_type === "mcq" ? (
              // For MCQ: render distractor option inputs.
              <>
                <br />
                {questionData.options.map((option, index) => {
                  return !option.is_answer ? (
                    <TextAreaInput
                      key={index}
                      value={option.content}
                      handleOnChangeDescription={handleOptionChange(index)}
                      rows={3}
                      placeHolder={`Enter Option ${index + 1}`}
                      label={`Option ${index + 1}`}
                    />
                  ) : null;
                })}
              </>
            ) : (
              // For any other question type (e.g. short answer), render explanation input.
              <TextAreaInput
                value={questionData.options[0].explanation || ""}
                handleOnChangeDescription={handleExplanationChange}
                rows={4}
                placeHolder="Enter the explanation"
                label="Explanation"
              />
            )}

            <button
              type="submit"
              className="submit-edited-btn"
              disabled={!isFormValid}
            >
              Add
            </button>
          </form>
        </IonContent>
      </IonModal>
    </>
  );
};
const initQuestion = {
  content: "", // The main question text
  options: [
    {
      content: "",
      explanation: "",
      is_answer: true,
    },
    {
      content: "",
      is_answer: false,
    },
    {
      content: "",
      is_answer: false,
    },
    {
      content: "",
      is_answer: false,
    },
  ],
};
export default QuizQuickActions;
