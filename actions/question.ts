"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { QuestionSchema } from "@/schemas";
import { IQuestion } from "@/utils/type";
import * as z from "zod";

export async function createQuestion(values: z.infer<typeof QuestionSchema>) {
  const session = await auth();
  const validatedFields = QuestionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { intro, scenerio, options } = validatedFields.data;

  if (!session?.user.id) {
    return { error: "You are not authorized to create a question" };
  }

  const existingQuestion = await db.question.findFirst({
    where: { ownerId: session.user.id, scenerio },
  });

  if (existingQuestion) {
    return { error: "Question already exists" };
  }

  // Check for duplicate options
  const uniqueOptions = new Set(options.map((option) => option));

  if (uniqueOptions.size !== options.length) {
    return { error: "Duplicate options are not allowed" };
  }

  const createdQuestion = await db.question.create({
    data: {
      scenerio,
      intro,
      ownerId: session.user.id!,
      options: {
        create: options.map((option) => ({ text: option })),
      },
    },
  });

  return {
    success: "Question created successfully!",
    question: createdQuestion,
  };
}

export async function getQuestions(setId?: string) {
  // If a setId is provided, fetch questions sequentially
  if (setId) {
    const questions = await db.question.findMany({
      where: { setIds: { has: setId } },

      include: {
        owner: {
          select: { name: true },
        },
        sets: {
          select: { setName: true },
        },
        options: {
          select: {
            text: true,
            vote: true,
            id: true,
          },
        },
      },
    });

    if (!questions || questions.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    return {
      success: true,
      data: questions,
    };
  }

  const questions = await db.question.findMany({
    include: {
      owner: {
        select: { name: true },
      },
      sets: {
        select: { setName: true },
      },
      options: {
        select: {
          text: true,
          vote: true,
          id: true,
        },
      },
    },
  });

  if (!questions || questions.length === 0) {
    return {
      success: true,
      data: [],
    };
  }

  return {
    success: true,
    data: questions,
  };
}

export async function voteQuestion(
  questionId: string,
  voteType: "UP" | "DOWN"
) {
  const session = await auth();
  if (!session?.user.id) {
    return { error: "You are not authorized to vote" };
  }

  const userId = session.user.id;

  // Check if the question exists
  const existingQuestion = await db.question.findUnique({
    where: { id: questionId },
  });
  if (!existingQuestion) {
    return { error: "Question not found" };
  }

  // Check if the user has already voted on this question
  const existingVote = await db.userVote.findUnique({
    where: {
      userId_questionId: {
        userId: userId,
        questionId: questionId,
      },
    },
  });

  if (existingVote) {
    // If the user has already voted, check if the vote type is the same
    if (existingVote.voteType === voteType) {
      return { error: "You have already voted on this question" };
    } else {
      // If the vote type is different, update the vote
      await db.userVote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          voteType: voteType,
        },
      });

      // Update the question's ratings accordingly
      const newRatings =
        voteType === "UP"
          ? existingQuestion.ratings! + 1
          : Math.max(existingQuestion.ratings! - 1, 0);

      await db.question.update({
        where: { id: questionId },
        data: { ratings: newRatings },
      });

      return { success: "Vote updated successfully!" };
    }
  } else {
    // If the user hasn't voted yet, create a new vote
    await db.userVote.create({
      data: {
        userId: userId,
        questionId: questionId,
        voteType: voteType,
      },
    });

    // Update the question's ratings
    const newRatings =
      voteType === "UP"
        ? existingQuestion.ratings! + 1
        : Math.max(existingQuestion.ratings! - 1, 0);

    await db.question.update({
      where: { id: questionId },
      data: { ratings: newRatings },
    });

    return { success: "Vote submitted successfully!" };
  }
}

export async function getQuestionById(questionId: string) {
  const question = await db.question.findUnique({
    where: { id: questionId },
    include: {
      owner: {
        select: { name: true },
      },
      sets: {
        select: { setName: true },
      },
      options: {
        select: {
          text: true,
          vote: true,
          id: true,
        },
      },
    },
  });
  if (!question) {
    return { error: "Question not found" };
  }
  return { success: true, question };
}

export async function getMyQuestions() {
  const session = await auth();
  if (!session?.user.id) {
    return { error: "You are not authorized to fetch your questions" };
  }

  const questions = await db.question.findMany({
    where: { ownerId: session.user.id },
    include: {
      owner: {
        select: { name: true },
      },
      sets: {
        select: { setName: true },
      },
    },
  });

  if (!questions || questions.length === 0) {
    return {
      success: true,
      data: [],
    };
  }
  return {
    success: true,
    data: questions,
  };
}
