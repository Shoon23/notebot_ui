import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPopover,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import TextAreaInput from "../GenerateQuiz/TextAreaInput";
import { iMCQQuestion, QuestionWithOptions } from "@/repository/QuizRepository";
import SelectOption from "../SelectOption/SelectOption";
import useStorageService from "@/hooks/useStorageService";

interface MoreOptionsProps {
  question_answer: QuestionWithOptions;
  question_type: string;
  setQuiz: React.Dispatch<React.SetStateAction<iMCQQuestion>>;
}

const MoreOptions: React.FC<MoreOptionsProps> = ({
  question_answer,
  question_type,
  setQuiz,
}) => {
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const storageServ = useStorageService();
  // We use two states:
  // 1. questionData: the current (edited) state.
  // 2. initialData: the state when the modal was opened.
  const [questionData, setQuestionData] =
    useState<QuestionWithOptions>(question_answer);
  const [initialData, setInitialData] =
    useState<QuestionWithOptions>(question_answer);

  // When the prop changes, update both states (if needed).
  useEffect(() => {
    if (question_type === "mcq") {
      const sortedData: QuestionWithOptions = {
        ...question_answer,
        options: [...question_answer.options].sort((a, b) =>
          a.is_answer === b.is_answer ? 0 : a.is_answer ? -1 : 1
        ),
      };
      setQuestionData(sortedData);
      setInitialData(sortedData);
    } else {
      setQuestionData(question_answer);
      setInitialData(question_answer);
    }
  }, [question_answer, question_type]);

  // When opening the modal for editing, store the current value as initialData.
  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };

  const [isEdit, setIsEdit] = useState(false);

  // When modal opens, update initialData.
  useEffect(() => {
    if (isEdit) {
      setInitialData(questionData);
    }
  }, [isEdit]);

  // Compute whether any changes have been made compared to the initial data
  const hasChanges =
    JSON.stringify(questionData) !== JSON.stringify(initialData);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // update the question
    try {
      await storageServ.questionRepo.updateQuestionContent(
        questionData.question_id,
        questionData.content
      );

      if (question_type === "mcq") {
        // Update The Option
        questionData.options.forEach(async (option) => {
          await storageServ.optionRepo.updateOptionContent(
            option.option_id as number,
            option.content
          );
        });
      } else {
        await storageServ.optionRepo.updateOptionExplanationAndContent(
          questionData.options[0].option_id as number,
          questionData.options[0].explanation as string,
          questionData.options[0].content
        );
      }
      setQuiz((prevQuiz) => {
        const updatedQuestions = prevQuiz.questions.map((q) =>
          q.question_id === questionData.question_id ? questionData : q
        );
        return {
          ...prevQuiz,
          questions: updatedQuestions,
        };
      });

      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };
  // Hardware back button handler that resets edit mode
  const backButtonHandler = (event: any) => {
    // Register with a high priority so it overrides default behavior
    event.detail.register(100, (processNextHandler: any) => {
      setIsEdit(false);
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
      <IonButton
        onClick={openPopover}
        fill="clear"
        style={{ alignSelf: "start", margin: "0", padding: "0" }}
      >
        <IonIcon icon={ellipsisVertical} />
      </IonButton>
      <IonPopover
        ref={popover}
        isOpen={popoverOpen}
        onDidDismiss={() => setPopoverOpen(false)}
      >
        <IonContent>
          <IonButton
            onClick={() => {
              setIsEdit(true);
              setPopoverOpen(false);
            }}
            fill="clear"
            expand="block"
          >
            Edit
          </IonButton>
        </IonContent>
      </IonPopover>

      {/* Edit Question Modal */}
      <IonModal isOpen={isEdit}>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                color="danger"
                onClick={() => {
                  // Reset to the original prop value on cancel
                  setQuestionData(question_answer);
                  setIsEdit(false);
                }}
              >
                Cancel
              </IonButton>
            </IonButtons>
            <IonTitle slot="end">Edit Question</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" style={{ borderRadius: "1rem" }}>
          <form onSubmit={handleUpdate}>
            {/* Question Text Input */}
            <TextAreaInput
              value={questionData.content}
              handleOnChangeDescription={(e) => {
                setQuestionData((prev) => ({
                  ...prev,
                  content: e.target.value,
                }));
              }}
              rows={5}
              placeHolder="Enter your question here"
              label="Question"
            />

            {/* Answer Input or Dropdown */}
            {question_type !== "true-or-false" ? (
              <TextAreaInput
                value={questionData.options[0].content}
                handleOnChangeDescription={(e) => {
                  setQuestionData((prev) => {
                    const newOptions = [...prev.options];
                    newOptions[0] = {
                      ...newOptions[0],
                      content: e.target.value,
                    };
                    return { ...prev, options: newOptions };
                  });
                }}
                rows={3}
                placeHolder="Enter the answer"
                label="Answer"
              />
            ) : (
              <SelectOption
                initialValue={questionData.options[0].content}
                label="Answer"
                options={[
                  { label: "True", value: "True" },
                  { label: "False", value: "False" },
                ]}
                selectHandler={(selectedValue: string): void => {
                  setQuestionData((prev) => {
                    const newOptions = [...prev.options];
                    newOptions[0] = {
                      ...newOptions[0],
                      content: selectedValue,
                    };
                    return { ...prev, options: newOptions };
                  });
                }}
              />
            )}

            {/* Triple Condition Rendering */}
            {question_type === "mcq" ? (
              // For MCQ: render distractor option inputs.
              <>
                <br />
                {questionData.options.slice(1).map((option, index) => (
                  <TextAreaInput
                    key={index}
                    value={option.content}
                    handleOnChangeDescription={(e) => {
                      setQuestionData((prev) => {
                        const newOptions = [...prev.options];
                        // Since we sliced out the first option, use index+1.
                        newOptions[index + 1] = {
                          ...newOptions[index + 1],
                          content: e.target.value,
                        };
                        return { ...prev, options: newOptions };
                      });
                    }}
                    rows={3}
                    placeHolder={`Enter Option ${index + 1}`}
                    label={`Option ${index + 1}`}
                  />
                ))}
              </>
            ) : (
              // For any other question type (e.g. short answer), render explanation input.
              <TextAreaInput
                value={questionData.options[0].explanation || ""}
                handleOnChangeDescription={(e) => {
                  setQuestionData((prev) => {
                    const newOptions = [...prev.options];
                    newOptions[0] = {
                      ...newOptions[0],
                      explanation: e.target.value,
                    };
                    return { ...prev, options: newOptions };
                  });
                }}
                rows={4}
                placeHolder="Enter the explanation"
                label="Explanation"
              />
            )}

            <button
              type="submit"
              className="submit-edited-btn"
              disabled={!hasChanges}
            >
              Update
            </button>
          </form>
        </IonContent>
      </IonModal>
    </>
  );
};

export default MoreOptions;
