"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-charcoal overflow-hidden">
      
      {/* Background Styling */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/campus-hero.jpeg"
          alt="IIIT Manipur Campus Background"
          fill
          className="object-cover opacity-20 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-charcoal/90 via-charcoal/80 to-charcoal/90" />
      </div>

      <div className="absolute top-0 right-0 w-150 h-150 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Back to Home Link */}
        <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors text-xs font-bold uppercase tracking-widest mb-8"
        >
            <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-12 shadow-2xl rounded-sm text-center relative overflow-hidden">
          
          {/* Logo Watermark inside card */}
          <div className="absolute -right-10 -top-10 w-40 h-40 opacity-5 pointer-events-none">
            <Image src="/images/logo.png" alt="" fill className="object-contain grayscale" />
          </div>

          <div className="relative w-16 h-16 mx-auto mb-6">
            <Image src="/images/logo.png" alt="ICAIAC Logo" fill className="object-contain" />
          </div>

          <span className="block font-sans text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            ICAIAC 2026 Portal
          </span>
          <h1 className="font-serif text-3xl text-white mb-2">Welcome Back</h1>
          <p className="font-sans text-white/60 text-sm mb-10 leading-relaxed">
            Sign in to complete your conference registration and access your dashboard.
          </p>

          {/* Google Sign In Button */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full group relative flex items-center justify-center gap-3 bg-white text-charcoal px-6 py-4 rounded-sm hover:bg-gold transition-all duration-300 font-bold tracking-wide shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-[11px] uppercase tracking-widest mt-0.5 group-hover:text-charcoal transition-colors">
                Continue with Google
            </span>
          </button>

          <p className="mt-8 font-sans text-[10px] text-white/40 max-w-xs mx-auto">
            By signing in, you agree to the conference Terms of Service and Privacy Policy.
          </p>

        </div>
      </div>
    </div>
  );
}