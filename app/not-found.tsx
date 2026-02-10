"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-charcoal text-white text-center px-4">
      
      {/* Animated Logo */}
      <div className="relative w-24 h-24 mb-8 animate-bounce">
        <Image 
          src="/images/logo.png" 
          alt="ICAIAC Logo" 
          fill 
          className="object-contain opacity-80"
        />
      </div>

      <h1 className="font-serif text-6xl md:text-8xl text-gold mb-4">404</h1>
      <h2 className="font-serif text-2xl md:text-3xl mb-6">Page Not Found</h2>
      <p className="font-sans text-white/50 max-w-md mb-10">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Link 
        href="/"
        className="px-8 py-3 bg-gold text-charcoal font-bold text-xs tracking-[0.2em] uppercase hover:bg-white transition-all rounded-sm"
      >
        Back to Home
      </Link>
    </div>
  );
}