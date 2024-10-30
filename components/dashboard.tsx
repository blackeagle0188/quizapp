import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-[80%] sm:w-[30%] mx-auto">
      <Button className="w-full">
        <Link href="/my-questions"> My Questions</Link>
      </Button>
      <Button className="w-full">
        <Link href="/my-sets"> My Question Sets</Link>
      </Button>
      <Button className="w-full">
        <Link href="/my-answers"> Answer History</Link>
      </Button>
    </div>
  );
};
