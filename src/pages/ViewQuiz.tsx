import React from "react";
import AttemptCard from "../components/AttemptCard";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
const ViewQuiz: React.FC = () => {
  return (
    <section className="px-3 flex flex-col text-neutral-content h-screen">
      <div className="flex flex-col mb-3">
        <h1 className="mb-1">Notes</h1>
        <div className="card text-neutral-content w-96">
          <div className="card-body items-center text-center">
            <p>*Summarization or View Notes</p>
          </div>
        </div>
      </div>

      <div className="flex mb-3">
        <Button className="mb-2 mr-1 bg-yellow-500 hover:bg-yellow-500 flex-1">
          Take Quiz
        </Button>
        <Button className="bg-indigo-500 hover:bg-indigo-500 flex-1 ml-1">
          Study Mode
        </Button>
      </div>

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
            <QuestionCard />
            <QuestionCard />
            <QuestionCard />
            <QuestionCard />
            <QuestionCard />
            <QuestionCard />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="attempts" className="flex flex-col">
          <ScrollArea className="flex flex-col h-[70vh] w-full">
            <AttemptCard />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ViewQuiz;
