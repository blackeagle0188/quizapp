"use client";
import { Poppins } from "next/font/google";
import { SetCard } from "@/components/home/set-card";
import { GetStarted } from "@/components/home/get-started";
import { useState } from "react";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  return (
    <main className="w-full">
      <div className="flex flex-col-reverse md:flex-row justify-center items-center my-8 w-full  md:w-[70%] mx-auto gap-4 no-scrollbar">
        <SetCard selectedSet={selectedSet} onSelect={setSelectedSet} />
        <GetStarted selectedSet={selectedSet} />
      </div>
    </main>
  );
}
