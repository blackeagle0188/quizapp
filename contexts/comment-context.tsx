import React, { createContext, useState } from "react";

export const CommentContext = createContext({
  toggleComment: () => {},
  isCommentOpen: false,
});

const CommentContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const values = {
    isCommentOpen: open,
    toggleComment: () => {
      if (open) {
        localStorage.removeItem("comment_open");
        setOpen(false);
      } else {
        localStorage.setItem("comment_open", "true");
        setOpen(true);
      }
    },
  };
  return (
    <CommentContext.Provider value={values}>{children}</CommentContext.Provider>
  );
};

export default CommentContextProvider;
