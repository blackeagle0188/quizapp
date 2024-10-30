"use client";

import Link from "next/link";
import React, { useState, Dispatch, SetStateAction } from "react";
import { ChevronDown, MenuIcon, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

const Navbar = ({ session }: { session: Session | null }) => {
  return (
    <section>
      <div className="sm:hidden">
        <MobileMenu data={session} />
      </div>
      <div className="hidden sm:block">
        <DeskTopMewnu data={session} />
      </div>
    </section>
  );
};

export default Navbar;

function DeskTopMewnu({ data }: { data: Session | null }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="relative w-full flex items-center justify-between ">
      <div className=" px-6">
        <Image
          src="/desktop.svg"
          alt="desktop"
          height={300}
          width={300}
          className=" absolute top-0 left-0 -z-10"
        />
        <Link href="/">
          <Image
            src={"/logo.svg"}
            alt="decidingTime"
            height={130}
            width={130}
            className="h-[100px] w-[130px] translate-x-8"
          />
        </Link>
      </div>

      <section className="flex items-center gap-8 w-[90%] mx-auto justify-end pr-8">
        <div className=" flex items-center gap-4">
          <Link
            href="/search"
            className=" font-semibold text-[18px] text-white"
          >
            Search
          </Link>
          <Link href="/info" className="font-semibold text-[18px] text-white">
            Info
          </Link>
          <Button className="" asChild>
            <Link href="/generate">Generate Question</Link>
          </Button>
        </div>

        {data?.user ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={data?.user.image || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger className="outline-none border-none">
                <ChevronDown className="text-white transition hover:rotate-180 " />
              </DropdownMenuTrigger>
              <Menu onClose={setOpen} />
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="text-white">
              Sign In
            </Link>
          </div>
        )}
      </section>
    </nav>
  );
}

function MobileMenu({ data }: { data: Session | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <nav className=" w-full  relative">
      <div className="flex items-center justify-between mx-auto w-[90%]">
        <div>
          <Sheet modal={false} open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <MenuIcon className="text-white cursor-pointer" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="h-fit bg-gradient rounded-md w-[50%] backdrop:blur-xl   "
            >
              <div className="flex flex-col gap-6 items-center  mt-6">
                <div
                  className="flex flex-col items-center justify-center"
                  onClick={() => {
                    router.push("/search");
                    setOpen(false);
                  }}
                >
                  <Image
                    src={"/search.svg"}
                    height={20}
                    width={20}
                    className=" h-12 w-12"
                    alt="search icon"
                  />
                  <p className="text-sm text-gray-500">Search</p>
                </div>
                <div
                  className="flex flex-col items-center justify-center"
                  onClick={() => {
                    router.push("/info");
                    setOpen(false);
                  }}
                >
                  <Image
                    src={"/info.svg"}
                    height={20}
                    width={20}
                    className=" h-12 w-12"
                    alt="search icon"
                  />
                  <p className="text-sm text-gray-500">Info</p>
                </div>
                <div
                  className="flex flex-col items-center justify-center"
                  onClick={() => {
                    router.push("/generate");
                    setOpen(false);
                  }}
                >
                  <Image
                    src={"/question.svg"}
                    height={20}
                    width={20}
                    className=" h-12 w-12"
                    alt="search icon"
                  />
                  <p className="text-sm text-gray-500"> Generate Question</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div>
          <Link href="/">
            <Image
              src={"/logo.svg"}
              alt="decidingTime"
              height={90}
              width={130}
              className="h-[70px] w-[100px]"
            />
          </Link>
        </div>

        {data?.user ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={data?.user.image || "https://github.com/shadcn.png"}
                className="h-10 w-10"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <DropdownMenu open={openPopup} onOpenChange={setOpenPopup}>
              <DropdownMenuTrigger className="outline-none border-none">
                <ChevronDown className="text-white transition hover:rotate-180 " />
              </DropdownMenuTrigger>
              <Menu onClose={setOpenPopup} />
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="text-white">
              Sign In
            </Link>
          </div>
        )}
      </div>
      <Image
        src="/mobile.svg"
        alt="mobile"
        height={200}
        width={300}
        className="absolute w-full top-0 -z-10"
      />
    </nav>
  );
}

function Menu({ onClose }: { onClose: Dispatch<SetStateAction<boolean>> }) {
  return (
    <DropdownMenuContent className="bg-gradient text-white">
      <DropdownMenuItem>
        <Link href="/profile" onClick={() => onClose(false)}>
          Profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="/dashboard" onClick={() => onClose(false)}>
          Questions
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={async () => await signOut({ callbackUrl: "/auth/login" })}
        className="text-red-600"
      >
        Log Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
