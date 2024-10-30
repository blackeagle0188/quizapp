"use client";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export const GetStarted = ({ selectedSet }: { selectedSet: string | null }) => {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <Image
        src="/home.svg"
        alt="mascot"
        width={400}
        height={400}
        className="h-[300px] w-[300px] md:h-[400px] md:w-[400px]"
      />
      <Button className="w-28" asChild>
        <Link
          href={`${
            selectedSet ? "/questions?setId=" + selectedSet : "/questions"
          }`}
          className="uppercase sm:text-[18px]"
        >
          Start
        </Link>
      </Button>
    </div>
  );
};
