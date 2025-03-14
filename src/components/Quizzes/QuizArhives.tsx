import NoteCard from "@/components/NoteCard";

import React from "react";
import { Note } from "@/databases/models/note";
import useStorageService from "@/hooks/useStorageService";
import { iQuiz } from "@/repository/QuizRepository";
import QuizCard from "../QuizCard";
import { useHistory } from "react-router-dom";

interface QuizArhivesProps {
  quizzes: iQuiz[];
}

const QuizArhives: React.FC<QuizArhivesProps> = ({ quizzes }) => {
  // Create a reference for the file input
  const storageServ = useStorageService();
  const history = useHistory();

  const redirectQuiz = async (quiz_id: number) => {
    history.push(`/quiz-archive/${quiz_id}`, {});
  };
  return (
    <>
      {/* <SearchInput /> */}

      {quizzes.length !== 0 ? (
        <div
          style={{
            height: "650px",
            width: "100%",
            marginTop: "20px",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
            scrollBehavior: "smooth", // Optional: for smooth scrolling
            alignItems: "center",
          }}
        >
          {quizzes.map((data, index) => {
            return (
              <QuizCard
                key={index}
                data={data}
                redirectQuiz={redirectQuiz}
                handleSelectArchive={function (
                  quiz: iQuiz,
                  isChecked: boolean
                ): void {
                  throw new Error("Function not implemented.");
                }}
              />
            );
          })}
          <br />
          <br />
          <br />
        </div>
      ) : (
        <div
          style={{
            display: "flex",

            whiteSpace: "nowrap",
            scrollBehavior: "smooth", // Optional: for smooth scrolling
            flexDirection: "column",
            height: "650px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No Archives
        </div>
      )}
    </>
  );
};

export default QuizArhives;
