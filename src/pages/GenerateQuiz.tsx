import React from "react";
import Input from "../components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";

const GenerateQuiz: React.FC = () => {
  return (
    <section className="px-3 h-screen bg-neutral py-3">
      <form className="space-y-3">
        <Input type="text" placeholder="Quiz Name" />

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant={"outline"} className="w-full">
              Choose Note
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Notes</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <Input type="text" placeholder="Search" />
              <div className="flex flex-col h-[70vh]"></div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        {/* end */}
        <Select>
          <SelectTrigger className="">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="">
            <SelectValue placeholder="Question Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="">
            <SelectValue placeholder="BLOOMS Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
          </SelectContent>
        </Select>

        <Button className="bg-yellow-500 hover:bg-yellow-500 w-full">
          Generate
        </Button>
      </form>
    </section>
  );
};

export default GenerateQuiz;
