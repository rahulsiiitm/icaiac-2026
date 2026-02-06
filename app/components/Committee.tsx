"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Data Placeholders (You will fill these with real names)
const CHIEFS = [
  { role: "Chief Patron", name: "Prof. T. G. Sitharam", title: "Chairman, AICTE" },
  { role: "Patron", name: "Prof. Krishnan Baskar", title: "Director, IIIT Manipur" },
  { role: "Honorary Chair", name: "Prof. S. G. Deshmukh", title: "IIT Delhi" },
];

const ADVISORY = [
  "Prof. Rajkumar Buyya, Univ of Melbourne",
  "Prof. H. Raghav Rao, UT San Antonio",
  "Prof. Schahram Dustdar, TU Wien",
  "Prof. Yi Pan, Georgia State Univ",
  "Prof. Mukesh Singhal, UC Merced",
  "Prof. X. Z. Gao, UEF Finland",
  "Prof. P. Nagabhushan, Vignan Univ",
  "Prof. R. B. Bhey, NIT Agartala",
];

export default function Committee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"advisory" | "technical">("advisory");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Chief Cards
      gsap.fromTo(
        ".chief-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
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
      id="committee" // ID for Navbar scrolling
      className="relative w-full py-32 bg-white border-t border-charcoal/5"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-20">
          <span className="block font-sans text-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">
            Leadership
          </span>
          <h2 className="font-serif text-charcoal text-5xl md:text-6xl">
            Organizing Committee
          </h2>
        </div>

        {/* TIER 1: THE CHIEFS (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {CHIEFS.map((person, i) => (
            <div 
              key={i} 
              className="chief-card group p-8 bg-cream-100/30 border border-charcoal/5 text-center hover:border-gold/50 transition-colors duration-500 rounded-sm"
            >
              <span className="block font-sans text-[10px] uppercase tracking-widest text-gold mb-4">
                {person.role}
              </span>
              <h3 className="font-serif text-2xl text-charcoal mb-2 group-hover:text-gold transition-colors">
                {person.name}
              </h3>
              <p className="font-sans text-xs text-charcoal/60 leading-relaxed uppercase tracking-wide">
                {person.title}
              </p>
            </div>
          ))}
        </div>

        {/* TIER 2: LISTS (Tabs) */}
        <div className="max-w-4xl mx-auto">
          
          {/* Tabs Navigation */}
          <div className="flex justify-center gap-8 mb-12 border-b border-charcoal/10 pb-4">
            <button 
              onClick={() => setActiveTab("advisory")}
              className={`font-serif text-xl md:text-2xl transition-colors duration-300 ${activeTab === "advisory" ? "text-charcoal" : "text-charcoal/30 hover:text-charcoal/60"}`}
            >
              Advisory Board
            </button>
            <span className="text-charcoal/10 text-2xl">/</span>
            <button 
              onClick={() => setActiveTab("technical")}
              className={`font-serif text-xl md:text-2xl transition-colors duration-300 ${activeTab === "technical" ? "text-charcoal" : "text-charcoal/30 hover:text-charcoal/60"}`}
            >
              Technical Committee
            </button>
          </div>

          {/* List Content */}
          <div className="min-h-[300px] transition-opacity duration-500">
            {activeTab === "advisory" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 animate-fadeIn">
                {ADVISORY.map((name, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-charcoal/5">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                    <span className="font-sans text-sm text-charcoal/80">{name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 animate-fadeIn">
                <p className="font-sans text-charcoal/50 italic">
                  Technical Program Committee members to be announced shortly.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
      
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}