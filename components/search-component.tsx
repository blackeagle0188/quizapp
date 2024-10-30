"use client";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Input } from "./ui/input";
import { useQuery } from "@tanstack/react-query";
import { searchQuiz } from "@/actions/searchQuiz";
import { useRouter } from "next/navigation";

const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

interface SearchResult {
  id: string;
  scenerio: string;
  intro: string;
  ownerId: string;
  optionIds: string[];
  ratings: number | null;
  setIds: string[];
  sets: {
    id: string;
    setName: string;
  }[];
}

export const SearchComponent = ({
  showResult,
  setShowResult,
}: {
  showResult: boolean;
  setShowResult: Dispatch<SetStateAction<boolean>>;
}) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");

  const processQuery = (query: string) => {
    try {
      const url = new URL(query);
      const params = new URLSearchParams(url.search);
      return params.get("quid") as string;
    } catch (_) {
      return query;
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search-questions", query],
    queryFn: () => searchQuiz(processQuery(query)),
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: !!query,
  });

  useEffect(() => {
    if (data) {
      setResults(data);
    }
  }, [data]);

  const debouncedSearchHandler = debounce((value: string) => {
    setQuery(value);
    setShowResult(true);
  }, 500); // 500ms delay

  const searchHandler = (value: string) => {
    debouncedSearchHandler(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchHandler(e.target.value);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text");
    searchHandler(pasteData);
  };

  return (
    <div className="w-[90%] sm:w-[40%] mx-auto relative">
      <div className="w-full flex items-center rounded-full border bg-card">
        <span className="pl-4 pr-2 py-2 text-white">Search</span>
        <Input
          className="w-full py-2 text-white rounded-r-full placeholder:text-right border-none placeholder:text-white focus-visible:ring-0 bg-transparent"
          onChange={handleInputChange}
          onPaste={handlePaste}
          placeholder="(Type the keyword for search)"
        />
      </div>
      {showResult && <ResultPopup results={results} />}
    </div>
  );
};

function ResultPopup({ results }: { results: SearchResult[] }) {
  const router = useRouter();
  const goToQuestion = (id: string) => {
    router.push("/questions?quid=" + id);
  };
  return (
    <div className="absolute top-full left-0 w-full z-50 bg-gradient shadow-md rounded-md mt-2 pb-8">
      <div className="p-4 max-h-60 overflow-y-auto no-scrollbar">
        <div className="px-4 text-white uppercase mb-4 w-full gap-4 custom-grid">
          <span className="">Questions</span>
          <span>Sets</span>
        </div>
        <ul className="text-white">
          {results.length > 0 ? (
            results.map((result) => (
              <li
                key={result.id}
                className="flex items-center justify-between py-1 rounded-md hover:bg-gradient-to-tr from-[#B9DCF6] to-[#1669E5]/35 px-4"
                onClick={() => goToQuestion(result.id)}
              >
                <div className=" w-full gap-4 text-sm sm:text-[1rem] custom-grid">
                  <span className="text-blue-600 w-[90%]">
                    {result.scenerio}
                  </span>
                  <span className="text-blue-600 text-clip text-nowrap   ">{`${
                    result.sets
                      ? result.sets?.map((set) => set.setName).join(", ")
                      : "No Sets"
                  }`}</span>
                </div>
              </li>
            ))
          ) : (
            <li className="py-1">No results found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
