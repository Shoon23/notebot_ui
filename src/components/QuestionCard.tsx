import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QuestionCardProps {
  question: string;
  options: any[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({ options, question }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        {options.map((opt: any, idx: number) => {
          return (
            <p
              key={idx}
              className={`${
                opt.is_answer && "bg-green-300 text-black p-2"
              } mb-1`}
            >
              {`${idx + 1}. `} {opt.content}
            </p>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
