"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

type Currency = "INR" | "USD";

const PRICING = {
  INR: {
    student: { early: "₹5,000", regular: "₹6,500" },
    professional: { early: "₹8,000", regular: "₹10,500" },
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
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-charcoal text-cream-100 overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-150 h-150 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        <div className="text-center mb-16">
          <span className="block font-sans text-gold text-xs font-bold tracking-[0.2em] uppercase mb-6">Secure Your Spot</span>
          <h2 className="font-serif text-5xl md:text-7xl mb-8 text-white">Registration</h2>
          <div className="inline-flex items-center bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
            <button onClick={() => setCurrency("INR")} className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${currency === "INR" ? "bg-gold text-charcoal shadow-lg" : "text-white/50 hover:text-white"}`}>INDIA / SAARC</button>
            <button onClick={() => setCurrency("USD")} className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${currency === "USD" ? "bg-gold text-charcoal shadow-lg" : "text-white/50 hover:text-white"}`}>INTERNATIONAL</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <PricingCard
            title="Student Author"
            prices={PRICING[currency].student}
            features={["Full Conference Access", "Paper Presentation", "Conference Kit", "Certificate"]}
          />
          <PricingCard
            title="Faculty & Industry"
            prices={PRICING[currency].professional}
            features={["Full Conference Access", "Paper Presentation", "Conference Kit", "Certificate", "Networking Gala"]}
            featured
          />
          <PricingCard
            title="Non-Author"
            prices={PRICING[currency].attendee}
            features={["Access to Sessions", "Networking Events", "Certificate", "No Presentation"]}
          />
        </div>

        <p className="mt-16 font-sans text-white/30 text-sm max-w-2xl text-center leading-relaxed">
          * The registration fee covers the conference kit, lunch, and high tea. 
          Accommodation is not included. At least one author per paper must register to ensure publication.
        </p>
      </div>
    </section>
  );
}

interface PricingCardProps {
  title: string;
  prices: { early: string; regular: string; };
  features: string[];
  featured?: boolean;
}

function PricingCard({ title, prices, features, featured = false }: PricingCardProps) {
  return (
    <div className={`price-card relative p-8 md:p-10 flex flex-col justify-start group ${featured ? 'bg-cream-100 text-charcoal border-none' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'} transition-all duration-500 rounded-sm overflow-hidden h-full`}>
      {!featured && <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />}
      
      {/* Logo Watermark on Card */}
      <div className="absolute top-6 right-6 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <Image src="/images/logo.png" alt="" fill className="object-contain grayscale" />
      </div>

      <div className="relative z-10">
        <h3 className={`font-serif text-3xl mb-2 ${featured ? 'text-charcoal' : 'text-white'}`}>{title}</h3>
        <div className="w-12 h-px bg-gold mb-8" />
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