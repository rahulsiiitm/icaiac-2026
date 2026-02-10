"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image"; // Import Image

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsActive(false),
      });

      // 1. Logo Reveal & Pulse
      tl.fromTo(
        logoRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "power2.out" }
      )
      .to(logoRef.current, {
        scale: 1.1,
        duration: 0.8,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut"
      })
      
      // 2. Slide Up Away
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power3.inOut",
        delay: 0.2
      });

    }, containerRef);

    return () => ctx.revert();
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal"
    >
      {/* Logo Container */}
      <div ref={logoRef} className="relative w-32 h-32 md:w-48 md:h-48 flex flex-col items-center gap-4">
        <div className="relative w-full h-full">
            <Image 
                src="/images/logo.png" 
                alt="ICAIAC Loading" 
                fill 
                className="object-contain"
                priority
            />
        </div>
        {/* Optional Loading Text */}
        <span className="font-sans text-gold text-xs tracking-[0.3em] uppercase animate-pulse">
            Loading
        </span>
      </div>
    </div>
  );
}