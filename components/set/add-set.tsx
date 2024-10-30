"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Input } from "@/components/ui/input";
import { ButtonGrp } from "@/components/button-group";
import { Textarea } from "@/components/ui/textarea";
import { SetSchema } from "@/schemas";
import { useTransition } from "react";
import { createSet } from "@/actions/set";
import { toast } from "sonner";

export function AddSet() {
  const [isPending, startTransition] = useTransition();
  // 1. Define your form.
  const form = useForm<z.infer<typeof SetSchema>>({
    resolver: zodResolver(SetSchema),
    defaultValues: {
      setName: "",
      description: "",
      visibility: "public",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(data: z.infer<typeof SetSchema>) {
    console.log(data);
    startTransition(() => {
      createSet(data)
        .then((data) => {
          if (data?.error) {
            form.reset();
            toast.error(data.error);
          }
          if (data?.success) {
            form.reset();
            toast.success(data.success);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-[90%] mx-auto sm:w-[40%]"
      >
        <div className="flex items-end gap-4 w-full">
          <FormField
            control={form.control}
            name="setName"
            render={({ field }) => (
              <FormItem className="w-[85%]">
                <FormLabel>Set name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="set name"
                    {...field}
                    className="rounded-full  px-6 py-3 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="public" />
                      </FormControl>
                      <FormLabel className="font-normal">Public</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="private" />
                      </FormControl>
                      <FormLabel className="font-normal">Private</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isPending}
                  rows={6}
                  placeholder="Write the description of your set"
                  className="resize-none bg-card border border-white shadow-md  w-[85%]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-[85%]">
          <ButtonGrp back next="Create" isPending={isPending} />
        </div>
      </form>
    </Form>
  );
}
