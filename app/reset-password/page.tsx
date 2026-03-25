"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
import { resetPassword } from "../dashboard/actions";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token.");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    const res = await resetPassword(token!, password);
    setIsLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => router.push("/sign-in"), 3000);
    } else {
      setError(res.error || "Something went wrong.");
    }
  };

  return (
    <div className="bg-charcoal min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-sm backdrop-blur-md shadow-2xl">

        <div className="flex flex-col items-center mb-10">
          <div className="relative w-20 h-20 mb-4">
            <Image src="/images/logo.png" alt="ICAIAC Logo" fill className="object-contain" priority />
          </div>
          <h1 className="font-serif text-3xl text-white text-center">New Password</h1>
          <p className="text-[10px] text-gold uppercase tracking-[0.2em] mt-2">ICAIAC 2026 Portal</p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="text-5xl">✓</div>
            <p className="text-white/70 text-sm">Password updated successfully. Redirecting to sign in...</p>
            <Link href="/sign-in" className="block w-full text-center py-4 bg-gold text-charcoal font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all">
              Sign In Now
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-sm text-xs mb-6">
                {error}
              </div>
            )}
            {!token ? (
              <div className="text-center">
                <p className="text-white/50 text-sm mb-6">This reset link is invalid. Please request a new one.</p>
                <Link href="/forgot-password" className="block w-full text-center py-4 bg-gold text-charcoal font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all">
                  Request New Link
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-charcoal border border-white/20 p-4 pl-12 text-sm text-white focus:border-gold outline-none transition-all"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-charcoal border border-white/20 p-4 pl-12 text-sm text-white focus:border-gold outline-none transition-all"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                </div>
                <button
                  disabled={isLoading}
                  className="w-full bg-gold text-charcoal font-bold py-4 text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Set New Password"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="bg-charcoal min-h-screen flex items-center justify-center">
        <p className="text-white/40 animate-pulse text-sm uppercase tracking-widest">Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}