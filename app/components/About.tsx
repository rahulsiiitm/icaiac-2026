"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text Reveal
      gsap.fromTo(
        ".about-text",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );

      // Cards Stagger
      gsap.fromTo(
        ".objective-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const objectives = [
    { title: "Global Collaboration", desc: "Foster research partnerships across AI & Computing." },
    { title: "Creative Solutions", desc: "Solve unresolved challenges in Electronics & Comm." },
    { title: "Academic Excellence", desc: "Support professional development of participants." },
    { title: "Publication", desc: "Identify & publish quality papers in Scopus journals." },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full py-32 px-6 md:px-20 bg-cream-100 text-charcoal overflow-hidden"
    >
      {/* BACKGROUND WATERMARK (Fills the empty space) */}
      <div className="absolute top-10 right-0 font-serif text-[20vw] leading-none text-charcoal/5 pointer-events-none select-none z-0">
        2026
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* ROW 1: VISION & CONTEXT */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24">
          
          {/* LEFT: Headline */}
          <div className="lg:w-1/3 shrink-0 about-text">
            <span className="block font-sans text-gold text-sm tracking-[0.2em] uppercase mb-4">
              About The Conference
            </span>
            <h2 className="font-serif text-5xl md:text-6xl leading-[1.1] text-charcoal">
              Pioneering <br /> The Future <br />
              <span className="italic text-charcoal-light opacity-60">of AI</span>
            </h2>
            
            {/* Hosted By Badge */}
            <div className="mt-10 flex items-center gap-4 p-4 border border-charcoal/10 rounded-sm bg-white/50 backdrop-blur-sm">
                <div className="w-12 h-12 bg-charcoal text-white flex items-center justify-center font-serif text-xl rounded-full">M</div>
                <div>
                    <span className="block text-[10px] uppercase tracking-widest opacity-60">Hosted By</span>
                    <span className="font-serif text-lg leading-none">IIIT Manipur</span>
                </div>
            </div>
          </div>

          {/* RIGHT: Main Text */}
          <div className="lg:w-2/3 space-y-8 about-text">
            <p className="font-sans text-xl md:text-2xl font-light leading-relaxed text-charcoal">
              The <strong className="font-semibold">1st International Conference on Artificial Intelligence and Advanced Computing (ICAIAC 2026)</strong> serves as a global catalyst for interdisciplinary research.
            </p>
            <div className="flex flex-col md:flex-row gap-8 pt-4">
                <div className="flex-1">
                    <p className="text-charcoal/70 leading-relaxed text-sm md:text-base">
                        This conference provides a dynamic platform for researchers, academicians, and industry experts to exchange ideas, present innovations, and explore emerging trends in AI, Machine Learning, and Advanced Computing.
                    </p>
                </div>
                <div className="flex-1">
                    <p className="text-charcoal/70 leading-relaxed text-sm md:text-base">
                        We emphasize domains like <span className="text-charcoal font-medium border-b border-gold/30">Deep Learning, Wireless Computing, and Information Security</span>, bridging the gap between theoretical research and practical implementation.
                    </p>
                </div>
            </div>
          </div>
        </div>

        {/* ROW 2: OBJECTIVES GRID (Fills the bottom) */}
        <div ref={cardsRef}>
            <div className="flex items-end justify-between mb-8 border-b border-charcoal/10 pb-4">
                <h3 className="font-serif text-3xl text-charcoal">Core Objectives</h3>
                <span className="hidden md:block font-sans text-xs uppercase tracking-widest opacity-50">Driving Innovation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {objectives.map((obj, i) => (
                    <div key={i} className="objective-card group p-8 bg-white border border-charcoal/5 hover:border-gold/50 transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-lg rounded-sm">
                        <span className="block font-serif text-4xl text-charcoal/10 group-hover:text-gold/20 mb-4 transition-colors">
                            0{i + 1}
                        </span>
                        <h4 className="font-serif text-xl text-charcoal mb-3 group-hover:text-gold transition-colors">
                            {obj.title}
                        </h4>
                        <p className="font-sans text-sm text-charcoal/60 leading-relaxed">
                            {obj.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* ROW 3: HIGHLIGHT BAR */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-charcoal/10 border-t border-charcoal/10 pt-8 about-text">
            <HighlightBox label="Mode" value="Physical Presentation" />
            <HighlightBox label="Indexing" value="Scopus & IEEE" />
            <HighlightBox label="Location" value="Imphal, India" />
        </div>

      </div>
    </section>
  );
}

function HighlightBox({ label, value }: { label: string, value: string }) {
    return (
        <div className="px-6 py-4 text-center">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-gold mb-2">{label}</span>
            <span className="font-serif text-xl text-charcoal">{value}</span>
        </div>
    )
}