"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAnswers } from "@/actions/getAnswers";
import { useRouter } from "next/navigation";

export const Answers = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const router = useRouter();
  const pageNumber = 6;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["publicSets"],
      queryFn: ({ pageParam = 1 }) => getAnswers(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data?.length < pageNumber) return undefined;
        return allPages.length + 1;
      },
    });

  const observerElem = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerElem.current) {
      observer.observe(observerElem.current);
    }

    return () => {
      if (observerElem.current) {
        observer.unobserve(observerElem.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  const handleAnswerClick = ({ id, quId }: { id: string; quId: string }) => {
    setSelectedAnswer(id);
    router.push(`/questions?quid=${quId}`);
  };

  return (
    <section className="flex flex-col items-center gap-4  w-[80%] sm:w-[40%] mx-auto ">
      <Card className="w-full py-6 ">
        <CardContent className="flex flex-col items-center gap-4 h-[40vh]  overflow-auto no-scrollbar py-2">
          {status === "pending" &&
            Array.from({ length: pageNumber }).map((_, index) => (
              <Skeleton key={index} className="w-full h-10" />
            ))}
          {data?.pages.map((page, pageIndex) =>
            page.data.map((answer, index) => (
              <div
                className={`w-full bg-gradient border-none text-[#7A94B8] px-4 py-2 rounded-md hover:ring-2 hover:ring-blue-500 cursor-pointer  ${
                  selectedAnswer === answer.id ? "ring-2 ring-blue-500" : ""
                }`}
                key={`${pageIndex}-${index}`}
                onClick={() =>
                  handleAnswerClick({ id: answer.id, quId: answer.questionId })
                }
              >
                <p>{answer.question.scenerio}</p>
              </div>
            ))
          )}
          {isFetchingNextPage &&
            Array.from({ length: pageNumber }).map((_, index) => (
              <Skeleton key={index} className="w-full h-10" />
            ))}
          <div ref={observerElem} className="w-full h-5"></div>
        </CardContent>
      </Card>
    </section>
  );
};
