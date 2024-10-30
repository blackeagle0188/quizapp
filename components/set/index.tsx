"use client";

import { ISet } from "@/utils/type";
import { useRouter } from "next/navigation";

export const Set = ({ set }: { set: ISet }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/questions?setId=${set.id}`);
  };
  return (
    <div
      className="flex items-center gap-4 cursor-pointer text-sm sm:text-[1rem]"
      onClick={handleClick}
    >
      <div className="border-[2px] shadow-md bg-gradient border-white text-[#3469B6] py-2 px-2 sm:px-4 rounded-md flex-1">
        {set.setName}
      </div>
      <div className="border-[2px] shadow-md bg-card border-white text-[#3469B6] py-2 px-4 rounded-md flex-1">
        {set.description}
      </div>
    </div>
  );
};
