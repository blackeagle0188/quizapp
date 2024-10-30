"use server";
import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFIelds = RegisterSchema.safeParse(values);
  if (!validatedFIelds.success) {
    return { error: "Invalid fields" };
  }

  const {
    email,
    username,
    password,
    confirmPassword,
    firstName,
    lastName,
    dateOfBirth,
  } = validatedFIelds.data;

  if (confirmPassword !== password) {
    return {
      error: "Password does not match",
    };
  }
  const hashedPw = await bcryptjs.hash(password, 12);
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      error: "Email already in use",
    };
  }
  await db.user.create({
    data: {
      userName: username,
      name: `${firstName} ${lastName}`,
      dateOfBirth,
      email,
      password: hashedPw,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return { success: "Confirmation email sent!" };
};
