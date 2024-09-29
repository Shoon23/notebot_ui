import React from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { FaBars } from "react-icons/fa6";
import { Label } from "../ui/label";
import { useIonRouter } from "@ionic/react";
import { Link } from "react-router-dom";

interface BottomNavigationProps {
  children: React.ReactNode;
}
const BottomNavigation: React.FC<BottomNavigationProps> = ({ children }) => {
  return (
    <>
      <Sheet>
        <div className="flex w-full p-3 justify-between">
          <SheetTrigger asChild>
            <Button variant={"outline"}>
              <FaBars size={24} />
            </Button>
          </SheetTrigger>

          <Label className="self-center text-xl">Notebot</Label>
        </div>
        <SheetContent side={"left"}>
          {/* <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader> */}
          <div className="flex flex-col">
            <SheetClose asChild>
              <Link to={"/"}>Home</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link to={"/quiz"}>Quiz</Link>
            </SheetClose>{" "}
          </div>
        </SheetContent>
      </Sheet>
      {children}
    </>
  );
};

export default BottomNavigation;
