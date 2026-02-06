"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Venue() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".parallax-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[80vh] overflow-hidden flex items-center justify-center">
      
      {/* PARALLAX BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="parallax-bg relative w-full h-[120%] -top-[10%]">
          <Image
            src="/images/campus-hero.jpg" // Use a wide shot of the institute/Imphal
            alt="IIIT Manipur Campus"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-charcoal/40" />
        </div>
      </div>

      {/* FLOATING CARD */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-12 max-w-2xl text-center text-white">
        <span className="block font-sans text-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">
          Host Institute
        </span>
        <h2 className="font-serif text-5xl mb-6">IIIT Manipur</h2>
        <p className="font-sans text-lg opacity-90 leading-relaxed mb-8">
          Located in the heart of Imphal, our campus blends modern infrastructure with the serene beauty of Northeast India.
        </p>
        <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-white text-charcoal font-bold text-xs uppercase tracking-widest hover:bg-gold transition-colors">
                View on Map
            </button>
            <button className="px-8 py-3 border border-white text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-charcoal transition-colors">
                Plan Travel
            </button>
        </div>
      </div>

    </section>
  );
}