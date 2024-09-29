import React from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

const AttemptCard = () => {
  return (
    <Button className="w-full mb-2 bg-gray-900 px-4 h-16 items-center flex flex-row justify-between active:bg-gray-950 hover:bg-gray-950">
      <Label className="font-bold text-white text-xl">Lorem</Label>
      <Label className="font-bold text-white  text-xl">1/10</Label>
    </Button>
  );
};

export default AttemptCard;
