"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { Minus, PlusIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { createQuestion } from "@/actions/question";

// Updated Zod schema
export const QuestionSchema = z.object({
  scenerio: z.string().nonempty("Scenerio is required"),
  intro: z.string().nonempty("Intro is required"),
  option: z.string().optional(),
  options: z
    .array(z.string().nonempty("Option cannot be empty"))
    .min(2, { message: "At least two options must be specified" }),
});

type FormData = z.infer<typeof QuestionSchema>;

export const NewQuestionForm: React.FC = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const [options, setOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(undefined), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(undefined), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const addOption = (option: string) => {
    setOptions([...options, option]);
    form.setValue("options", [...options, option]);
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    form.setValue("options", updatedOptions);
  };

  const form = useForm<FormData>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      scenerio: "",
      intro: "",
      option: "",
      options: [""],
    },
  });

  const onSubmit = (data: FormData) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      createQuestion(data)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setOptions([]);
            setError(data.error);
          }
          if (data?.success) {
            form.reset();
            setOptions([]);
            setSuccess(data.success);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto p-4 bg-transparent space-y-4 w-[90%]"
      >
        <FormField
          control={form.control}
          name="scenerio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">Scenerio</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isPending}
                  {...field}
                  className="w-full px-3 py-2 border rounded-lg bg-card resize-none shadow-md"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intro"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">Intro</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </FormControl>
              {form.formState.errors.intro && (
                <FormMessage>{form.formState.errors.intro.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="option"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">Options</FormLabel>
              <div className="flex flex-col w-full gap-2">
                {options.map((option: string, i) => (
                  <div className="flex items-center gap-2 " key={i.toString()}>
                    <Input
                      disabled={isPending}
                      className="w-full px-3 py-2 border rounded-lg"
                      value={option}
                      onChange={(e) => {}}
                    />
                    <div
                      className="bg-card flex justify-center items-center p-2 rounded-md cursor-pointer"
                      onClick={() => {
                        removeOption(i);
                      }}
                    >
                      <Minus className="text-white" size={20} />
                    </div>
                  </div>
                ))}
              </div>

              <FormControl>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    disabled={isPending}
                    {...field}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <div
                    className="bg-card flex justify-center items-center p-2 rounded-md cursor-pointer"
                    onClick={() => {
                      const currentOption = field.value;
                      addOption(currentOption!);
                      form.resetField("option");
                    }}
                  >
                    <PlusIcon className="text-white" size={20} />
                  </div>
                </div>
              </FormControl>
              {form.formState.errors.options && (
                <FormMessage>
                  {form.formState.errors.options.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button disabled={isPending} type="submit" className="w-full mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
};
