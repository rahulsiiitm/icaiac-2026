"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial Reveal Animation
      gsap.set([titleRef.current, subtitleRef.current, detailsRef.current], {
        autoAlpha: 1,
      });

      tl.fromTo(
        ".char-reveal",
        { y: 100, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.05, duration: 1.5, delay: 0.5 }
      )
        .fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=1.0")
        .fromTo(detailsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.8");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden snap-start snap-always"
    >
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/campus-hero.jpg"
          alt="IIIT Manipur Architecture"
          fill
          className="object-cover opacity-20 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream-100/80 via-cream-100/40 to-cream-100/90" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <h1
          ref={titleRef}
          className="font-serif text-charcoal text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight overflow-hidden leading-[1.1]"
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
          className="font-sans text-charcoal-light mt-8 text-lg md:text-xl tracking-wide max-w-2xl mx-auto opacity-0"
        >
          The 1st International Conference on <br className="hidden md:block" />
          Artificial Intelligence & Advanced Computing
        </p>

        <div
          ref={detailsRef}
          className="mt-12 flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-center font-sans text-sm font-semibold tracking-widest uppercase opacity-0"
        >
          <div className="flex items-center gap-2">
            <span className="block w-2 h-2 bg-gold rounded-full" />
            <span>August 2-5, 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block w-2 h-2 bg-gold rounded-full" />
            <span>IIIT Manipur</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 animate-bounce text-charcoal-light">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5V19M12 19L5 12M12 19L19 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}