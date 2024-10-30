"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function voteOption(optionId: string) {
  const session = await auth();
  if (!session?.user.id) {
    return { error: "You are not authorized to vote" };
  }

  const userId = session.user.id;

  // Find the option and the associated question
  const option = await db.option.findUnique({
    where: { id: optionId },
    include: { question: true },
  });
  if (!option) {
    return { error: "Option not found" };
  }

  const questionId = option.question.id;

  // Check if the user has already voted on this question
  const existingVote = await db.userOptionVote.findUnique({
    where: {
      userId_questionId: {
        userId: userId,
        questionId: questionId,
      },
    },
  });

  if (existingVote) {
    if (existingVote.optionId === optionId) {
      return { error: "You have already voted for this option" };
    } else {
      // If the user changes their vote to a different option
      await db.$transaction([
        db.option.update({
          where: { id: existingVote.optionId },
          data: { vote: { decrement: 1 } },
        }),
        db.option.update({
          where: { id: optionId },
          data: { vote: { increment: 1 } },
        }),
        db.userOptionVote.update({
          where: { id: existingVote.id },
          data: { optionId: optionId },
        }),
      ]);

      return { success: "Vote updated successfully!" };
    }
  } else {
    // If the user hasn't voted yet, create a new vote
    await db.$transaction([
      db.option.update({
        where: { id: optionId },
        data: { vote: { increment: 1 } },
      }),
      db.userOptionVote.create({
        data: {
          userId: userId,
          questionId: questionId,
          optionId: optionId,
        },
      }),
    ]);

    return { success: "Vote submitted successfully!" };
  }
}
