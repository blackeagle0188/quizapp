"use client";
import { SearchComponent } from "@/components/search-component";
import React, { useState } from "react";

const SearchPage = () => {
  const [showResult, setShowResult] = useState(false);
  return (
    <section
      className="w-full h-full flex pt-[5rem] "
      onClick={() => setShowResult(false)}
    >
      <SearchComponent showResult={showResult} setShowResult={setShowResult} />
    </section>
  );
};

export default SearchPage;
