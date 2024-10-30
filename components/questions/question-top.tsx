"use client";
import { FaCaretRight } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  RedditShareButton,
} from "react-share";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { IQuestion } from "@/utils/type";

export const QuestionTop = ({
  set,
  question,
}: {
  set: string;
  question: IQuestion;
}) => {
  // Replace with your actual question URL

  return (
    <div className="flex items-center justify-between w-full">
      <div className="bg-card hidden min-h-8 rounded-full border sm:flex items-center gap-2 px-4 sm:w-[250px] text-white">
        <span>Set:</span>
        <p className="text-white">{set}</p>
      </div>

      <Popover>
        <PopoverTrigger className="flex items-center bg-card min-h-8 border rounded-full text-white px-3">
          Share Question <FaCaretRight />
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          className="bg-card  max-w-[210px] px-0"
        >
          <SocialButton question={question} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

function SocialButton({ question }: { question: IQuestion }) {
  const [copied, setCopied] = useState(false);
  const questionUrl =
    "http://localhost:3000" + "/questions?quid=" + question.id;
  console.log(process.env.NEXTAUTH_SALT);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(questionUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 py-2 flex flex-col gap-4 items-center ">
      <p className=" sm:text-xl uppercase text-white">Share Question</p>
      <div className="flex items-center gap-2">
        <FacebookShareButton url={questionUrl} hashtag={question.intro}>
          <Image
            src="/facebook.svg"
            height={30}
            width={30}
            alt="social facebook button"
          />
        </FacebookShareButton>
        <TwitterShareButton
          url={questionUrl}
          title={question.scenerio}
          hashtags={["#wouldYouRather"]}
        >
          <Image src="/x.svg" height={30} width={30} alt="social x button" />
        </TwitterShareButton>
        <WhatsappShareButton url={questionUrl} title={question.scenerio}>
          <Image
            src="/whatsapp.svg"
            height={25}
            width={25}
            alt="social whatsapp button"
            className="transform -translate-y-2"
          />
        </WhatsappShareButton>
        <RedditShareButton url={questionUrl} title={question.scenerio}>
          <Image
            src="/reddit.svg"
            height={30}
            width={30}
            alt="social reddit button"
          />
        </RedditShareButton>
      </div>
      <div className="space-y-3 w-full">
        <Input
          disabled
          className="w-full bg-gray-200 py-1 flex items-center justify-center overflow-x-auto no-scrollbar rounded-md"
          value={questionUrl}
        />

        <Button
          onClick={handleCopyLink}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
        >
          {copied ? "Link Copied!" : "Copy Link"}
        </Button>
      </div>
    </div>
  );
}
