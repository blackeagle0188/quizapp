"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "./card-wrapper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { reset } from "@/actions/reset";
import Image from "next/image";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (value: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    console.log(value);
    startTransition(() => {
      reset(value).then((data) => {
        setError(data?.error);

        // ADD: Add when we add 2FA
        setSuccess(data?.success);
      });
    });
  };
  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center flex-col">
        <Image src="/head.svg" alt="moscow head" height={60} width={60} />
        <h2 className="text-2xl font-semibold">Mail Address Here</h2>
        <p className="text-[#7B7B7B]">
          Enter the Email Address here to reset your Password.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full flex flex-col "
        >
          <div className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#2C66B8] text-center font-semibold text-[20px]">
                    Email:
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="johndoe@gmail.com"
                      type="email"
                      className="w-full rounded-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="p-4">
            Send reset email
          </Button>
        </form>
      </Form>
    </section>
  );
};
