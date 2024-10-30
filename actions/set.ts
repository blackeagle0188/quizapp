"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SetSchema } from "@/schemas";
import * as z from "zod";
export async function createSet(values: z.infer<typeof SetSchema>) {
  const session = await auth();
  const validatedFields = SetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { setName, description, visibility } = validatedFields.data;
  if (!session?.user.id) {
    return { error: "You are not authorized to create a set" };
  }

  const existingSet = await db.set.findFirst({
    where: { ownerId: session.user.id, setName: setName },
  });
  if (existingSet) {
    return { error: "Set already exists" };
  }
  await db.set.create({
    data: {
      setName,
      description,
      ownerId: session.user.id,
      visibility,
    },
  });

  return { success: "Set created successfully!" };
}

export async function getSets() {
  const session = await auth();
  if (!session?.user.id) {
    return { error: "You are not authorized to get set" };
  }
  const sets = await db.set.findMany({
    where: { ownerId: session.user.id },
  });
  return {
    success: "success",
    data: sets,
  };
}
export async function getPublicSets(page: number) {
  const limit = 6;
  const offset = (page - 1) * limit;
  const sets = await db.set.findMany({
    where: { visibility: "public" },
    skip: offset,
    take: limit,
  });
  if (!sets) {
    return {
      success: "success",
      data: [],
    };
  }
  return {
    success: "success",
    data: sets,
  };
}

export async function addQuestionToSets(questionId: string, setIds: string[]) {
  const session = await auth();
  if (!session?.user.id) {
    return { error: "You are not authorized to add questions to sets" };
  }

  const questionExists = await db.question.findFirst({
    where: {
      id: questionId,
    },
  });
  if (!questionExists) {
    return { error: "Question not found" };
  }

  await db.question.update({
    where: { id: questionId },
    data: { setIds: setIds },
  });

  return { success: "Question added to sets successfully!" };
}
