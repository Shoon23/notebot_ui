import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { iFormQuizGeneration } from "@/types/quiz-generation";
import quizServices from "@/services/quizServices";
import useUserSession from "@/hooks/useUserSession";
import noteService from "@/services/noteService";
import { useIonRouter } from "@ionic/react";
import { SelectItemText } from "@radix-ui/react-select";

const GenerateQuiz: React.FC = () => {
  const user = useUserSession();
  const router = useIonRouter();
  const [isSubmit, setIsSubmit] = useState(false);
  const [formData, setFormData] = useState<
    iFormQuizGeneration & { note_id?: string }
  >({
    quiz_name: "",
    difficulty: "",
    question_type: "",
    blooms_taxonomy_level: "",
  });

  const [noteText, setNoteText] = useState("");

  const [error, setError] = useState("");
  const [succ, setSucc] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "note") {
      setNoteText(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmit(true);
    // Validate if any field is blank
    if (
      !formData.quiz_name ||
      !formData?.note_id ||
      !formData.difficulty ||
      !formData.question_type ||
      !formData.blooms_taxonomy_level
    ) {
      setError("All fields are required.");
      return;
    }

    console.log("Form submitted successfully!", formData);

    try {
      const data = await quizServices.generateQuiz({
        user_id: user.user_id,
        num_questions: 5,
        ...formData,
      });
      console.log(data);
      router.push(`/quiz/view/${data.quiz_id}`);
    } catch (error) {
      console.log(error);
      setError("Something Went Wrong");
    }
  };

  const handleUpload = async () => {
    setIsSubmit(true);
    try {
      const data = await noteService.uploadNote("text", {
        user_id: user.user_id,
        content_text: noteText,
        note_name: "note",
      });
      setFormData({
        ...formData,
        note_id: data.note_id as any,
      });
      setSucc("Success");
      setError("");
      setIsSubmit(false);
    } catch (error) {
      console.log(error);
      setError("Something Went Wrong");
    }
  };
  return (
    <section className="px-3 h-screen bg-neutral py-3">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Quiz Name"
          name="quiz_name"
          value={formData.quiz_name}
          onChange={handleChange}
        />

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant={"outline"} className="w-full ">
              Choose Note
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Notes</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <Input type="text" placeholder="Search" />
              <div className="flex flex-col h-[70vh]">
                <Textarea
                  placeholder="Type your notes here."
                  name="note"
                  value={noteText}
                  onChange={handleChange}
                />
                {error && <p className="text-red-500">{error}</p>}
                {succ && <p className="text-green-500">{succ}</p>}

                <Button disabled={!noteText || isSubmit} onClick={handleUpload}>
                  Upload
                </Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Select
          onValueChange={(value) => handleSelectChange("difficulty", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => handleSelectChange("question_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Question Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mcq">Multiple Choice</SelectItem>
            <SelectItem value="true-or-false">True/False</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            handleSelectChange("blooms_taxonomy_level", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="BLOOMS Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="remembering">Remembering</SelectItem>
            <SelectItem value="understanding">Understanding</SelectItem>
            <SelectItem value="analyzing">Analyzing</SelectItem>
            <SelectItem value="evaluating">Evaluating</SelectItem>
          </SelectContent>
        </Select>

        {error && <p className="text-red-500">{error}</p>}

        <Button
          // disabled={isSubmit}
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-500 w-full text-white"
        >
          Generate
        </Button>
      </form>
    </section>
  );
};

export default GenerateQuiz;
