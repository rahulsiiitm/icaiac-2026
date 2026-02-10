"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SPEAKERS = [
  {
    name: "Prof. Jey Veeraswamy",
    role: "University of Texas at Dallas",
    image: "/images/speaker1.png", // Placeholder path
  },
  {
    name: "Prof. Tamil Laxman",
    role: "University of Texas at Dallas",
    image: "/images/speaker2.png",
  },
  {
    name: "Prof. Virach Sornlertlamvanich",
    role: "Musashino University, Japan",
    image: "/images/speaker3.png",
  },
  {
    name: "Prof. Naveen Garg",
    role: "IIT Delhi, India",
    image: "/images/speaker4.webp",
  },
];

export default function Keynotes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal of the cards
      gsap.fromTo(
        ".speaker-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-32 px-6 md:px-12 bg-cream-100 text-charcoal overflow-hidden"
    >
      {/* HEADER */}
      <div className="text-center mb-20">
        <span className="block font-sans text-gold text-sm tracking-[0.2em] uppercase mb-4">
          Thought Leaders
        </span>
        <h2 className="font-serif text-5xl md:text-7xl">Keynote Speakers</h2>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {SPEAKERS.map((speaker, idx) => (
          <div
            key={idx}
            className="speaker-card group relative flex flex-col items-center text-center cursor-pointer"
          >
            {/* PORTRAIT CONTAINER */}
            <div className="relative w-full aspect-3/4 overflow-hidden mb-8 bg-charcoal/5">
              {/* Image Layer */}
              <div className="absolute inset-0 transition-all duration-700 ease-out group-hover:scale-105">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                />
              </div>

              {/* Overlay Gradient (subtle darkening at bottom for text readability if needed) */}
              <div className="absolute inset-0 bg-linear-to-t from-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
              {/* Gold Border Reveal */}
              <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/50 transition-colors duration-500 scale-95 group-hover:scale-100" />
            </div>

            {/* INFO */}
            <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
              <h3 className="font-serif text-2xl md:text-3xl leading-tight mb-2 group-hover:text-charcoal transition-colors">
                {speaker.name}
              </h3>
              <p className="font-sans text-sm font-bold text-gold tracking-widest uppercase opacity-80 group-hover:opacity-100">
                {speaker.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}