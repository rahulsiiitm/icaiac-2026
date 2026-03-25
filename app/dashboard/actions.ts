"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { calculateFee } from "../lib/pricing";
import { Resend } from "resend";
import { RegistrationReceivedEmail, PaymentVerifiedEmail } from "../components/EmailTemplates";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") throw new Error("Forbidden");
  return session;
}

// ─── Public: Sign Up ──────────────────────────────────────────────────────────

export async function signUpUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) return { success: false, error: "All fields are required." };
  if (password.length < 8) return { success: false, error: "Password must be at least 8 characters." };

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
        html: `<div style="font-family:sans-serif;color:#1a1a1a"><h1 style="color:#e89b6e">Welcome, ${name}!</h1><p>Your account for <strong>ICAIAC 2026 Portal</strong> has been created.</p><p>Best Regards,<br/>Organizing Committee, IIIT Manipur</p></div>`,
      });
    } catch (e) { console.warn("Welcome email skipped:", e); }
    return { success: true };
  } catch {
    return { success: false, error: "Email already exists or invalid data." };
  }
}

// ─── Public: Forgot Password ──────────────────────────────────────────────────

export async function requestPasswordReset(email: string) {
  // Always return success to prevent email enumeration
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      // Google-only account or not found — silently succeed
      return { success: true };
    }

    // Invalidate any existing tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expires },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "ICAIAC 2026 <onboarding@resend.dev>",
      to: email,
      subject: "Reset Your Password - ICAIAC 2026",
      html: `
        <div style="font-family:sans-serif;color:#1a1a1a">
          <h1 style="color:#e89b6e">Password Reset</h1>
          <p>You requested a password reset for your ICAIAC 2026 account.</p>
          <p>Click the link below to set a new password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#e89b6e;color:#fff;padding:12px 24px;text-decoration:none;font-weight:bold;margin:16px 0">Reset Password</a>
          <p>If you didn't request this, ignore this email. Your password won't change.</p>
          <p>Best Regards,<br/>Organizing Committee, IIIT Manipur</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("Password reset error:", e);
  }
  return { success: true };
}

// ─── Public: Reset Password ───────────────────────────────────────────────────

export async function resetPassword(token: string, newPassword: string) {
  if (!token || !newPassword) return { success: false, error: "Invalid request." };
  if (newPassword.length < 8) return { success: false, error: "Password must be at least 8 characters." };

  try {
    const record = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!record || record.used || record.expires < new Date()) {
      return { success: false, error: "This reset link is invalid or has expired." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// ─── Authenticated: Register ──────────────────────────────────────────────────

export async function registerUser(formData: FormData, userId: string) {
  const session = await requireAuth();
  if (session.user.id !== userId) return { success: false, error: "Unauthorized." };

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

// ─── Authenticated: Update Profile ───────────────────────────────────────────

export async function updateProfile(formData: FormData, registrationId: string) {
  const session = await requireAuth();

  const institution = formData.get("institution") as string;
  const designation = formData.get("designation") as string;
  const phoneNumber = formData.get("phone") as string;

  try {
    const reg = await prisma.registration.findUnique({ where: { id: registrationId } });
    if (!reg || reg.userId !== session.user.id) return { success: false, error: "Unauthorized." };

    // Don't allow edits once payment is submitted
    const payment = await prisma.payment.findUnique({ where: { registrationId } });
    if (payment) return { success: false, error: "Profile cannot be edited after payment is submitted." };

    await prisma.registration.update({
      where: { id: registrationId },
      data: { institution, designation, phoneNumber },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Update failed." };
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
    if (reg.userId !== session.user.id) return { success: false, error: "Unauthorized." };
    if (reg.category !== "Non-Author") return { success: false, error: "Authors must pay through the CMT portal." };

    const amount = calculateFee(reg.category, reg.region);
    const currency = reg.region === "INR" ? "INR" : "USD";

    await prisma.payment.create({
      data: { registrationId, transactionId: transactionId.trim(), receiptUrl, amount, currency, status: "PENDING" },
    });

    try {
      await resend.emails.send({
        from: "ICAIAC 2026 <onboarding@resend.dev>",
        to: reg.user.email!,
        subject: "Registration Received - ICAIAC 2026",
        react: RegistrationReceivedEmail({ name: reg.user.name!, utr: transactionId }),
      });
    } catch (e) { console.warn("Payment email skipped:", e); }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("submitPaymentProof error:", error);
    return { success: false, error: "Submission failed. This UTR may already be in use." };
  }
}

// ─── Authenticated: Re-submit Payment (after rejection) ──────────────────────

export async function resubmitPaymentProof(
  paymentId: string,
  transactionId: string,
  receiptUrl: string
) {
  const session = await requireAuth();

  if (!transactionId?.trim() || !receiptUrl?.trim()) {
    return { success: false, error: "Transaction ID and receipt are required." };
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { registration: { include: { user: true } } },
    });

    if (!payment) return { success: false, error: "Payment record not found." };
    if (payment.registration.userId !== session.user.id) return { success: false, error: "Unauthorized." };

    // Only allow resubmission if FAILED (rejected by admin)
    if (payment.status !== "FAILED") {
      return { success: false, error: "Only rejected payments can be resubmitted." };
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        transactionId: transactionId.trim(),
        receiptUrl,
        status: "PENDING",
        rejectionNote: null,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("resubmitPaymentProof error:", error);
    return { success: false, error: "Resubmission failed. This UTR may already be in use." };
  }
}

// ─── Authenticated: Get Status ────────────────────────────────────────────────

export async function getRegistrationStatus(userId: string) {
  const session = await requireAuth();
  if (session.user.id !== userId && session.user.role !== "ADMIN") return null;
  try {
    return await prisma.registration.findUnique({
      where: { userId },
      include: { payment: true },
    });
  } catch { return null; }
}

// ─── Admin: Verify Payment ────────────────────────────────────────────────────

export async function verifyPayment(paymentId: string) {
  await requireAdmin();
  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "VERIFIED", rejectionNote: null },
      include: { registration: { include: { user: true } } },
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");

    try {
      await resend.emails.send({
        from: "ICAIAC 2026 <onboarding@resend.dev>",
        to: payment.registration.user.email!,
        subject: "Registration Confirmed - ICAIAC 2026",
        react: PaymentVerifiedEmail({ name: payment.registration.user.name! }),
      });
    } catch (e) { console.warn("Verification email skipped:", e); }

    return { success: true };
  } catch (error) {
    console.error("verifyPayment error:", error);
    return { success: false, error: "Failed to verify payment." };
  }
}

// ─── Admin: Reject Payment ────────────────────────────────────────────────────

export async function rejectPayment(paymentId: string, reason: string) {
  await requireAdmin();

  if (!reason?.trim()) return { success: false, error: "Rejection reason is required." };

  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "FAILED", rejectionNote: reason.trim() },
      include: { registration: { include: { user: true } } },
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");

    try {
      await resend.emails.send({
        from: "ICAIAC 2026 <onboarding@resend.dev>",
        to: payment.registration.user.email!,
        subject: "Payment Issue - ICAIAC 2026 Registration",
        html: `
          <div style="font-family:sans-serif;color:#1a1a1a">
            <h1 style="color:#e89b6e">Action Required</h1>
            <p>Dear ${payment.registration.user.name},</p>
            <p>We were unable to verify your payment for <strong>ICAIAC 2026</strong>.</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>Please log in to your dashboard and resubmit your payment details.</p>
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display:inline-block;background:#e89b6e;color:#fff;padding:12px 24px;text-decoration:none;font-weight:bold;margin:16px 0">Go to Dashboard</a>
            <p>Best Regards,<br/>Organizing Committee, IIIT Manipur</p>
          </div>
        `,
      });
    } catch (e) { console.warn("Rejection email skipped:", e); }

    return { success: true };
  } catch (error) {
    console.error("rejectPayment error:", error);
    return { success: false, error: "Failed to reject payment." };
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
  } catch { return []; }
}