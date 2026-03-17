"use client";
import { useEffect } from "react";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-charcoal text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="font-serif text-3xl text-gold mb-4">Dashboard Error</h2>
      <p className="text-white/50 text-sm mb-8">{error.message || "Failed to load your dashboard."}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-gold text-charcoal font-bold text-xs uppercase tracking-widest hover:bg-white transition-all"
      >
        Retry
      </button>
    </div>
  );
}