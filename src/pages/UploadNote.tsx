import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

const UploadNotes = () => {
  return (
    <section className="px-3 h-screen bg-neutral py-3">
      <Dialog defaultOpen={true}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size={"lg"}
            onClick={() => {}}
            className=" md:h-12 md:text-2xl text-white"
          >
            Switch:
          </Button>
        </DialogTrigger>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <div className="w-full flex-col flex justify-center h-full">
            <DialogClose asChild>
              <Button
                size={"lg"}
                onClick={() => {}}
                className="bg-orange-500 mb-2 w-full hover:bg-orange-500 md:h-12 md:text-2xl text-white"
              >
                Text/Inputted Notes
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                size={"lg"}
                onClick={() => {}}
                className="bg-orange-500 w-full hover:bg-orange-500 md:h-12 md:text-2xl text-white"
              >
                Upload PDF
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default UploadNotes;
