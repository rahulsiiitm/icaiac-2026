"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpUser } from "../dashboard/actions";
import Link from "next/link";

export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await signUpUser(formData);
    
    if (res.success) {
      alert("Account created! Please sign in.");
      router.push("/sign-in");
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-charcoal flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 backdrop-blur-md rounded-sm">
        <h1 className="font-serif text-3xl text-white mb-8 text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="name" type="text" placeholder="Full Name" required className="w-full bg-charcoal border border-white/20 p-4 text-sm text-white focus:border-gold outline-none" />
          <input name="email" type="email" placeholder="Email Address" required className="w-full bg-charcoal border border-white/20 p-4 text-sm text-white focus:border-gold outline-none" />
          <input name="password" type="password" placeholder="Password" required className="w-full bg-charcoal border border-white/20 p-4 text-sm text-white focus:border-gold outline-none" />
          <button disabled={isSubmitting} className="w-full bg-gold text-charcoal font-bold py-4 text-[10px] uppercase tracking-widest hover:bg-white transition-all">
            {isSubmitting ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-white/30">
          Already have an account? <Link href="/sign-in" className="text-gold hover:underline">Sign In</Link>
        </p>
      </div>
    </main>
  );
}