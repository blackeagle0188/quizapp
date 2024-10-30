"use client";
import { getQuestionById } from "@/actions/question";
import { QuestionCard } from "@/components/questions/question-card";
import { Button } from "@/components/ui/button";
import { useComment } from "@/hooks/use-comment";
import { useQuestion } from "@/hooks/use-question-data";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";

const Percentage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const { isCommentOpen } = useComment();
  const { nextQuestion } = useQuestion();
  const searchParams = Object.fromEntries(params);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["questions", searchParams.qId],
    queryFn: () => getQuestionById(searchParams.qId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const question = data?.question;
  console.log(searchParams.qId);
  console.log(question);
  const handleNextQuestion = () => {
    if (question?.id) {
      router.push(`/questions`);
      setTimeout(() => nextQuestion(), 100);
    }
  };
  // if (!question) {
  //   router.back();
  // }
  if (!searchParams.qId) {
    router.back();
  }

  if (isLoading) {
    return <div className="text-blue-600">Loading...</div>;
  }

  if (isError) {
    return <p className="text-red-600">Error loading question</p>;
  }

  return (
    <section className="w-full flex flex-col gap-8 justify-center items-center relative">
      <div
        className={`w-[90%] ${
          isCommentOpen ? "sm:w-[70%]" : "sm:w-[50%]"
        } flex flex-col gap-8 mt-4 sm:mt-0`}
      >
        <QuestionCard question={question!} isPercentage />
      </div>

      <div className="flex items-center justify-between w-[50%]">
        <Button onClick={() => router.back()}>Back</Button>
        <Button onClick={handleNextQuestion}>Next</Button>
      </div>
    </section>
  );
};

export default Percentage;
