"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={containerRef} className="relative w-full bg-charcoal text-cream-100 pt-32 pb-12 overflow-hidden border-t border-white/10">
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* SECTION 1: LEADERSHIP (The Committee) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          
          <div className="col-span-1 md:col-span-4 footer-reveal">
            <span className="block font-sans text-gold text-xs font-bold tracking-[0.2em] uppercase mb-6">
              Leadership
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight">
              Organizing <br /> Committee
            </h2>
          </div>

          <div className="col-span-1 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Convenor */}
            <div className="footer-reveal border-l border-white/10 pl-6">
              <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Convenor</span>
              <h3 className="font-serif text-xl text-white">Dr. N. Kishorjit Singh</h3>
              <p className="font-sans text-xs opacity-60 mt-1">Dept. of CSE, IIIT Manipur</p>
            </div>

            {/* Co-Convenor */}
            <div className="footer-reveal border-l border-white/10 pl-6">
              <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Co-Convenor</span>
              <h3 className="font-serif text-xl text-white">Dr. K. Motilal Singh</h3>
              <p className="font-sans text-xs opacity-60 mt-1">Dept. of CSE, IIIT Manipur</p>
            </div>
            
            {/* Patron */}
            <div className="footer-reveal border-l border-white/10 pl-6">
              <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Chief Patron</span>
              <h3 className="font-serif text-xl text-white">Director</h3>
              <p className="font-sans text-xs opacity-60 mt-1">IIIT Manipur</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT US (Explicit Section) */}
        <div className="border-t border-white/10 pt-20 pb-12 footer-reveal">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            
            {/* Left: Heading & Address */}
            <div>
              <span className="block font-sans text-gold text-xs font-bold tracking-[0.2em] uppercase mb-6">
                Contact Us
              </span>
              <address className="font-sans text-white/60 not-italic text-lg leading-relaxed max-w-md">
                <strong className="text-white block mb-2">IIIT Manipur (City Campus)</strong>
                Mantripukhri, Imphal<br />
                Manipur, India - 795002
              </address>
              
              {/* Map Link Button */}
              <a 
                href="https://maps.google.com" 
                target="_blank"
                className="inline-block mt-8 px-6 py-3 border border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-charcoal transition-all"
              >
                View on Google Maps
              </a>
            </div>

            {/* Right: The Massive Email */}
            <div className="text-right">
              <span className="block text-[10px] uppercase tracking-widest opacity-40 mb-4">General Enquiries</span>
              <a 
                href="mailto:icaiac@iiitmanipur.ac.in" 
                className="block font-serif text-[6vw] md:text-[5vw] leading-none text-white hover:text-gold transition-colors duration-300"
              >
                icaiac@iiitmanipur.ac.in
              </a>
            </div>

          </div>
        </div>

        {/* SECTION 3: COPYRIGHT */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-20 pt-8 border-t border-white/5 text-[10px] uppercase tracking-widest opacity-30 font-sans">
          <span>© 2026 ICAIAC. All Rights Reserved.</span>
          <span className="mt-4 md:mt-0">Organized by Dept. of CSE, IIIT Manipur</span>
        </div>

      </div>

      {/* Glow Effect */}
      <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

    </footer>
  );
}