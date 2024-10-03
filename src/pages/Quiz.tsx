import React, { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionCard from "@/components/QuestionCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import AttemptCard from "@/components/AttemptCard";
import quizServices from "@/services/quizServices";
import useUserSession from "@/hooks/useUserSession";
import { useIonRouter } from "@ionic/react";

const Quiz: React.FC = () => {
  const user = useUserSession();
  const [quiz, setQuiz] = useState<any>([]);
  const router = useIonRouter();
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await quizServices.getQuizzes(user.user_id as any);
        setQuiz(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuizzes();
  }, []);
  return (
    <section className="flex px-3 flex-col overflow-y-scroll bg-neutral py-3 h-screen">
      <Input
        type="text"
        name="search"
        placeholder="Search"
        className="mb-2"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70 fill-white"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
      <Button
        onClick={() => {
          router.push("/quiz/generate");
        }}
        className="bg-yellow-500 mb-5 hover:bg-yellow-500"
      >
        Generate Quiz
      </Button>

      <Tabs defaultValue="quizzes" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="quizzes">
            Quizzes
          </TabsTrigger>
          <TabsTrigger className="w-full" value="attempts">
            Attempts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="quizzes" className="flex flex-col">
          <ScrollArea className="flex flex-col  h-[70vh] w-full">
            {quiz.length > 0 ? (
              quiz.map((val: any) => {
                return (
                  <Button
                    onClick={() => {
                      router.push(`/quiz/view/${val.quiz_id}`);
                    }}
                    key={val.quiz_id}
                    className="w-full mb-2 bg-gray-900 px-4 h-16 items-center flex flex-row justify-between active:bg-gray-950 hover:bg-gray-950"
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
              <div>No Generated Quiz Yet</div>
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="attempts" className="flex flex-col">
          <ScrollArea className="flex flex-col  h-[70vh] w-full">
            <div className="">To be Implemented</div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Quiz;
