import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import quizServices from "@/services/quizServices";
import { useIonRouter } from "@ionic/react";
const ViewQuiz: React.FC = () => {
  const { quizId } = useParams<any>();
  const [questions, setQuestions] = useState<any>([]);
  const router = useIonRouter();
  const [quizData, setQuizData] = useState<any>({});

  useEffect(() => {
    const fetchQuiz = async () => {
      const data = await quizServices.getQuiz(quizId as string);

      setQuizData(data);
      setQuestions(data.question);
    };
    fetchQuiz();
  }, []);
  return (
    <section className="px-3 flex flex-col text-neutral-content h-screen">
      <div className="flex flex-col mb-3">
        <h1 className="mb-1 ">Difficulty: {quizData.difficulty}</h1>
        <h1 className="mb-1 ">
          Blooms Level: {quizData.blooms_taxonomy_level}
        </h1>
        <h1 className="mb-1 ">Question Type: {quizData.question_type}</h1>

        <div className="card text-neutral-content w-96">
          <div className="card-body items-center text-center">
            <p>*Summarization or View Notes</p>
          </div>
        </div>
      </div>

      <div className="flex mb-3">
        <Button
          className="mb-2 mr-1 bg-yellow-500 hover:bg-yellow-500 flex-1"
          onClick={() => {
            router.push(`/quiz/attempt/${quizId}`);
          }}
        >
          Take Quiz
        </Button>
        <Button
          disabled={true}
          className="bg-indigo-500 hover:bg-indigo-500 flex-1 ml-1"
        >
          Study Mode
        </Button>
      </div>

      <Tabs defaultValue="question" className="w-full">
        <TabsList className="w-full ">
          <TabsTrigger className="w-full " value="question">
            Questions
          </TabsTrigger>
          <TabsTrigger className="w-full" value="history">
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
            <br />
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
