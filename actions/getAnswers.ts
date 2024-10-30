"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getAnswers(page: number) {
  const limit = 6;
  const offset = (page - 1) * limit;
  const session = await auth();

  if (!session?.user) {
    return { error: "Authentication failed!", data: [] };
  }

  const answers = await db.userOptionVote.findMany({
    where: {
      userId: session.user.id,
    },
    skip: offset,
    take: limit,
    include: {
      question: {
        select: {
          scenerio: true,
          id: true,
          intro: true,
          //   sets: true,
        },
      },
    },
  });

  if (!answers) {
    return {
      status: "success",
      data: [],
    };
  }

  return {
    status: "success",
    data: answers,
  };
}
