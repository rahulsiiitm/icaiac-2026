"use client";

import Image from "next/image";
import Link from "next/link";

const PARTNERS = [
  { name: "Conference Alert", url: "https://www.conferencealert.com/", logo: "/images/partners/conference-alert.png" },
  { name: "Conference Alerts Net", url: "https://conferencealerts.net/", logo: "/images/partners/conference-alerts-net.png" },
  { name: "Conference In Europe", url: "https://www.conferenceineurope.org/", logo: "/images/partners/conference-in-europe.png" },
  { name: "Conference Alerts In", url: "https://www.conferencealerts.in/", logo: "/images/partners/conference-alerts-in.png" },
];

// Duplicate exactly twice: animation goes to -50% which covers exactly one set
const MARQUEE_ITEMS = [...PARTNERS, ...PARTNERS];

export default function Partners() {
  return (
    <section className="w-full py-20 bg-cream-100 border-t border-charcoal/5 overflow-hidden">
      <div className="text-center mb-12">
        <span className="block font-sans text-gold text-xs font-bold tracking-[0.2em] uppercase opacity-80">
          Supported By
        </span>
        <h2 className="font-serif text-charcoal text-3xl md:text-4xl mt-4">
          Media & Academic Partners
        </h2>
      </div>

      <div
        className="relative w-full flex overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex animate-marquee items-center whitespace-nowrap">
          {MARQUEE_ITEMS.map((partner, i) => (
            <div
              key={i}
              className="mx-12 md:mx-20 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
            >
              <Link href={partner.url} target="_blank" rel="noopener noreferrer">
                <div className="relative w-48 h-24">
                  <Image src={partner.logo} alt={partner.name} fill className="object-contain" />
                </div>
              </Link>
            </div>
          ))}
        </div>

        <style jsx>{`
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </section>
  );
}