"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { calculateFee } from "../lib/pricing";
import { Resend } from "resend";
import { RegistrationReceivedEmail, PaymentVerifiedEmail } from "../components/EmailTemplates";
import bcrypt from "bcryptjs"; 

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Creates a new user and sends a Welcome Email
 */
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
        role: "USER" 
      }
    });

    // Send Welcome Email immediately upon sign-up
    try {
      await resend.emails.send({
        from: 'ICAIAC 2026 <onboarding@resend.dev>',
        to: email,
        subject: 'Welcome to ICAIAC 2026',
        html: `
          <div style="font-family: serif; color: #1a1a1a;">
            <h1 style="color: #e89b6e;">Welcome, ${name}!</h1>
            <p>Your account for the <strong>ICAIAC 2026 Portal</strong> has been successfully created.</p>
            <p>You can now log in to complete your participant profile and proceed with registration.</p>
            <p>Best Regards,<br />Organizing Committee, IIIT Manipur</p>
          </div>
        `
      });
    } catch (emailError) {
      console.warn("Welcome email skipped (Sandbox limitation):", emailError);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Email already exists or invalid data." };
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
  
  // Maps form "phone" to schema "phoneNumber"
  const phoneNumber = formData.get("phone") as string;

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
    return { success: false, error: "Database error. Check if you already have an active registration." };
  }
}

/**
 * Saves Step 2 payment proof
 */
export async function submitPaymentProof(registrationId: string, transactionId: string, receiptUrl: string) {
  try {
    const reg = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { user: true }
    });

    // Strict check for "Non-Author" to prevent rejection of valid attendees
    if (!reg || reg.category !== "Non-Author") {
        return { success: false, error: "Invalid registration category." };
    }

    const amount = calculateFee(reg.category, reg.region);

    await prisma.payment.create({
      data: { 
        registrationId, 
        transactionId, 
        receiptUrl, 
        amount, 
        currency: reg.region === "INR" ? "INR" : "USD", 
        status: "PENDING" 
      },
    });

    try {
      await resend.emails.send({
        from: 'ICAIAC 2026 <onboarding@resend.dev>',
        to: reg.user.email!,
        subject: 'Registration Received - ICAIAC 2026',
        react: RegistrationReceivedEmail({ name: reg.user.name!, utr: transactionId }),
      });
    } catch (emailError) {
      console.warn("Payment email skipped:", emailError);
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Submission failed. This UTR/Transaction ID is already in use." };
  }
}

export async function getRegistrationStatus(userId: string) {
  if (!userId) return null;
  try {
    return await prisma.registration.findUnique({
      where: { userId },
      include: { payment: true },
    });
  } catch (error) {
    return null;
  }
}

export async function verifyPayment(paymentId: string) {
  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "VERIFIED" },
      include: { registration: { include: { user: true } } }
    });

    await resend.emails.send({
      from: 'ICAIAC 2026 <onboarding@resend.dev>',
      to: payment.registration.user.email!,
      subject: 'Registration Confirmed - ICAIAC 2026',
      react: PaymentVerifiedEmail({ name: payment.registration.user.name! }),
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) { return { success: false }; }
}

export async function getAllRegistrations() {
  try {
    return await prisma.registration.findMany({
      include: { user: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) { return []; }
}