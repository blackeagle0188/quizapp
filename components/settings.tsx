"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect, useTransition } from "react";
import { FaPencil, FaCheck } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { ProfileShema } from "@/schemas";
import { updateProfile } from "@/actions/account";
import { toast } from "sonner";
import { Session } from "next-auth";

export const Setting = ({ session }: { session: Session | null }) => {
  // console.log("Setting", session?.user);
  const { update } = useSession();
  const data = session?.user;
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, [router]);

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    data?.image || null
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUsernameEdit = () => {
    setIsEditingUsername(!isEditingUsername);
  };

  const handleEmailEdit = () => {
    setIsEditingEmail(!isEditingEmail);
  };

  const handleBioEdit = () => {
    setIsEditingBio(!isEditingBio);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileShema>>({
    resolver: zodResolver(ProfileShema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      image: data?.image || "",
      bio: data?.bio || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileShema>) {
    setIsEditingBio(false);
    setIsEditingEmail(false);
    setIsEditingUsername(false);

    if (image) {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(image);
      });
      values.image = imageData;
    }

    // console.log(values);

    startTransition(() => {
      updateProfile(values)
        .then((result) => {
          if (result.error) {
            form.reset();
            return toast.error(result.error);
          }
          if (result.success) {
            update().then(() => {
              return toast.success(result.message);
            });
          }
        })
        .catch(() => {
          toast.error("An error occurred while updating your profile");
          form.reset();
        });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-[90%] mx-auto"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem
              className="p-2 sm:p-4 rounded-full border bg-card aspect-square shadow-md w-fit"
              onClick={handleImageClick}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile"
                  height={70}
                  width={70}
                  className="w-[50px] h-[50px] sm:h-[70px] sm:w-[70px] rounded-full"
                />
              ) : (
                <Image
                  src={data?.image || "/profile.svg"}
                  alt="Profile"
                  height={70}
                  width={70}
                  className="aspect-square h-[50px] w-[50px] sm:h-[70px] sm:w-[70px] cursor-pointer rounded-full"
                />
              )}
              <FormControl className="hidden">
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sm:text-xl">Change Username</FormLabel>
              <FormControl>
                <div className="flex items-center w-full gap-2">
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="text-white"
                    disabled={!isEditingUsername || isPending}
                  />
                  <div
                    className="bg-card p-2 rounded-md cursor-pointer"
                    onClick={handleUsernameEdit}
                  >
                    {isEditingUsername ? (
                      <FaCheck className="text-white" />
                    ) : (
                      <FaPencil className="text-white" />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sm:text-xl">Change Email</FormLabel>
              <FormControl>
                <div className="flex items-center w-full gap-2">
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="text-white"
                    disabled={!isEditingEmail || isPending}
                  />
                  <div
                    className="bg-card p-2 rounded-md cursor-pointer"
                    onClick={handleEmailEdit}
                  >
                    {isEditingEmail ? (
                      <FaCheck className="text-white" />
                    ) : (
                      <FaPencil className="text-white" />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sm:text-xl">Change Bio</FormLabel>
              <FormControl>
                <div className="flex items-baseline w-full gap-2">
                  <Textarea
                    className="bg-card resize-none text-white"
                    rows={6}
                    disabled={!isEditingBio || isPending}
                    {...field}
                  ></Textarea>
                  <div
                    className="bg-card p-2 rounded-md cursor-pointer translate-y-2"
                    onClick={handleBioEdit}
                  >
                    {isEditingBio ? (
                      <FaCheck className="text-white" />
                    ) : (
                      <FaPencil className="text-white" />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center items-center gap-6">
          <Button type="submit" className="w-24" disabled={isPending}>
            Submit
          </Button>
          <Dialog>
            <DialogTrigger
              type="button"
              className="bg-[#FF2525] rounded-full py-1 px-4 text-white border-2 shadow-sm"
            >
              Delete Account
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Are you sure you want to
                  permanently delete your account from our servers?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit" variant="destructive">
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </Form>
  );
};
