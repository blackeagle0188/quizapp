"use client";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const Profile = () => {
  const session = useSession();
  const { data } = session;
  console.log(data?.user);
  return (
    <div className="w-full  flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 ">
        <div className="bg-gradient p-3 border-[3px] border-white rounded-full shadow-md">
          <Image
            src={data?.user.image || "/profile.svg"}
            height={50}
            width={50}
            alt="profile"
            className="aspect-square rounded-full"
          />
        </div>
        <div>
          <p className="text-[#2C66B8] text-[18px]">{data?.user.name}</p>
          <p className="text-[#2C66B8] text-[18px]">{data?.user.email}</p>
        </div>
      </div>
      <div className="flex flex-col items-center bg-gradient shadow-md rounded-md border-2 border-white w-full min-h-20 p-4">
        <h3 className="text-white">Bio</h3>
        <div>{data?.user.bio}</div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button asChild>
          <Link href="/settings">Edit Details</Link>
        </Button>
        <Button
          onClick={async () => await signOut({ callbackUrl: "/auth/login" })}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};
