"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Map, X } from "lucide-react"; // Removed MapPin

gsap.registerPlugin(ScrollTrigger);

// Extract static constants outside to prevent recreation on every render
const MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.318255140003!2d93.93708297537037!3d24.843225077940513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37492785030cfa5d%3A0xa9e85369c96babc0!2sIndian%20Institute%20of%20Information%20Technology%20Manipur!5e1!3m2!1sen!2sin!4v1770751425275!5m2!1sen!2sin"; // Replace with valid embed URL
const CAMPUS_IMG = "/images/cllg4.jpeg";

export default function Venue() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"visual" | "map">("visual");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax Effect
      gsap.to(".parallax-bg", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Card Entrance
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

  // Cache the boolean check for cleaner template literals
  const isVisual = view === "visual";

  return (
    <section 
      ref={containerRef} 
      id="venue"
      className="relative w-full h-[85vh] overflow-hidden bg-charcoal flex items-center justify-center border-t border-white/10"
    >
      
      {/* ==================== LAYER 1: THE REAL GOOGLE MAP ==================== */}
      <div className="absolute inset-0 z-0">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          className="w-full h-full border-0"
          src={MAP_URL}
          title="IIIT Manipur Map"
          allowFullScreen
        />
      </div>

      {/* ==================== LAYER 2: PARALLAX IMAGE COVER ==================== */}
      <div 
        className={`absolute inset-0 z-10 transition-opacity duration-1000 ${
          isVisual ? "opacity-100 pointer-events-none" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="parallax-bg relative w-full h-[120%] -top-[10%]">
          <Image
            src={CAMPUS_IMG}
            alt="IIIT Manipur Campus"
            fill
            className="object-cover grayscale" 
            priority
          />
          <div className="absolute inset-0 bg-charcoal/60 mix-blend-multiply" />
        </div>
      </div>

      {/* ==================== LAYER 3: FLOATING GLASS CARD ==================== */}
      <div 
        className={`relative z-20 max-w-lg text-center px-4 transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] ${
          isVisual ? "opacity-100 translate-y-0" : "opacity-0 translate-y-32 pointer-events-none"
        }`}
      >
        <div className="venue-card bg-charcoal/85 backdrop-blur-md border border-white/10 p-10 md:p-14 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm">
            
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                  onClick={() => setView("map")}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-xl rounded-sm"
              >
                  <Map size={16} /> Interactive Map
              </button>
            </div>

        </div>
      </div>

      {/* ==================== LAYER 4: FLOATING "BACK TO CAMPUS" BUTTON ==================== */}
      <div 
        className={`absolute top-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-700 delay-300 ${
          !isVisual ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        <button 
          onClick={() => setView("visual")}
          className="flex items-center gap-2 px-6 py-3 bg-charcoal/90 backdrop-blur-md border border-white/20 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:bg-gold hover:text-charcoal transition-all"
        >
          <X size={14} /> Close Map
        </button>
      </div>

    </section>
  );
}