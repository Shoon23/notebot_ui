import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface AnswerQuestionCardProps {
  question: string;
  options: any[];
}
const AnswerQuestionCard: React.FC<AnswerQuestionCardProps> = ({
  options,
  question,
}) => {
  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle className="text-lg">{question}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        {options.map((opt: any, idx: number) => {
          return (
            <Button key={idx} className={`mb-1`}>
              {opt.content}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AnswerQuestionCard;
