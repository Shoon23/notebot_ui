import React, { ReactNode, useEffect, useState } from "react";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { FaBars } from "react-icons/fa6";
import { Label } from "../ui/label";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Sheet>
        <div className="flex w-full p-3 justify-between">
          <SheetTrigger asChild>
            <Button variant={"outline"}>
              <FaBars size={24} />
            </Button>
          </SheetTrigger>

          <Label className="self-center text-xl md:text-4xl">Notebot</Label>
        </div>
        <SheetContent side={"left"}>
          <div className="flex flex-col text-2xl mt-10">
            <SheetClose asChild>
              <Link to={"/"}>Home</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link to={"/quiz"}>Quiz</Link>
            </SheetClose>{" "}
            <SheetClose asChild>
              <Link to={"/notes"}>Notes</Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
      {children}
    </>
  );
};

export default Layout;
