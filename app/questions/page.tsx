"use client";

import { getQuestions } from "@/actions/question";
import { ButtonGroup } from "@/components/questions/button-group.";
import { QuestionCard } from "@/components/questions/question-card";
import { useComment } from "@/hooks/use-comment";
import { useQuestion } from "@/hooks/use-question-data";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IQuestion } from "@/utils/type";

const QuestionPage = () => {
  const params = useSearchParams();
  const setId = params.get("setId");
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [useSet, setUseSet] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<IQuestion | null>(
    null
  );

  const { isCommentOpen } = useComment();

  const {
    data: questionsFromSet,
    isLoading: isSetLoading,
    isError: isSetError,
  } = useQuery({
    queryKey: ["questions", setId],
    queryFn: () => getQuestions(setId!),
    enabled: !!setId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const {
    question: randomQuestion,
    isError: isQuestionError,
    isLoading: isQuestionLoading,
    nextQuestion,
  } = useQuestion();

  useEffect(() => {
    if (questionsFromSet?.data) {
      setUseSet(true);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(questionsFromSet.data[0]);
    } else {
      // setUseSet(false);
    }
  }, [questionsFromSet]);

  useEffect(() => {
    if (!useSet) {
      setCurrentQuestion(randomQuestion as IQuestion);
    }
  }, [randomQuestion, useSet]);

  const handleNextQuestion = () => {
    if (useSet && questionsFromSet?.data) {
      const nextIndex =
        currentQuestionIndex < questionsFromSet.data.length - 1
          ? currentQuestionIndex + 1
          : currentQuestionIndex;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(questionsFromSet.data[nextIndex]);
    } else {
      nextQuestion();
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleProceedWithRandom = () => {
    setUseSet(false);
    nextQuestion();
  };

  console.log("Current:", currentQuestion);

  if (isSetLoading || isQuestionLoading) {
    return <div className="text-blue-600">Loading...</div>;
  }

  if (isSetError || isQuestionError) {
    return <p className="text-red-600">Error loading question</p>;
  }

  if (
    setId &&
    (!questionsFromSet || questionsFromSet.data.length === 0) &&
    !currentQuestion
  ) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-600">Error: Set is empty</p>
        <div className="flex gap-2">
          <Button onClick={handleBack}>Go Back</Button>
          <Button onClick={handleProceedWithRandom}>Proceed with Random</Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-600">Error: No Question Found!</p>
        <div className="flex gap-2">
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`w-[90%] ${
        isCommentOpen ? "sm:w-[70%]" : "sm:w-[50%]"
      } flex flex-col gap-8 mt-4 sm:mt-0`}
    >
      <QuestionCard question={currentQuestion} />
      <ButtonGroup nextQuestion={handleNextQuestion} />
    </section>
  );
};

export default QuestionPage;
