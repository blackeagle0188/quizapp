"use client";
import { IComment, IOption, IQuestion } from "@/utils/type";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { QuestionTop } from "./question-top";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GradientCard } from "../gradient-card";
import { useRouter, useSearchParams } from "next/navigation";
import { getQuestionById, voteQuestion } from "@/actions/question";
import { toast } from "sonner";
import { getVote } from "@/actions/vote";
import { voteOption } from "@/actions/voteOption";
import { useComment } from "@/hooks/use-comment";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createComment, getComments } from "@/actions/comment";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

export const QuestionCard = ({
  question: initialQuestion,
  isPercentage = false,
}: {
  question: IQuestion;
  isPercentage?: boolean;
}) => {
  const params = useSearchParams();
  const quid = params.get("quid");

  const [question, setQuestion] = useState<IQuestion | null>(initialQuestion);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedThumb, setSelectedThumb] = useState<"up" | "down" | null>(
    null
  );

  const { isCommentOpen, toggleComment } = useComment();

  useEffect(() => {
    setQuestion(null);
    const fetchQuestion = async () => {
      if (quid) {
        const fetchedQuestion = await getQuestionById(quid);
        if (fetchedQuestion.success) {
          setQuestion(fetchedQuestion.question);
        }
      } else {
        setQuestion(initialQuestion);
      }
    };
    fetchQuestion();
  }, [quid, initialQuestion]);

  useEffect(() => {
    const getCurrentVote = async () => {
      if (question) {
        const response = await getVote(question.id);
        if (response.success) {
          setSelectedThumb(
            response.voteType === "UP"
              ? "up"
              : response.voteType === "DOWN"
              ? "down"
              : null
          );
        }
      }
    };

    getCurrentVote();
  }, [question]);

  const totalVotes = question?.options.reduce((total, option) => {
    return total + (option.vote || 0);
  }, 0);

  const voteQuestionUp = async () => {
    if (question) {
      setSelectedThumb(selectedThumb === "up" ? null : "up");
      const result = await voteQuestion(question.id, "UP");
      if (result.error) {
        return toast.error(result.error);
      }
      return toast.success(result.success);
    }
  };

  const voteQuestionDown = async () => {
    if (question) {
      setSelectedThumb(selectedThumb === "down" ? null : "down");
      const result = await voteQuestion(question.id, "DOWN");
      if (result.error) {
        return toast.error(result.error);
      }
      return toast.success(result.success);
    }
  };

  if (!question) {
    return <p className="text-center text-blue-600">Fetching question...</p>;
  }
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row-reverse items-center justify-between sm:flex-col sm:items-baseline gap-4">
        <div className="flex items-center sm:self-end text-white space-x-2">
          <Label htmlFor="comment-mode">Comments</Label>
          <Switch
            id="comment-mode"
            onCheckedChange={toggleComment}
            checked={isCommentOpen}
          />
        </div>
        <QuestionTop
          set={question?.sets.map((set) => set.setName).join(",")}
          question={question}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-10 sm:gap-4">
        <GradientCard>
          <div className="flex flex-col gap-4 sm:w-[80%] mx-auto text-sm sm:text-[1rem] w-full">
            <div className="flex flex-col-reverse items-end sm:flex-row sm:items-baseline gap-4">
              <div className="flex w-full items-center gap-2">
                <p className="w-[80px]">Scenerio</p>
                <div className="rounded-md sm:rounded-full w-full bg-slate-200 px-4 py-2 text-[#363636] opacity-70">
                  {question?.scenerio}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ThumbsUp
                  className={`cursor-pointer ${
                    selectedThumb === "up" ? "text-white" : "text-gray-400"
                  }`}
                  onClick={async () => await voteQuestionUp()}
                />
                <ThumbsDown
                  className={`cursor-pointer ${
                    selectedThumb === "down" ? "text-white" : "text-gray-400"
                  }`}
                  onClick={async () => await voteQuestionDown()}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="w-[80px]">Intro</p>
              <div className="rounded-full w-[95%] sm:w-fit bg-slate-200 px-4 py-2 text-[#363636] opacity-70">
                {question?.intro}
              </div>
            </div>
            <div className="flex gap-4 flex-col-reverse sm:flex-row sm:items-center sm:justify-between">
              <p>Options</p>
              <div className="flex items-center gap-2">
                <p>Author:</p>
                <span className="text-[#346AB6]">{question?.owner.name}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {question?.options.map((option) => (
              <Option
                isPercentage={isPercentage}
                option={option}
                questionId={question.id}
                key={option.id}
                isSelected={selectedOption === option.id}
                onSelect={() => setSelectedOption(option.id)}
                totalVotes={totalVotes || 0}
              />
            ))}
          </div>
        </GradientCard>
        {isCommentOpen && <Comment questionId={question.id} />}
      </div>
    </div>
  );
};

function Option({
  isPercentage,
  option,
  questionId,
  isSelected,
  onSelect,
  totalVotes,
}: {
  isPercentage: boolean;
  option: IOption;
  isSelected: boolean;
  totalVotes: number;
  questionId: string;
  onSelect: () => void;
}) {
  const router = useRouter();
  const clickHandler = async () => {
    onSelect();
    const result = await voteOption(option.id);
    if (result.error) {
      return toast.error(result.error);
    }
    if (result.success) {
      router.push("/percentage?qId=" + questionId);
    }
  };

  if (isPercentage) {
    return <PercentageComponent option={option} totalVotes={totalVotes} />;
  }

  return (
    <div
      className={`bg-slate-200 border py-3 px-6 rounded-lg opacity-80 cursor-pointer hover:ring-2 hover:ring-blue-500 ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={clickHandler}
    >
      {option.text}
    </div>
  );
}

const PercentageComponent = ({
  option,
  totalVotes,
}: {
  option: IOption;
  totalVotes: number;
}) => {
  let percentage;
  if (totalVotes === 0) {
    percentage = 0;
  } else {
    percentage = Math.floor((option.vote! / totalVotes) * 100);
  }

  return (
    <div className="flex-1 min-h-10 bg-slate-300 rounded-md flex items-center relative  ">
      <div className="w-[75%] h-full ">
        <div
          className={`h-full absolute  ${
            percentage ? " border border-blue-500 bg-blue-500/40" : ""
          } rounded-md flex items-center  text-black overflow-visible `}
          style={{ width: `${percentage}%` }}
        ></div>
        <p className="text-wrap p-4 opacity-100">{option.text}</p>
      </div>

      <p className="absolute right-2 sm:right-8  text-white ">{percentage}%</p>
    </div>
  );
};

function Comment({ questionId }: { questionId: string }) {
  const [showCommentBox, setShowCommentBox] = useState(false);

  const pageNumber = 6;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["comments"],
    queryFn: ({ pageParam = 1 }) => getComments(pageParam, questionId),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < pageNumber) return undefined;
      return allPages.length + 1;
    },
  });

  const comments: IComment[] | null =
    data?.pages.flatMap((page) => page.data) || null;

  const observerElem = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerElem.current) {
      observer.observe(observerElem.current);
    }

    return () => {
      if (observerElem.current) {
        observer.unobserve(observerElem.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  const openCommentBox = () => {
    setShowCommentBox(true);
  };

  const closeCommentBox = () => {
    setShowCommentBox(false);
  };
  return (
    <div
      className={`flex flex-col p-4 bg-card gap-4 sm:w-[50%] rounded-md overflow-y-auto no-scrollbar min-h-[300px] max-h-[500px] `}
    >
      {status === "pending" &&
        Array.from({ length: pageNumber }).map((_, index) => (
          <Skeleton key={index} className="w-full h-10" />
        ))}
      {showCommentBox && (
        <CommentBox
          onClose={closeCommentBox}
          questionId={questionId}
          refetch={refetch}
        />
      )}
      {!showCommentBox && (
        <div>
          <Button onClick={openCommentBox}>Add Comment</Button>
        </div>
      )}
      {!comments ? (
        <p className="text-center">No Comments Found!</p>
      ) : (
        comments.map((comment) => (
          <div className="bg-gradient px-4 py-2 rounded-md" key={comment.id}>
            <div className="flex items-baseline justify-between ">
              <p className=" text-blue-700 w-[65%] sm:w-[60%]">
                {comment.comment}
              </p>
              <p className="text-sm text-[#363636]">
                {comment.createdAt
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")}
              </p>
            </div>
            <div className="flex-1 border-t border-gray-200 px-4 py-2">
              <p className="text-sm">{comment.user.name}</p>
            </div>
          </div>
        ))
      )}
      {isFetchingNextPage &&
        Array.from({ length: pageNumber }).map((_, index) => (
          <Skeleton key={index} className="w-full h-10" />
        ))}
      <div ref={observerElem} className="w-full h-5"></div>
    </div>
  );
}

const FormSchema = z.object({
  comment: z.string(),
});

export function CommentBox({
  refetch,
  onClose,
  questionId,
}: {
  onClose: () => void;
  questionId: string;
  refetch: () => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { comment: "" },
  });
  const { toggleComment } = useComment();
  const [isPending, startTransition] = useTransition();

  function onSubmit(values: z.infer<typeof FormSchema>) {
    startTransition(() => {
      createComment({
        comment: values.comment,
        questionId,
      })
        .then((data) => {
          if (data?.error) {
            form.reset();
            toast.error(data.error);
          }
          if (data?.success) {
            form.reset();
            toast.success(data.success);
          }
        })
        .catch(() => {
          toast.error("An error occurred while submitting your comment");
          form.reset();
        })
        .finally(() => {
          onClose();
          // toggleComment();
          refetch();
        });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">New Comment</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isPending}
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
