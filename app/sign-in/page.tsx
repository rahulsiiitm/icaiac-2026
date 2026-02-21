"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) router.push("/dashboard");
    else alert("Invalid credentials");
  };

  return (
    <div className="bg-charcoal min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-sm backdrop-blur-md">
        <h1 className="font-serif text-3xl text-white mb-8 text-center">Sign In</h1>
        
        {/* Email & Password Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-6 mb-8">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-charcoal border border-white/20 p-4 text-sm text-white focus:border-gold outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-charcoal border border-white/20 p-4 text-sm text-white focus:border-gold outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-gold text-charcoal font-bold py-4 text-[10px] uppercase tracking-widest hover:bg-white transition-all">
            Sign In with Email
          </button>
        </form>

        <div className="relative flex items-center justify-center mb-8">
            <div className="w-full border-b border-white/10"></div>
            <span className="absolute bg-charcoal px-4 text-[10px] text-white/30 uppercase tracking-widest">Or</span>
        </div>

        {/* Existing Google Login */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full bg-white text-charcoal font-bold py-4 text-[10px] uppercase tracking-widest hover:bg-gold transition-all flex items-center justify-center gap-3"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}