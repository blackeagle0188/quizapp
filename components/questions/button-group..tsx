"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
export const ButtonGroup = ({ nextQuestion }: { nextQuestion: () => void }) => {
  const [showInput, setShowInput] = useState(false);
  const [questionUrl, setQuestionUrl] = useState("");
  const router = useRouter();

  const handleCreateQuestion = () => {
    router.push("/new-question");
  };

  const handleFindQuestion = () => {
    setShowInput(true);
  };

  return (
    <div className="flex w-full items-center justify-between sm:w-[35%] mx-auto  ">
      <Popover>
        <PopoverTrigger className="uppercase text-[1rem] border py-2 px-4 rounded-full shadow-md text-white bg-card">
          Add Question
        </PopoverTrigger>
        <PopoverContent className="bg-card px-6 flex flex-col justify-center items-center gap-4">
          <div className="w-[80%] mx-auto flex flex-col justify-center gap-4 pt-4">
            {!showInput && (
              <>
                <Button onClick={handleCreateQuestion}>Create Question</Button>
                <Button onClick={handleFindQuestion}>Find Question</Button>
              </>
            )}
            {showInput && (
              <div className="flex items-center flex-col justify-center gap-4">
                <Button onClick={handleFindQuestion}>Find Question</Button>
                <Input
                  type="text"
                  placeholder="Enter link or Search for Question"
                  value={questionUrl}
                  onChange={(e) => setQuestionUrl(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-slate-200"
                />
              </div>
            )}
          </div>
          <ChevronDown
            className="text-white cursor-pointer"
            onClick={() => setShowInput(!showInput)}
          />
        </PopoverContent>
      </Popover>
      <Button
        className="uppercase w-[120px] text-[1rem]"
        onClick={nextQuestion}
      >
        Next
      </Button>
    </div>
  );
};
