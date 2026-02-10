"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial Reveal Animation: Set autoAlpha
      gsap.set([titleRef.current, subtitleRef.current, detailsRef.current, buttonsRef.current], {
        autoAlpha: 1,
      });

      tl.fromTo(
        ".char-reveal",
        { y: 100, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.05, duration: 1.5, delay: 0.5 }
      )
        .fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=1.0")
        .fromTo(detailsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.8")
        .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.8");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden snap-start snap-always bg-charcoal"
    >
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/campus-hero.jpeg"
          alt="IIIT Manipur Architecture"
          fill
          className="object-cover opacity-50 grayscale"
          priority
        />
        {/* Gradient Overlay using Charcoal (Green Shade) */}
        <div className="absolute inset-0 bg-linear-to-b from-charcoal/90 via-charcoal/60 to-charcoal/90" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <h1
          ref={titleRef}
          className="font-serif text-white text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight overflow-hidden leading-[1.1]"
        >
          <span className="block overflow-hidden">
            {["I", "C", "A", "I", "A", "C"].map((char, i) => (
              <span key={i} className="char-reveal inline-block">{char}</span>
            ))}
          </span>
          <span className="block text-4xl md:text-6xl text-gold mt-2 overflow-hidden">
            <span className="char-reveal inline-block">2026</span>
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="font-sans text-white/80 mt-8 text-lg md:text-xl tracking-wide max-w-2xl mx-auto opacity-0"
        >
          The 1st International Conference on <br className="hidden md:block" />
          Artificial Intelligence & Advanced Computing
        </p>

        {/* DATE & VENUE */}
        <div
          ref={detailsRef}
          className="mt-8 flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-center font-sans text-sm font-semibold tracking-widest uppercase opacity-0 text-white/90"
        >
          <div className="flex items-center gap-2">
            <span className="block w-2 h-2 bg-gold rounded-full" />
            <span>Jan 5-7, 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block w-2 h-2 bg-gold rounded-full" />
            <span>IIIT Manipur</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div
          ref={buttonsRef}
          className="mt-12 flex flex-col sm:flex-row gap-6 justify-center opacity-0"
        >
          {/* Primary Action: Gold on Charcoal */}
          <Link 
            href="/#tracks"
            className="group relative px-8 py-4 bg-gold text-charcoal font-semibold tracking-wide overflow-hidden shadow-xl hover:shadow-2xl transition-all inline-block"
          >
              <span className="relative z-10 flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                Submit Your Paper
              </span>
              <div className="absolute inset-0 bg-white transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 z-0"></div>
          </Link>

          {/* Secondary Action: White Outline */}
          <Link 
            href="/#registration"
            className="px-8 py-4 border border-white/20 text-white hover:bg-white hover:text-charcoal transition-colors duration-300 text-xs uppercase tracking-[0.2em] font-bold inline-block"
          >
              Registration Info
          </Link>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 animate-bounce text-white/50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5V19M12 19L5 12M12 19L19 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}