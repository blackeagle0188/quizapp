"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getVote(questionId: string) {
  const session = await auth();
  const existingVote = await db.userVote.findFirst({
    where: {
      userId: session?.user.id,
      questionId,
    },
  });
  if (existingVote) {
    return {
      success: "success",
      voteType: existingVote.voteType,
    };
  }

  return {
    success: "success",
    voteType: null,
  };
}
