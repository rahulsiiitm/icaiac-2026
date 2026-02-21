"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, Twitter, Globe, MapPin, Mail } from "lucide-react"; 
import Image from "next/image"; 

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-reveal",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 95%",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={containerRef} className="relative w-full bg-charcoal text-cream-100 pt-16 pb-8 overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="col-span-1 md:col-span-4 footer-reveal">
            
            <div className="relative w-12 h-12 mb-6 opacity-80">
                <Image src="/images/logo.png" alt="ICAIAC Logo" fill className="object-contain" />
            </div>

            <span className="block font-sans text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Leadership</span>
            <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight">Organizing <br /> Committee</h2>

            {/* SOCIAL LINKS - Set to # placeholders as requested */}
            <div className="flex gap-5 mt-6">
              <a href="#" className="text-white/50 hover:text-gold transition-colors" title="Instagram (Coming Soon)">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-white/50 hover:text-gold transition-colors" title="Twitter/X (Coming Soon)">
                <Twitter size={18} />
              </a>
              <a href="https://www.iiitmanipur.ac.in/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-gold transition-colors" title="IIIT Manipur Website">
                <Globe size={18} />
              </a>
            </div>
          </div>

          <div className="col-span-1 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="footer-reveal border-l border-white/10 pl-5">
              <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Convenor</span>
              <h3 className="font-serif text-lg text-white">Dr. N. Kishorjit Singh</h3>
              <p className="font-sans text-[10px] opacity-60 mt-0.5">Dept. of CSE, IIIT Manipur</p>
            </div>
            <div className="footer-reveal border-l border-white/10 pl-5">
              <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Co-Convenor</span>
              <h3 className="font-serif text-lg text-white">Dr. K. Motilal Singh</h3>
              <p className="font-sans text-[10px] opacity-60 mt-0.5">Dept. of CSE, IIIT Manipur</p>
            </div>
            <div className="footer-reveal border-l border-white/10 pl-5">
              <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Chief Patron</span>
              <h3 className="font-serif text-lg text-white">Director</h3>
              <p className="font-sans text-[10px] opacity-60 mt-0.5">IIIT Manipur</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 pb-8 footer-reveal">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div>
              <span className="block font-sans text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Contact Us</span>
              <address className="font-sans text-white/60 not-italic text-sm leading-relaxed max-w-sm">
                <strong className="text-white block mb-1">IIIT Manipur (City Campus)</strong>
                Mantripukhri, Imphal<br />
                Manipur, India - 795002
              </address>
              <a href="https://maps.google.com/maps?q=IIIT%20Manipur,%20Mantripukhri,%20Imphal" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-charcoal transition-all">
                <MapPin size={12} /> View on Google Maps
              </a>
            </div>

            <div className="text-right">
              <span className="block text-[10px] uppercase tracking-widest opacity-40 mb-2">General Enquiries</span>
              {/* UPDATED EMAIL ADDRESS HERE */}
              <a href="mailto:icaiac2026@iiitmanipur.ac.in" className="group flex items-center justify-end gap-3 font-serif text-2xl md:text-4xl leading-none text-white hover:text-gold transition-colors duration-300">
                <Mail className="w-6 h-6 md:w-8 md:h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                icaiac2026@iiitmanipur.ac.in
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-6 border-t border-white/5 text-[10px] uppercase tracking-widest opacity-30 font-sans">
          <span>© 2026 ICAIAC. All Rights Reserved.</span>
          <span className="mt-2 md:mt-0">Organized by Dept. of CSE, IIIT Manipur</span>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-75 h-75 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
    </footer>
  );
}