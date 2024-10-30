import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, { message: "Username is requried" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: "Email is requried" }),
    username: z.string().min(1, { message: "Username is required" }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    dateOfBirth: z.date({
      required_error: "A date of birth is required.",
    }),

    image: z.string().optional(),
    rememberMe: z.boolean().default(false),
    privacy: z.boolean().default(false),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is requried" }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimun of 6 characters required" }),
});

export const QuestionSchema = z.object({
  scenerio: z.string().nonempty("Scenerio is required"),
  intro: z.string().nonempty("Intro is required"),
  option: z.string().optional(),
  options: z
    .array(z.string().nonempty("Option cannot be empty"))
    .min(2, { message: "At least two options must be specified" }),
});

export const SetSchema = z.object({
  setName: z.string().min(2, { message: "Set name is required" }),
  description: z.string().min(2, { message: "Description is required" }),
  visibility: z.string(),
});

export const ProfileShema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  image: z.string().optional(),
  bio: z.string().optional(),
});
