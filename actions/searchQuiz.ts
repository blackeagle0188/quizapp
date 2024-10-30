"use server";

import { db } from "@/lib/db";

export const searchQuiz = async (query: string) => {
  console.log(query);
  const isId = /^[0-9a-fA-F]{24}$/.test(query);

  let questions;
  if (isId) {
    // Find question by ID
    const question = await db.question.findUnique({
      where: { id: query },
      include: {
        sets: {
          select: {
            setName: true,
            id: true,
          },
        },
      },
    });
    questions = question ? [question] : [];
  } else {
    // Find questions that contain the query string in their scenario
    questions = await db.question.findMany({
      where: {
        scenerio: {
          contains: query,
          mode: "insensitive", // Case-insensitive search
        },
      },
      include: {
        sets: {
          select: {
            setName: true,
            id: true,
          },
        },
      },
    });
  }

  return questions;
};
