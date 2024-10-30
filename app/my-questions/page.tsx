import { getMyQuestions } from "@/actions/question";
import { ButtonGrp } from "@/components/button-group";
import { GradientCard } from "@/components/gradient-card";
import { Question } from "@/components/question";
import React from "react";

const MyQuestions = async () => {
  const results = await getMyQuestions();
  return (
    <section className="w-full sm:w-[40%] space-y-6 ">
      <div className="w-[90%] space-y-4 mx-auto mt-4 sm:mt-0">
        <GradientCard>
          {results.data?.map((question) => (
            <Question question={question} key={question.id} />
          ))}
        </GradientCard>
        <ButtonGrp back next="Add Question" />
      </div>
    </section>
  );
};

export default MyQuestions;
