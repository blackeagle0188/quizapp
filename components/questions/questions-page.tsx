"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

export const QuestionsPageComponent = () => {
  return (
    <div className="flex flex-col gap-8">
      <Button
        asChild
        className=" transition hover:shadow-md text-xl cursor-pointer"
      >
        <Link href="/my-questions">My Questions</Link>
      </Button>
      <Button asChild className="hover:shadow-md text-xl ">
        <Link href="/my-sets">My Question Sets</Link>
      </Button>
      <Button asChild className="hover:shadow-md text-xl">
        <Link href="/my-answers">Answer History</Link>
      </Button>
    </div>
  );
};
