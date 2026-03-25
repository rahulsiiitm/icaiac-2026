"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { requestPasswordReset } from "../dashboard/actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await requestPasswordReset(email);
    // Always show success to prevent email enumeration
    setSent(true);
    setIsLoading(false);
  };

  return (
    <div className="bg-charcoal min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-sm backdrop-blur-md shadow-2xl">

        <div className="flex flex-col items-center mb-10">
          <div className="relative w-20 h-20 mb-4">
            <Image src="/images/logo.png" alt="ICAIAC Logo" fill className="object-contain" priority />
          </div>
          <h1 className="font-serif text-3xl text-white text-center">Forgot Password</h1>
          <p className="text-[10px] text-gold uppercase tracking-[0.2em] mt-2">ICAIAC 2026 Portal</p>
        </div>

        {sent ? (
          <div className="text-center space-y-6">
            <div className="text-5xl">📧</div>
            <p className="text-white/70 text-sm leading-relaxed">
              If an account exists for <span className="text-gold">{email}</span>, a reset link has been sent. Check your inbox.
            </p>
            <p className="text-white/30 text-xs">The link expires in 1 hour.</p>
            <Link
              href="/sign-in"
              className="block w-full text-center py-4 bg-gold text-charcoal font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className="text-white/50 text-sm text-center mb-8 leading-relaxed">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-charcoal border border-white/20 p-4 pl-12 text-sm text-white focus:border-gold outline-none transition-all"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
              </div>
              <button
                disabled={isLoading}
                className="w-full bg-gold text-charcoal font-bold py-4 text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-white/30">
              Remember it? <Link href="/sign-in" className="text-gold hover:underline">Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}