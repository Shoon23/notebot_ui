import React, { useEffect, useState } from "react";
import AttemptCard from "../components/AttemptCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import quizServices from "@/services/quizServices";
const ViewQuiz: React.FC = () => {
  const { quizId } = useParams<any>();
  const [questions, setQuestions] = useState<any>([]);

  console.log(quizId);
  useEffect(() => {
    const fetchQuiz = async () => {
      const data = await quizServices.getQuiz(quizId as string);
      setQuestions(data.question);
    };
    fetchQuiz();
  }, []);
  return (
    <section className="px-3 flex flex-col text-neutral-content h-screen">
      <div className="flex flex-col mb-3">
        <h1 className="mb-1 md:text-2xl">Notes</h1>
        <div className="card text-neutral-content w-96">
          <div className="card-body items-center text-center">
            <p>*Summarization or View Notes</p>
          </div>
        </div>
      </div>

      <div className="flex mb-3">
        <Button
          disabled={true}
          className="mb-2 mr-1 bg-yellow-500 hover:bg-yellow-500 flex-1 md:h-12 md:text-2xl"
        >
          Take Quiz
        </Button>
        <Button
          disabled={true}
          className="bg-indigo-500 hover:bg-indigo-500 flex-1 ml-1 md:h-12 md:text-2xl"
        >
          Study Mode
        </Button>
      </div>

      <Tabs defaultValue="question" className="w-full">
        <TabsList className="w-full md:h-14">
          <TabsTrigger className="w-full md:text-2xl" value="question">
            Questions
          </TabsTrigger>
          <TabsTrigger className="w-full md:text-2xl" value="history">
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="question" className="flex flex-col">
          <ScrollArea className="flex flex-col  h-[70vh] w-full">
            {questions.map((q: any) => {
              return (
                <QuestionCard
                  key={q.question_id}
                  question={q.content}
                  options={q.options}
                />
              );
            })}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="history" className="flex flex-col">
          <ScrollArea className="flex flex-col h-[70vh] w-full">
            To be Implemented
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ViewQuiz;
