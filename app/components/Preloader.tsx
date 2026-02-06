"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setComplete(true),
      });

      // 1. Initial State
      tl.set(".preloader-text", { y: 100, opacity: 0 });

      // 2. Animate Text In
      tl.to(".preloader-text", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      })
      .to(".preloader-text", {
        y: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.in",
        delay: 0.5,
      });

      // 3. Slide the Curtain Up
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (complete) return null; // Unmount after animation to save performance

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-charcoal flex items-center justify-center pointer-events-none"
    >
      <div className="overflow-hidden text-center px-4">
        {/* The Animated Text Lines */}
        <div className="overflow-hidden mb-2">
            <h1 className="preloader-text font-serif text-3xl md:text-5xl text-white leading-tight">
              Artificial Intelligence
            </h1>
        </div>
        <div className="overflow-hidden mb-2">
            <span className="preloader-text block font-serif text-3xl md:text-5xl text-white/50 italic leading-tight">
              & Advanced Computing
            </span>
        </div>
        <div className="overflow-hidden mt-4">
            <span className="preloader-text block font-sans text-gold text-xs font-bold tracking-[0.3em] uppercase">
              ICAIAC 2026
            </span>
        </div>
      </div>
    </div>
  );
}