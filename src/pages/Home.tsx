import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import useUserSession from "@/hooks/useUserSession";
import noteService from "@/services/noteService";
import quizServices from "@/services/quizServices";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const user = useUserSession();
  const [quiz, setQuiz] = useState<any>([]);
  const [note, setNotes] = useState<any>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await quizServices.getQuizzes(user.user_id as any);
        setQuiz(res);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchNotes = async () => {
      try {
        const res = await noteService.getNotes(user.user_id as any);
        setNotes(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuizzes();
    fetchNotes();
  }, []);
  return (
    <ScrollArea className="bg-neutral h-[93vh] p-3 flex flex-col items-center ">
      <div className="flex flex-col items-center w-full">
        <div className="mb-5 grid-cols-2 w-full grid text-white md:w-2/4">
          <Button
            disabled={true}
            className=" bg-red-500 rounded-md m-1 h-16 text-neutral-content border-none md:text-xl"
          >
            Create a Quiz
          </Button>
          <Button
            disabled={true}
            className=" bg-green-500 rounded-md  m-1 h-16 text-neutral-content border-none md:text-xl"
          >
            Upload Notes
          </Button>
          <Button
            disabled={true}
            className=" bg-blue-500 rounded-md  m-1 h-16 text-neutral-content border-none md:text-xl"
          >
            Progress
          </Button>
          <Button
            disabled={true}
            className=" bg-orange-500 rounded-md m-1 h-16 text-neutral-content border-none md:text-xl"
          >
            Upload Notes
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center ">
        <div className="w-full md:w-2/4">
          <div className="flex mb-1 flex-col w-full">
            <h1 className="text-white mb-1 w-full">Recent Quiz</h1>
            <div className="flex flex-col w-full">
              {quiz.length > 0 ? (
                quiz.map((val: any) => {
                  // {quiz_id, quiz_name, question_type, blooms_taxonomy_level, difficulty}
                  return (
                    <Button
                      key={val.quiz_id}
                      className="mb-2 bg-gray-900 px-4 h-16 items-center flex flex-row justify-between active:bg-gray-950 hover:bg-gray-950"
                    >
                      <Label className="font-bold text-white text-xl">
                        {val.quiz_name}
                      </Label>
                      {/* <Label className="font-bold text-white  text-xl">
                      {val}/10
                    </Label> */}
                    </Button>
                  );
                })
              ) : (
                <div className="">No Quiz Yet</div>
              )}
            </div>
          </div>
          <div className="flex mb-1 flex-col w-full">
            <h1 className="text-white mb-2">Recent Notes</h1>
            <div className="flex flex-col">
              {note.length > 0 ? (
                note.map((val: any) => {
                  return (
                    <Button
                      key={val.note_id}
                      className="mb-2 bg-gray-900 px-4 h-16 items-center flex flex-row justify-between active:bg-gray-950 hover:bg-gray-950"
                    >
                      <Label className="font-bold text-white text-xl">
                        {val.note_name}
                      </Label>
                    </Button>
                  );
                })
              ) : (
                <div className="">No Notes Yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Home;
