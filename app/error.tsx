"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-charcoal text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-serif text-5xl text-gold mb-4">Something went wrong</h1>
      <p className="text-white/50 text-sm mb-8 max-w-md">{error.message || "An unexpected error occurred."}</p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-gold text-charcoal font-bold text-xs uppercase tracking-widest hover:bg-white transition-all"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}