"use client";
import { useEffect, useRef, SetStateAction, Dispatch } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPublicSets } from "@/actions/set";

export const SetCard = ({
  onSelect: setSelectedSet,
  selectedSet,
}: {
  onSelect: Dispatch<SetStateAction<string | null>>;
  selectedSet: string | null;
}) => {
  // const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const pageNumber = 6;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["publicSets"],
      queryFn: ({ pageParam = 1 }) => getPublicSets(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.length < pageNumber) return undefined;
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

  const handleSetClick = (set: string) => {
    setSelectedSet(set);
  };

  return (
    <section className="flex flex-col items-center gap-4  w-[80%] ">
      <Button className="text-white w-[50%] uppercase sm:text-[18px] ">
        Select Set
      </Button>
      <Card className="w-full py-6 px-4">
        <CardContent className="flex flex-col px-0 items-center gap-4 w-full h-[40vh] min-w-[200px] overflow-auto no-scrollbar">
          {status === "pending" &&
            Array.from({ length: pageNumber }).map((_, index) => (
              <Skeleton key={index} className="w-full h-12" />
            ))}
          {data?.pages.map((page, pageIndex) =>
            page.data.map((set, index) => (
              <Button
                className={`w-full bg-gradient border-none text-[#7A94B8] sm:py-6 sm:text-[18px]  ${
                  selectedSet === set.id ? "ring-2 ring-blue-500" : ""
                }`}
                key={`${pageIndex}-${index}`}
                onClick={() => handleSetClick(set.id)}
              >
                {set.setName}
              </Button>
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
