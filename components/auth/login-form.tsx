"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { update } = useSession();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values)
        .then((data) => {
          console.log(data);
          if (data?.error) {
            form.reset();
            setError(data.error);
          } else {
            update().then((session) => {
              console.log(session);
              router.push(DEFAULT_LOGIN_REDIRECT);
            });
            form.reset();
          }
        })
        .catch(() => {
          setError("Something went wrong, Check your credentials");
        });
    });
  };

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <section className="flex flex-col items-center gap-4">
      <div className="flex-1">
        <h2 className="text-3xl font-semibold">Welcome Back!</h2>
        <p className="text-[#7B7B7B] text-sm">
          Log in now to explore the world of question.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-transparent w-[90%]"
        >
          <div className="space-y-4 bg-transparent">
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="Johndos@gmail.com"
                        type="email"
                        className="rounded-full placeholder:text-white "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="Password"
                        type="password"
                        className="rounded-full placeholder:text-white "
                      />
                    </FormControl>
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal text-[#2C66B8] border-none"
                    >
                      <Link href="/auth/reset"> Forgot password</Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Login
          </Button>

          <div className="flex items-center gap-3 w-full">
            <span className="h-[2px] flex-1 bg-white"></span>
            <span>Or continue with</span>
            <span className="h-[2px] flex-1 bg-white"></span>
          </div>
          <div className="flex justify-center items-center">
            <div
              className="p-2 rounded-full border w-fit border-white shadow-md cursor-pointer"
              onClick={() => onClick("google")}
            >
              <FcGoogle className="h-5 w-5" />
            </div>
          </div>
        </form>
      </Form>
      <Button
        variant="link"
        className="font-normal w-full border-none justify-start "
        size="sm"
        asChild
      >
        <Link href="/auth/register " className="underline ">
          Don&apos;t have an account?
        </Link>
      </Button>
    </section>
  );
};
