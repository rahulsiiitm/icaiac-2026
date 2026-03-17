"use client";
import { useEffect } from "react";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-6 text-center">
      <h2 className="font-serif text-3xl text-charcoal mb-4">Admin Panel Error</h2>
      <p className="text-charcoal/50 text-sm mb-8">{error.message || "Failed to load admin panel."}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-charcoal text-white font-bold text-xs uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all"
      >
        Retry
      </button>
    </div>
  );
}