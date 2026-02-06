"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Awards() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".award-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
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
    <section ref={containerRef} className="relative w-full py-24 bg-white border-t border-charcoal/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header aligned Left to match standard reading flow if preferred, or Center for premium look. 
            Keeping Center for consistency with Keynotes. */}
        <div className="text-center mb-16">
          <span className="block font-sans text-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">
            Recognition
          </span>
          <h2 className="font-serif text-charcoal text-4xl md:text-5xl">
            Awards & Certificates
          </h2>
        </div>

        {/* 3-COLUMN GRID (Same alignment as Keynotes/Pricing) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
          
          {/* Item 1 */}
          <div className="award-item p-8 bg-cream-100/50 border border-charcoal/5 rounded-sm hover:border-gold/50 transition-colors duration-300">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="font-serif text-2xl text-charcoal mb-3">Best Paper Awards</h3>
            <p className="font-sans text-charcoal/70 text-sm leading-relaxed">
              Awarded to the most impactful research contribution across each track, selected by the technical committee.
            </p>
          </div>

          {/* Item 2 */}
          <div className="award-item p-8 bg-cream-100/50 border border-charcoal/5 rounded-sm hover:border-gold/50 transition-colors duration-300">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="font-serif text-2xl text-charcoal mb-3">Young Researcher</h3>
            <p className="font-sans text-charcoal/70 text-sm leading-relaxed">
              Special recognition for outstanding innovation from authors under the age of 30.
            </p>
          </div>

          {/* Item 3 */}
          <div className="award-item p-8 bg-cream-100/50 border border-charcoal/5 rounded-sm hover:border-gold/50 transition-colors duration-300">
            <div className="text-4xl mb-4">📜</div>
            <h3 className="font-serif text-2xl text-charcoal mb-3">Participation</h3>
            <p className="font-sans text-charcoal/70 text-sm leading-relaxed">
              Official Certificates of Participation will be issued to all registered attendees and presenters.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}