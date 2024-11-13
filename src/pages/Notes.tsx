import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIonRouter } from "@ionic/react";
import React from "react";

const Notes = () => {
  const router = useIonRouter();

  return (
    <section className="flex px-3 flex-col overflow-y-scroll bg-neutral py-3 h-screen">
      <Input
        type="text"
        name="search"
        placeholder="Search"
        className="mb-2"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4  opacity-70 fill-white"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
      <Button
        size={"lg"}
        onClick={() => {
          router.push("/notes/upload");
        }}
        className="bg-orange-500 mb-5 hover:bg-orange-600  text-white"
      >
        Add Notes
      </Button>

      <Tabs defaultValue="quizzes" className="w-full">
        <TabsList className="w-full ">
          <TabsTrigger className="w-full" value="quizzes">
            Quizzes
          </TabsTrigger>
          <TabsTrigger className="w-full" value="attempts">
            Attempts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="quizzes" className="flex flex-col">
          <ScrollArea className="flex flex-col  h-[70vh] w-full"></ScrollArea>
        </TabsContent>
        <TabsContent value="attempts" className="flex flex-col">
          <ScrollArea className="flex flex-col  h-[70vh] w-full">
            <div className="">To be Implemented</div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Notes;
