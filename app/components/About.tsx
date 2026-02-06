"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the text block sliding up gently
      gsap.fromTo(
        textRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%", // Triggers slightly earlier for better flow
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const objectives = [
    "To promote research by sharing innovative ideas among all levels of scientific and civil community.",
    "To provide opportunities for multi-stakeholders to develop creative solutions to unresolved challenges in research and implementation under various domains of Computer/Electronics/Communication Engineering.",
    "Foster global collaboration in AI and advanced computing research.",
    "Enhance visibility of IIIT Manipur at national and international levels.",
    "Support academic and professional development of participants.",
    "To identify and publish the selected quality papers in Scopus Index Journals."
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full py-32 px-6 md:px-20 bg-cream-100 text-charcoal overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* LEFT COLUMN: The Headline */}
        <div className="lg:w-1/3 shrink-0">
          <span className="block font-sans text-gold text-sm tracking-[0.2em] uppercase mb-4">
            About ICAIAC
          </span>
          <h2 className="font-serif text-5xl md:text-7xl leading-[1.1] text-charcoal">
            The Vision <br />
            <span className="italic text-charcoal-light opacity-60">for 2026</span>
          </h2>
          {/* Decorative Line */}
          <div className="w-24 h-[1px] bg-charcoal/20 mt-12" />
          
          {/* Physical Mode Callout - Highlighting this important note */}
          <div className="mt-12 p-6 border border-charcoal/10 bg-white/40 backdrop-blur-sm rounded-sm">
            <p className="font-serif text-xl italic text-charcoal">
              "All presentations will be in physical mode so that there will be an ecosystem to interact among the researchers."
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: The Content */}
        <div ref={textRef} className="lg:w-2/3 font-sans text-lg leading-relaxed text-charcoal-light space-y-8">
          
          {/* Paragraph 1 */}
          <p>
            The <strong className="text-charcoal">International Conference on Artificial Intelligence and Advanced Computing (ICAIAC 2026)</strong> is expected to serve as a catalyst for academic excellence, global collaboration, and interdisciplinary research in the field of computer science. This conference will provide a dynamic platform for researchers, academicians, and industry experts to exchange ideas, present innovations, and explore emerging trends in AI and advanced computing technologies.
          </p>
          
          {/* Paragraph 2 */}
          <p>
            In addition, this international conference will provide a platform for researchers, practitioners, and technologists to present and discuss the recent trends, innovations, and practical challenges in the fields of <span className="text-charcoal font-medium">Computer Science, Electronics, and Communication Engineering</span>, emphasizing domains like Artificial Intelligence, Machine Learning, Audio and Speech Processing, Software Architecture, Deep Learning, Wireless Computing, Computer Networking, and Information Security.
          </p>
          
          {/* Objectives List */}
          <div className="pt-8">
            <h3 className="font-serif text-2xl text-charcoal mb-6">Main Objectives</h3>
            <ul className="space-y-6">
              {objectives.map((item, i) => (
                <li key={i} className="flex items-start gap-5 group">
                  {/* Custom Gold Bullet */}
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0 group-hover:scale-150 transition-transform duration-300" />
                  <span className="text-base md:text-lg leading-relaxed border-b border-transparent group-hover:border-gold/30 transition-colors duration-300 pb-1">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}