"use client";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function registerUser(formData: FormData, userId: string) {
  const category = formData.get("category") as string;
  const region = formData.get("region") as string;
  const institution = formData.get("institution") as string;
  const designation = formData.get("designation") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  try {
    await prisma.registration.create({
      data: {
        userId: userId,
        category,
        region,
        institution,
        designation,
        phoneNumber,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, error: "Could not save registration." };
  }
}