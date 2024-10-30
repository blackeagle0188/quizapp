"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProfileShema } from "@/schemas";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateProfile(values: z.infer<typeof ProfileShema>) {
  const session = await auth();
  if (!session?.user) {
    return { error: "You are not authorized to update your bio" };
  }

  const validatedFields = ProfileShema.safeParse(values);
  if (validatedFields.error) {
    return { error: validatedFields.error.message };
  }

  let imageUrl = validatedFields.data.image;
  let newImageUrl = imageUrl;

  if (imageUrl) {
    // Fetch the current user data to get the existing image URL
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    // If there is an existing image, delete it from Cloudinary

    if (newImageUrl !== user?.image) {
      if (user?.image) {
        const publicId = user.image.split("/").pop()?.split(".")[0];
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(`profiles/${publicId}`);
          } catch (error) {
            console.log("Error deleting image from Cloudinary:", error);
            return { error: "Failed to delete old image" };
          }
        }
      }

      // Upload the new image to Cloudinary
      try {
        const result = await cloudinary.uploader.upload(imageUrl, {
          folder: "profiles",
        });
        newImageUrl = result.secure_url;
      } catch (error) {
        console.log("Error uploading image to Cloudinary:", error);
        return { error: "Failed to upload new image" };
      }
    }
  }

  // Update the user data in the database with the new image URL
  const result = await db.user.update({
    where: { id: session.user.id },
    data: {
      ...validatedFields.data,
      image: newImageUrl,
    },
  });

  return {
    message: "Profile updated successfully",
    success: "success",
    result,
  };
}
