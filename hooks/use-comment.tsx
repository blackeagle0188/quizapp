import { CommentContext } from "@/contexts/comment-context";
import { useContext } from "react";

export const useComment = () => {
  const { isCommentOpen, toggleComment } = useContext(CommentContext);

  return { isCommentOpen, toggleComment };
};
