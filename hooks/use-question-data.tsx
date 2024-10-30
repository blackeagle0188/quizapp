import { QuestionContext } from "@/contexts/question-context";
import { useContext } from "react";

export const useQuestion = () => {
  const {
    question,
    isError,
    isLoading,
    showComments,
    commentToggleHandler,
    nextQuestion,
    page,
  } = useContext(QuestionContext);

  return {
    question,
    isError,
    isLoading,
    showComments,
    commentToggleHandler,
    nextQuestion,
    page,
  };
};
