"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { calculateFee } from "../lib/pricing";
import { Resend } from "resend";
import { RegistrationReceivedEmail, PaymentVerifiedEmail } from "../components/EmailTemplates";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Helpers ────────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

// ─── Public: Sign Up ─────────────────────────────────────────────────────────

export async function signUpUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { success: false, error: "All fields are required." };
  }
  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, name, password: hashedPassword, role: "USER" },
    });

    try {
      await resend.emails.send({
        from: "ICAIAC 2026 <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to ICAIAC 2026",
        html: `
          <div style="font-family: sans-serif; color: #1a1a1a;">
            <h1 style="color: #e89b6e;">Welcome, ${name}!</h1>
            <p>Your account for the <strong>ICAIAC 2026 Portal</strong> has been created.</p>
            <p>You can now log in to complete your participant profile and proceed with registration.</p>
            <p>Best Regards,<br />Organizing Committee, IIIT Manipur</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.warn("Welcome email skipped:", emailError);
    }

    return { success: true };
  } catch {
    return { success: false, error: "Email already exists or invalid data." };
  }
}

// ─── Authenticated: Register ──────────────────────────────────────────────────

export async function registerUser(formData: FormData, userId: string) {
  const session = await requireAuth();

  // Prevent registering on behalf of another user
  if (session.user.id !== userId) {
    return { success: false, error: "Unauthorized." };
  }

  const category = formData.get("category") as string;
  const region = formData.get("region") as string;
  const institution = formData.get("institution") as string;
  const designation = formData.get("designation") as string;
  const phoneNumber = formData.get("phone") as string;

  try {
    await prisma.registration.create({
      data: { userId, category, region, institution, designation, phoneNumber },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, error: "Database error. You may already have a registration." };
  }
}

// ─── Authenticated: Submit Payment ───────────────────────────────────────────

export async function submitPaymentProof(
  registrationId: string,
  transactionId: string,
  receiptUrl: string
) {
  const session = await requireAuth();

  if (!transactionId?.trim() || !receiptUrl?.trim()) {
    return { success: false, error: "Transaction ID and receipt are required." };
  }

  try {
    const reg = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { user: true },
    });

    if (!reg) return { success: false, error: "Registration not found." };

    // Ensure the logged-in user owns this registration
    if (reg.userId !== session.user.id) {
      return { success: false, error: "Unauthorized." };
    }

    // Only Non-Authors pay through this portal; Authors use CMT
    if (reg.category !== "Non-Author") {
      return { success: false, error: "Authors must pay through the CMT portal." };
    }

    const amount = calculateFee(reg.category, reg.region);
    const currency = reg.region === "INR" ? "INR" : "USD";

    await prisma.payment.create({
      data: {
        registrationId,
        transactionId: transactionId.trim(),
        receiptUrl,
        amount,
        currency,
        status: "PENDING",
      },
    });

    try {
      await resend.emails.send({
        from: "ICAIAC 2026 <onboarding@resend.dev>",
        to: reg.user.email!,
        subject: "Registration Received - ICAIAC 2026",
        react: RegistrationReceivedEmail({ name: reg.user.name!, utr: transactionId }),
      });
    } catch (emailError) {
      console.warn("Payment confirmation email skipped:", emailError);
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("submitPaymentProof error:", error);
    return { success: false, error: "Submission failed. This UTR/Transaction ID may already be in use." };
  }
}

// ─── Authenticated: Get Status ────────────────────────────────────────────────

export async function getRegistrationStatus(userId: string) {
  const session = await requireAuth();
  if (session.user.id !== userId && session.user.role !== "ADMIN") {
    return null;
  }
  try {
    return await prisma.registration.findUnique({
      where: { userId },
      include: { payment: true },
    });
  } catch {
    return null;
  }
}

// ─── Admin: Verify Payment ────────────────────────────────────────────────────

export async function verifyPayment(paymentId: string) {
  await requireAdmin();

  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "VERIFIED" },
      include: { registration: { include: { user: true } } },
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");

    // Email is best-effort — don't let it fail the whole action
    try {
      await resend.emails.send({
        from: "ICAIAC 2026 <onboarding@resend.dev>",
        to: payment.registration.user.email!,
        subject: "Registration Confirmed - ICAIAC 2026",
        react: PaymentVerifiedEmail({ name: payment.registration.user.name! }),
      });
    } catch (emailError) {
      console.warn("Verification email skipped:", emailError);
    }

    return { success: true };
  } catch (error) {
    console.error("verifyPayment error:", error);
    return { success: false, error: "Failed to verify payment." };
  }
}

// ─── Admin: Get All Registrations ─────────────────────────────────────────────

export async function getAllRegistrations() {
  await requireAdmin();
  try {
    return await prisma.registration.findMany({
      include: { user: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}