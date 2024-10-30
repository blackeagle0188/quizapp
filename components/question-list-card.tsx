"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface IOption {
  _id: string;
  text: string;
  count: number;
}

interface IQuestion {
  _id: string;
  author: string;
  scenerio?: string;
  intro: string;
  options: IOption[];
  set: string;
  rating: number;
}

const fetchQuestions = async (page: number): Promise<IQuestion[]> => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const questions: IQuestion[] = Array.from({ length: 5 }, (_, index) => ({
        _id: `q${page * 5 + index + 1}`,
        author: `Author ${page * 5 + index + 1}`,
        intro: `Intro ${page * 5 + index + 1}`,
        options: [
          { _id: `o1`, text: "Option 1", count: 0 },
          { _id: `o2`, text: "Option 2", count: 0 },
        ],
        set: `Set ${page * 5 + index + 1}`,
        rating: Math.floor(Math.random() * 5) + 1,
      }));
      resolve(questions);
    }, 1000);
  });
};

export const QuestionListCard = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [page, setPage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const loadQuestions = async () => {
      const newQuestions = await fetchQuestions(page);
      setQuestions((prevQuestions) => [...prevQuestions, ...newQuestions]);
    };
    loadQuestions();
  }, [page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    console.log(scrollTop, scrollHeight, clientHeight);
    if (scrollTop + clientHeight >= scrollHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleQuestionClick = (id: string) => {
    router.push(`/questions/${id}`);
  };

  return (
    <Card className="w-full h-[40%] overflow-auto no-scrollbar">
      <CardContent onScroll={handleScroll} className="py-4 flex flex-col gap-4">
        {questions.map((question) => (
          <div
            key={question._id}
            className="bg-gradient text-white px-4 py-2 cursor-pointer rounded-md"
            onClick={() => handleQuestionClick(question._id)}
          >
            <h3>{question.intro}</h3>
            <p>Author: {question.author}</p>
            <p>Set: {question.set}</p>
            <p>Rating: {question.rating}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
