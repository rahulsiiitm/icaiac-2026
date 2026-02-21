"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { calculateFee } from "../lib/pricing";

const prisma = new PrismaClient();

// Add to your existing actions.ts
import bcrypt from "bcrypt";

export async function signUpUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER" // Default role
      }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Email already exists or invalid data." };
  }
}

/**
 * Fetches registration and payment status for the dashboard
 */
export async function getRegistrationStatus(userId: string) {
  if (!userId) return null;
  try {
    return await prisma.registration.findUnique({
      where: { userId },
      include: { payment: true },
    });
  } catch (error) {
    console.error("Fetch Status Error:", error);
    return null;
  }
}

/**
 * Saves Step 1 registration details
 */
export async function registerUser(formData: FormData, userId: string) {
  const category = formData.get("category") as string;
  const region = formData.get("region") as string;
  const institution = formData.get("institution") as string;
  const designation = formData.get("designation") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  try {
    await prisma.registration.create({
      data: {
        userId,
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
    return { success: false, error: "Database error. Please try again." };
  }
}

/**
 * Saves Step 2 payment proof
 */
export async function submitPaymentProof(registrationId: string, transactionId: string, receiptUrl: string) {
  try {
    const reg = await prisma.registration.findUnique({ where: { id: registrationId } });
    
    // Safety check: Only Non-Authors should use this portal for payment
    if (!reg || reg.category.includes("Author")) {
      return { success: false, error: "Authors must pay via CMT. This portal is for Attendees only." };
    }

    const amount = calculateFee(reg.category, reg.region);

    await prisma.payment.create({
      data: {
        registrationId,
        transactionId,
        receiptUrl,
        amount,
        currency: reg.region === "INR" ? "INR" : "USD",
        status: "PENDING",
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Submission failed." };
  }
}

/**
 * Admin Action: Fetch all participants for the admin panel
 */
export async function getAllRegistrations() {
  try {
    return await prisma.registration.findMany({
      include: {
        user: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return [];
  }
}

/**
 * Admin Action: Verify a participant's payment
 */
export async function verifyPayment(paymentId: string) {
  try {
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "VERIFIED" },
    });
    
    // Refresh both pages so the changes show up immediately
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Verification Error:", error);
    return { success: false, error: "Failed to verify payment." };
  }
}