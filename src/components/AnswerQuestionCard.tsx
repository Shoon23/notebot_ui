import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "./ui/label";

interface AnswerQuestionCardProps {
  question: any;
  options: any[];
  onValueChange: (
    value: string,
    question_id: string,
    option_id: string
  ) => void;
}
const AnswerQuestionCard: React.FC<AnswerQuestionCardProps> = ({
  options,
  question,
  onValueChange,
}) => {
  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle className="text-lg">{question.content}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <RadioGroup
          onValueChange={(value) => {
            // Find the selected option to get its `option_id`
            const selectedOption = options.find((opt) => opt.content === value);
            if (selectedOption) {
              onValueChange(
                value,
                question.question_id,
                selectedOption.option_id
              );
            }
          }}
        >
          {options.map((opt: any, idx: number) => {
            return (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.content} id={opt.option_id} />
                <Label htmlFor={opt.option_id}>{opt.content}</Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default AnswerQuestionCard;
