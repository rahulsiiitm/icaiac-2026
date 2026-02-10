"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Currency = "INR" | "USD";

const PRICING = {
  INR: {
    student: { early: "₹5,000", regular: "₹6,500" },
    professional: { early: "₹8,000", regular: "₹10,500" }, // Faculty & Industry combined
    attendee: { early: "₹4,000", regular: "₹5,000" },
  },
  USD: {
    student: { early: "$120", regular: "$170" },
    professional: { early: "$250", regular: "$300" },
    attendee: { early: "$80", regular: "$130" },
  },
};

export default function Registration() {
  const [currency, setCurrency] = useState<Currency>("INR");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".price-card",
        { y: 30, opacity: 0 }, // Reduced Y distance for snappier feel
        {
          y: 0,
          opacity: 1,
          duration: 0.8, // Faster duration
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%", // Triggers sooner (when top of section hits bottom 15% of screen)
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-charcoal text-cream-100 overflow-hidden">

      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-150 h-150 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">

        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="block font-sans text-gold text-xs font-bold tracking-[0.2em] uppercase mb-6">
            Secure Your Spot
          </span>
          <h2 className="font-serif text-5xl md:text-7xl mb-8 text-white">
            Registration
          </h2>

          {/* CURRENCY TOGGLE */}
          <div className="inline-flex items-center bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${currency === "INR" ? "bg-gold text-charcoal shadow-lg" : "text-white/50 hover:text-white"
                }`}
            >
              INDIA / SAARC
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${currency === "USD" ? "bg-gold text-charcoal shadow-lg" : "text-white/50 hover:text-white"
                }`}
            >
              INTERNATIONAL
            </button>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">

          {/* CARD 1: STUDENT */}
          <PricingCard
            title="Student Author"
            prices={PRICING[currency].student}
            features={["Full Conference Access", "Paper Presentation", "Conference Kit", "Certificate"]}
          />

          {/* CARD 2: PROFESSIONAL (Featured) */}
          <PricingCard
            title="Faculty & Industry"
            prices={PRICING[currency].professional}
            features={["Full Conference Access", "Paper Presentation", "Networking Gala", "Scopus Publication"]}
            featured
          />

          {/* CARD 3: ATTENDEE */}
          <PricingCard
            title="Non-Author"
            prices={PRICING[currency].attendee}
            features={["Access to Sessions", "Networking Events", "Certificate", "No Presentation"]}
          />

        </div>

        {/* FOOTNOTE */}
        <p className="mt-16 font-sans text-white/30 text-sm max-w-2xl text-center leading-relaxed">
          *Registration fee covers conference kit, lunch, and high tea.
          Accommodation is not included. One author must register to ensure paper publication.
        </p>

      </div>
    </section>
  );
}

// SUB-COMPONENT: The "Pass" Card
function PricingCard({ title, prices, features, featured = false }: any) {
  return (
    <div className={`price-card relative p-8 md:p-10 flex flex-col justify-start group
      ${featured ? 'bg-cream-100 text-charcoal border-none' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}
      transition-all duration-500 rounded-sm overflow-hidden h-full
    `}>

      {/* Decorative 'Holographic' Gradient for non-featured cards */}
      {!featured && (
        <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      )}

      <div>
        <h3 className={`font-serif text-3xl mb-2 ${featured ? 'text-charcoal' : 'text-white'}`}>{title}</h3>
        <div className="w-12 h-px bg-gold mb-8" />

        {/* PRICES */}
        <div className="space-y-6 mb-10">
          <div>
            <span className="block text-[10px] uppercase tracking-widest opacity-60 mb-1">Early Bird</span>
            <span className={`text-4xl font-serif ${featured ? 'text-charcoal' : 'text-white'}`}>{prices.early}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-widest opacity-60 mb-1">Regular</span>
            <span className={`text-2xl font-serif opacity-70 ${featured ? 'text-charcoal' : 'text-white'}`}>{prices.regular}</span>
          </div>
        </div>

        {/* FEATURES */}
        <ul className="space-y-3">
          {features.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-sm font-sans opacity-80">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${featured ? 'bg-gold' : 'bg-white/40'}`} />
              {item}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}