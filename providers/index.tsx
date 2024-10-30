"use client";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QuestionContextProvider from "@/contexts/question-context";
import CommentContextProvider from "@/contexts/comment-context";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CommentContextProvider>
        <QuestionContextProvider>{children}</QuestionContextProvider>
      </CommentContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
