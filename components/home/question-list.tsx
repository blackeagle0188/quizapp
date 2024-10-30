import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

export const QuestionList = () => {
  const questions = [
    {
      id: 1,
      title: "Question1",
      set: "Set1",
    },
  ];
  return (
    <section className="flex flex-col items-center gap-4 w-full ">
      <Button className="text-white w-[40%]">Select Set</Button>
      <Card className="w-full py-6 px-8">
        <CardHeader className="flex items-center justify-between">
          <p>Questions</p>
          <p>Set</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 w-full"></CardContent>
      </Card>
    </section>
  );
};
