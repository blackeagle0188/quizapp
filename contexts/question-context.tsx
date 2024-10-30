import { getQuestions } from "@/actions/question";
import { IQuestion } from "@/utils/type";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState, useEffect } from "react";

export const QuestionContext = createContext({
  question: {} as IQuestion | undefined,
  isLoading: false,
  isError: false,
  showComments: false,
  commentToggleHandler: () => {},
  nextQuestion: () => {},
  page: 1,
});

const getRandomIndex = (arrayLength: number, excludedIndexes: Set<number>) => {
  const availableIndexes = [...Array(arrayLength).keys()].filter(
    (index) => !excludedIndexes.has(index)
  );
  const randomIndex =
    availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
  return randomIndex;
};

const QuestionContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [shownIndexes, setShownIndexes] = useState<Set<number>>(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(null);
  const [showComments, setShowComments] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (data?.data) {
      if (currentQuestionIndex === null) {
        const initialIndex = getRandomIndex(data.data.length, shownIndexes);
        setShownIndexes(new Set([initialIndex]));
        setCurrentQuestionIndex(initialIndex);
      }
    }
  }, [data]);

  const commentToggleHandler = () => {
    setShowComments(!showComments);
  };

  const nextQuestion = () => {
    if (!data?.data) return;

    if (shownIndexes.size < data.data.length) {
      const newIndex = getRandomIndex(data.data.length, shownIndexes);
      setShownIndexes((prevIndexes) => new Set(prevIndexes).add(newIndex));
      setCurrentQuestionIndex(newIndex);
    } else {
      // If all questions have been displayed, show the last question
      setCurrentQuestionIndex(data.data.length - 1);
    }
  };

  const question: IQuestion | undefined =
    currentQuestionIndex !== null
      ? data?.data[currentQuestionIndex]
      : undefined;

  const values = {
    question,
    isLoading,
    isError,
    showComments,
    commentToggleHandler,
    nextQuestion,
    page: currentQuestionIndex !== null ? currentQuestionIndex + 1 : 1,
  };

  return (
    <QuestionContext.Provider value={values}>
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionContextProvider;
