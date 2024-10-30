import { cn } from "@/lib/utils";
import React from "react";

export const GradientCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full rounded-lg bg-card border shadow-md py-4 px-6 flex flex-col gap-4 min-h-[300px] max-h-[500px] overflow-auto no-scrollbar",
        className
      )}
    >
      {children}
    </div>
  );
};
