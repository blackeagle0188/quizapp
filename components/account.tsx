import React from "react";
import { Button } from "./ui/button";
import { GradientCard } from "./gradient-card";
import Link from "next/link";
import Image from "next/image";

export const Account = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button>Account Menu</Button>
      <GradientCard className=" items-center gap-6">
        <Image src="/head.svg" alt="" height={80} width={80} />
        <Button asChild className="w-60">
          <Link href="/profile">Profile</Link>
        </Button>
        <Button asChild className="w-60">
          <Link href="/settings">User Settings</Link>
        </Button>
      </GradientCard>
    </div>
  );
};
