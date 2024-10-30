"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function createComment(data: {
  comment: string;
  questionId: string;
}) {
  const session = await auth();
  if (!session?.user) {
    return { error: "You are not authorized to create a comment" };
  }
  const userId = session.user.id;

  const questionExist = await db.question.findUnique({
    where: { id: data.questionId },
  });

  if (!questionExist) {
    return { error: "Question not found" };
  }

  await db.comment.create({
    data: {
      comment: data.comment,
      author: userId!,
      questionId: data.questionId,
    },
  });
  return { success: "Comment created successfully" };
}

export async function getComments(page: number, questionId: string) {
  const limit = 6;
  const offset = (page - 1) * limit;

  const comments = await db.comment.findMany({
    where: { questionId },
    skip: offset,
    take: limit,
    include: {
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
  if (!comments) {
    return {
      success: "success",
      data: [],
    };
  }
  return {
    success: "success",
    data: comments,
  };
}
