"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpUser } from "../dashboard/actions";
import Link from "next/link";
import Image from "next/image";
// Importing icons for a better UI experience
import { Mail, Lock, User, UserPlus } from "lucide-react"; 

export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await signUpUser(formData);
    
    if (res.success) {
      alert("Account created! A welcome email has been sent. Please sign in.");
      router.push("/sign-in");
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-charcoal flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 backdrop-blur-md rounded-sm">
        
        {/* LOGO & HEADER */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 mb-4">
            <Image 
              src="/images/logo.png" 
              alt="ICAIAC Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-serif text-3xl text-white text-center">Create Account</h1>
          <p className="text-[10px] text-gold uppercase tracking-[0.2em] mt-2 text-center">
            Join the ICAIAC 2026 Community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div className="relative">
            <input 
              name="name" 
              type="text" 
              placeholder="Full Name" 
              required 
              className="w-full bg-charcoal border border-white/20 p-4 pl-12 text-sm text-white focus:border-gold outline-none" 
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
          </div>

          {/* Email Input */}
          <div className="relative">
            <input 
              name="email" 
              type="email" 
              placeholder="Email Address" 
              required 
              className="w-full bg-charcoal border border-white/20 p-4 pl-12 text-sm text-white focus:border-gold outline-none" 
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              required 
              className="w-full bg-charcoal border border-white/20 p-4 pl-12 text-sm text-white focus:border-gold outline-none" 
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
          </div>

          <button 
            disabled={isSubmitting} 
            className="w-full bg-gold text-charcoal font-bold py-4 text-[10px] uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <UserPlus size={14} /> Create Account
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-white/30">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-gold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}