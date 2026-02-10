"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Venue() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"visual" | "map">("visual");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Parallax Effect (Only active on the Visual Layer)
      gsap.to(".parallax-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // 2. Card Entrance Animation
      gsap.fromTo(
        ".venue-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[85vh] overflow-hidden bg-charcoal flex items-center justify-center border-t border-white/10"
    >
      
      {/* ==================== LAYER 1: PARALLAX IMAGE ==================== */}
      <div 
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ${view === "visual" ? "opacity-100 pointer-events-none" : "opacity-0"}`}
      >
        <div className="parallax-bg relative w-full h-[120%] -top-[10%]">
          <Image
            src="/images/cllg4.jpeg"
            alt="IIIT Manipur Campus"
            fill
            className="object-cover grayscale" 
            priority
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-charcoal/50 mix-blend-multiply" />
        </div>
      </div>

      {/* ==================== LAYER 2: DARK MAP ==================== */}
      <div 
        className={`absolute inset-0 z-10 transition-opacity duration-1000 ${view === "map" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          className="w-full h-full"
          style={{ 
            // The "MapSection" Dark Mode Filter
            filter: "grayscale(0%) invert(0%) contrast(1) brightness(0.8)",
            border: 0 
          }}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.318255140003!2d93.93708297537037!3d24.843225077940513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37492785030cfa5d%3A0xa9e85369c96babc0!2sIndian%20Institute%20of%20Information%20Technology%20Manipur!5e1!3m2!1sen!2sin!4v1770751425275!5m2!1sen!2sin" // Replace with valid embed URL
          title="IIIT Manipur Map"
        ></iframe>
        
        {/* Gradient Edge to blend with footer/header */}
        <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-charcoal/80 via-transparent to-charcoal/80" />
      </div>

      {/* ==================== LAYER 3: FLOATING CONTROL CARD ==================== */}
      <div className="relative z-20 max-w-lg text-center px-4">
        
        {/* Glass Card styling from MapSection */}
        <div className="venue-card bg-charcoal/85 backdrop-blur-md border border-white/10 p-10 md:p-14 shadow-2xl rounded-sm">
            <span className="block font-sans text-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">
              The Destination
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
              IIIT Manipur
            </h2>
            <p className="font-sans text-white/70 text-sm md:text-base leading-relaxed mb-10">
              City Campus, Mantripukhri <br />
              Imphal, Manipur, India - 795002
            </p>

            {/* THE TOGGLE SWITCH */}
            <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-sm">
                <button 
                    onClick={() => setView("visual")}
                    className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                        view === "visual" 
                        ? "bg-white text-charcoal shadow-lg" 
                        : "text-white/50 hover:text-white"
                    }`}
                >
                    Campus View
                </button>
                <button 
                    onClick={() => setView("map")}
                    className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                        view === "map" 
                        ? "bg-white text-charcoal shadow-lg" 
                        : "text-white/50 hover:text-white"
                    }`}
                >
                    Map View
                </button>
            </div>
        </div>

      </div>

    </section>
  );
}