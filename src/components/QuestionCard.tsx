import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const QuestionCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          1. Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
          quas corrupti tenetur saepe harum repudiandae et
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>a. We are using cookies for no reason.</p>
        <p className=" bg-green-300 text-black p-2">
          b. We are using cookies for no reason.
        </p>
        <p>c. We are using cookies for no reason.</p>
        <p>d. We are using cookies for no reason.</p>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
