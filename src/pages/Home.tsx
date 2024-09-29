import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const Home: React.FC = () => {
  return (
    <ScrollArea className="bg-neutral h-[93vh] p-3 flex flex-col items-center ">
      <div className="flex flex-col items-center w-full lg:flex-row">
        <div className="mb-5 grid-cols-2 w-full grid text-white">
          <Button className=" bg-red-500 rounded-md m-1 h-16 text-neutral-content border-none">
            Create a Quiz
          </Button>
          <Button className=" bg-green-500 rounded-md  m-1 h-16 text-neutral-content border-none">
            Upload Notes
          </Button>
          <Button className=" bg-blue-500 rounded-md  m-1 h-16 text-neutral-content border-none">
            Progress
          </Button>
          <Button className=" bg-orange-500 rounded-md m-1 h-16 text-neutral-content border-none">
            Upload Notes
          </Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <div className="flex mb-1 flex-col">
          <h1 className="text-white mb-1">Recent Quiz</h1>
          <div className="flex flex-col ">
            {[1, 2, 3, 4, 5].map((val) => {
              return (
                <Button className="mb-2 bg-gray-900 px-4 h-16 items-center flex flex-row justify-between active:bg-gray-950 hover:bg-gray-950">
                  <Label className="font-bold text-white text-xl">Lorem</Label>
                  <Label className="font-bold text-white  text-xl">
                    {val}/10
                  </Label>
                </Button>
              );
            })}
          </div>
        </div>
        <div className="flex mb-1 flex-col">
          <h1 className="text-white mb-2">Recent Notes</h1>
          <div className="flex flex-col">
            {[1, 2, 3, 4, 5].map((val) => {
              return (
                <Button className="mb-2 bg-gray-900 px-4 h-16 items-center flex flex-row justify-between active:bg-gray-950 hover:bg-gray-950">
                  <Label className="font-bold text-white text-xl">Lorem</Label>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Home;
