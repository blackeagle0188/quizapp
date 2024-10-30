"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { MultiSelect } from "./ui/select";
import { useEffect, useState } from "react";
import { addQuestionToSets, getSets } from "@/actions/set";
import { toast } from "sonner";

type TQuestion = {
  owner: { name: string };
  sets: { setName: string }[];
  id: string;
  intro: string;
  scenerio: string;
  setIds: string[];
  ratings: number | null;
  ownerId: string;
};
export function Question({ question }: { question: TQuestion }) {
  return (
    <Dialog>
      <DialogTrigger className="bg-gradient px-4 py-2 rounded-md flex flex-col justify-start">
        <p className="text-blue-600 sm:text-[15px] text-center w-full">
          {question.scenerio}
        </p>
        <div className="mt-3 sm:text-[1rem] flex gap-2">
          <span>Sets:</span>
          <p className="text-start text-sm ">
            {question.sets.map((set) => set.setName).join(",")}
          </p>
        </div>
        <div className="flex gap-2 text-sm sm:text-[1rem]">
          <span>Ratings:</span>
          <p>{question.ratings}</p>
        </div>
      </DialogTrigger>

      <AddQuestion question={question} />
    </Dialog>
  );
}

interface Option {
  value: string;
  label: string;
}

function AddQuestion({ question }: { question: TQuestion }) {
  const [options, setOptions] = useState<Option[] | []>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [pendings, setPendings] = useState<boolean>(false);
  useEffect(() => {
    setPendings(true);
    const getMySets = async () => {
      const result = await getSets();
      if (result.success) {
        return setOptions(
          result.data.map((set) => ({ value: set.id, label: set.setName }))
        );
      }
      return toast.error(result.error);
    };
    getMySets().finally(() => {
      setPendings(false);
    });
  }, []);

  const submitHandler = async () => {
    // TODO: Add the question to the selected sets
    console.log("Selected options", selectedOptions);
    // TODO: Handle errors and success messages
    const result = await addQuestionToSets(question.id, selectedOptions);
    if (result.success) {
      toast.success(result.success);
    } else {
      toast.error(result.error);
    }
  };

  console.log(question);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add Question To Set</DialogTitle>
        <DialogDescription>
          You can add a question to more than one set to improve its visibility, but keep it relevant.
        </DialogDescription>
      </DialogHeader>

      <div className="gap-4 flex flex-col">
        <Label htmlFor="name" className="">
          Select Sets
        </Label>
        <MultiSelect
          defaultValues={question.setIds}
          options={options}
          value={selectedOptions}
          onChange={setSelectedOptions}
          placeholder="Select sets"
          className="mb-4 w-full" // Additional class for the container
          selectClassName="border-2 border-gray-300 rounded-lg w-full" // Custom classes for the select component
          menuClassName="bg-white shadow-lg" // Custom classes for the menu
        />
      </div>

      <DialogFooter>
        <Button type="submit" onClick={submitHandler} disabled={pendings}>
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
