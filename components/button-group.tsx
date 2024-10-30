"use client";
import { BsFillCaretLeftFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const ButtonGrp = ({
  back,
  next,
  isPending,
}: {
  back: boolean;
  next: string;
  isPending?: boolean;
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  return (
    <div className="flex items-center justify-between">
      <Button type="button">
        {back && <BsFillCaretLeftFill onClick={handleBack} />}
      </Button>
      {next === "Add Set" ? (
        <Button asChild>
          <Link href="/new-set">{next}</Link>
        </Button>
      ) : next === "Add Question" ? (
        <Button asChild>
          <Link href="/new-question">{next}</Link>
        </Button>
      ) : (
        <Button type="submit" disabled={isPending}>
          {next}
        </Button>
      )}
    </div>
  );
};
