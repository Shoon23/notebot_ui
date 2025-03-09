import React, { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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
import { Directory, Filesystem } from "@capacitor/filesystem";
import { base64ToArrayBuffer, getFileExtension } from "@/pages/NoteInput";
import mammoth from "mammoth";
import { remove, scale, add } from "ionicons/icons";
import { pdfjs, Document, Page } from "react-pdf";
import LazyPage from "../LazyPage";

interface QuizQuickActionsProps {
  question_type: string;
  setQuiz: React.Dispatch<React.SetStateAction<iMCQQuestion>>;
  quiz_id: number;
  isSelectQuestion: boolean;
  note: {
    content_text: string | null;
    content_pdf_url: string | null;
    note_name: string;
    note_id: number;
  };
}

const QuizQuickActions: React.FC<QuizQuickActionsProps> = ({
  question_type,
  quiz_id,
  setQuiz,
  isSelectQuestion,
  note,
}) => {
  const [isAdd, setIsdAdd] = useState(false);
  const [questionData, setQuestionData] = useState(initQuestion);
  const storageServ = useStorageService();
  const [fileData, setFileData] = useState<{
    blob: Blob | null;
    type: "pdf" | "docx" | null;
  }>({ blob: null, type: null });
  const viewerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [defaultScale, setDefaultScale] = useState(1.0);

  const [numPages, setNumPages] = useState(0);
  const docxContainerRef = useRef<HTMLDivElement>(null);
  const [isViewNote, setIsViewNote] = useState(false);
  const [pdfDocument, setPdfDocument] = useState<any>(null); // PDFDocumentProxy type

  // Pinch-to-zoom handling on the viewer container
  const initialPinchDistance = useRef<number | null>(null);
  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  useEffect(() => {
    const container = viewerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialPinchDistance.current = getDistance(e.touches[0], e.touches[1]);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDistance.current !== null) {
        const newDistance = getDistance(e.touches[0], e.touches[1]);
        const scaleChange = newDistance / initialPinchDistance.current;
        setScale((prev) => Math.max(prev * scaleChange, 0.1));
        initialPinchDistance.current = newDistance;
        e.preventDefault(); // Prevent default pinch-zoom behavior
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        initialPinchDistance.current = null;
      }
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Zoom control buttons for non-touch adjustments
  const handleZoomIn = () =>
    setScale((prev) => parseFloat((prev + 0.1).toFixed(4)));

  const handleZoomOut = () =>
    setScale((prev) =>
      parseFloat(Math.max(prev - 0.1, defaultScale).toFixed(4))
    );
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
      setIsViewNote(false);
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
  const handleViewNote = async () => {
    try {
      setIsViewNote(true);
      // Fetch the note and update the last viewed time.

      if (note.content_pdf_url) {
        // Read file data from the filesystem
        const readResult = await Filesystem.readFile({
          path: note.content_pdf_url,
          directory: Directory.Data,
        });

        // Determine the file extension and MIME type
        const fileExtension = getFileExtension(note.note_name).toLowerCase();
        const mimeType =
          fileExtension === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        // Create a Blob from the base64 data
        const blob = new Blob(
          [base64ToArrayBuffer(readResult.data as string)],
          {
            type: mimeType,
          }
        );

        // Update file data state
        setFileData({
          blob,
          type:
            fileExtension === "pdf"
              ? "pdf"
              : fileExtension === "docx"
              ? "docx"
              : null,
        });

        // If the file is a DOCX, convert it to HTML using Mammoth
        if (fileExtension === "docx") {
          try {
            const arrayBuffer = await new Response(blob).arrayBuffer();
            const result = await mammoth.convertToHtml(
              { arrayBuffer },
              {
                includeDefaultStyleMap: true,
                styleMap: [
                  "p[style-name='Heading1'] => h1:fresh",
                  "p[style-name='Heading2'] => h2:fresh",
                  "p[style-name='Heading3'] => h3:fresh",
                  "p[style-name='Normal'] => p",
                  "table => div.table-container > table",
                  "p[style-name='List Paragraph'] => li",
                ],
              }
            );

            if (docxContainerRef.current) {
              // Set the converted HTML content
              docxContainerRef.current.innerHTML = result.value;
              // Optionally add extra styling to tables
              docxContainerRef.current
                .querySelectorAll("table")
                .forEach((table) => {
                  table.classList.add("table", "table-bordered");
                });
            }

            // Log conversion warnings, if any.
            result.messages.forEach((message) => {
              console.warn(message);
            });
          } catch (conversionError) {
            console.error("Error converting DOCX:", conversionError);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  };

  const onLoadSuccess = (pdf: any) => {
    setPdfDocument(pdf);
    setNumPages(pdf.numPages);
    pdf.getPage(1).then((page: any) => {
      const viewport = page.getViewport({ scale: 1 }); // natural dimensions
      if (viewerRef.current) {
        const containerWidth = viewerRef.current.clientWidth;
        const newScale = containerWidth / viewport.width;
        const roundedScale = parseFloat(newScale.toFixed(4));
        setDefaultScale(roundedScale);
        setScale(roundedScale);
      }
    });
  };
  // Clean up the PDF document when the modal is closed
  useEffect(() => {
    if (!isViewNote && pdfDocument) {
      // Destroy the PDF document proxy to properly terminate the worker.
      pdfDocument.destroy();
      setPdfDocument(null);
      // Optionally reset fileData if you want to reload the PDF on modal open.
      setFileData({ blob: null, type: null });
    }
  }, [isViewNote, pdfDocument]);
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
        <button className="view-note-btn" onClick={handleViewNote}>
          View Note
        </button>
        <button
          className="add-question-btn"
          disabled={question_type === "essay" || isSelectQuestion}
          onClick={() => setIsdAdd(true)}
        >
          Add Questions
        </button>
      </div>
      {/* Add Question Modal */}
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

      {/* View Note Modal */}
      <IonModal isOpen={isViewNote}>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                color="danger"
                onClick={() => {
                  setIsViewNote(false);
                }}
              >
                Cancel
              </IonButton>
            </IonButtons>
            <IonTitle slot="end">Notes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" style={{ borderRadius: "1rem" }}>
          {note.content_pdf_url ? (
            <>
              {/* Zoom Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <IonButton
                  onClick={handleZoomOut}
                  disabled={scale <= defaultScale}
                >
                  <IonIcon icon={remove} />
                </IonButton>
                <IonButton onClick={handleZoomIn}>
                  <IonIcon icon={add} />
                </IonButton>
              </div>
              {/* Viewer Container with pinch-to-zoom support */}
              <div
                ref={viewerRef}
                style={{
                  overflowX: "scroll",
                }}
              >
                {/* PDF Renderer */}
                {fileData.type === "pdf" && fileData.blob && (
                  <Document file={fileData.blob} onLoadSuccess={onLoadSuccess}>
                    {[...Array(numPages)].map((_, index) => (
                      <LazyPage
                        key={index}
                        pageNumber={index + 1}
                        scale={scale}
                      />
                    ))}
                  </Document>
                )}

                {/* DOCX Renderer */}
                {fileData.type === "docx" && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div
                      className="docx-container"
                      style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "top center",
                      }}
                    >
                      <div ref={docxContainerRef} className="docx-content" />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <textarea
              className="note-input"
              placeholder="Enter Here...."
              value={note.content_text as string}
              disabled={true}
            />
          )}
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
