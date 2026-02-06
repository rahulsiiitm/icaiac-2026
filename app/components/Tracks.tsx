"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TRACKS = [
  { id: "1", title: "Networking & Security", borderColor: "#6B9BD1" },
  { id: "2", title: "IoT & Embedded Systems", borderColor: "#9B7EBD" },
  { id: "3", title: "Software Engineering", borderColor: "#E8A05D" },
  { id: "4", title: "NLP & HCI", borderColor: "#8FB569" },
  { id: "5", title: "AI/ML & Data Science", borderColor: "#D97BA6" }, // CENTER
  { id: "6", title: "Algorithms", borderColor: "#5DBED6" },
  { id: "7", title: "Signal Processing", borderColor: "#B86FA6" },
  { id: "8", title: "Big Data & Cloud", borderColor: "#C85A54" },
  { id: "9", title: "Emerging Tech", borderColor: "#5D8FA6" },
];

export default function Tracks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Honeycomb Animation
      gsap.fromTo(
        ".hexagon-wrapper",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.0,
          stagger: { amount: 0.4, from: "center" },
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );

      // 2. Details Fade Up
      gsap.fromTo(
        detailsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          scrollTrigger: {
            trigger: detailsRef.current,
            start: "top 90%",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-24 bg-cream-100 flex flex-col items-center overflow-hidden">
      
      {/* HEADER */}
      <div className="text-center mb-10 relative z-10 px-4">
        <span className="block font-sans text-gold text-xs md:text-sm tracking-[0.25em] uppercase mb-4 font-bold">
          Call for Papers
        </span>
        <h2 className="font-serif text-charcoal text-5xl md:text-7xl mb-6">
          Conference Tracks
        </h2>
        <p className="font-sans text-charcoal/60 max-w-2xl mx-auto text-lg leading-relaxed">
          Original research submissions are invited from global researchers, academicians, and industry innovators to explore breakthroughs in AI and advanced computing.
        </p>
      </div>

      {/* HONEYCOMB CONTAINER */}
      <div className="relative w-[1100px] h-[700px] scale-[0.35] md:scale-75 lg:scale-90 origin-center z-10 mt-[-20px] mb-[-100px] md:mb-[-50px]">
        
        {/* CENTER COLUMN */}
        <PositionHex track={TRACKS[0]} x={0} y={-230} />
        <PositionHex track={TRACKS[4]} x={0} y={0} />     
        <PositionHex track={TRACKS[8]} x={0} y={230} />   

        {/* LEFT COLUMN */}
        <PositionHex track={TRACKS[1]} x={-205} y={-115} /> 
        <PositionHex track={TRACKS[6]} x={-205} y={115} />  

        {/* RIGHT COLUMN */}
        <PositionHex track={TRACKS[2]} x={205} y={-115} />  
        <PositionHex track={TRACKS[7]} x={205} y={115} />   

        {/* FAR LEFT */}
        <PositionHex track={TRACKS[3]} x={-410} y={0} />    

        {/* FAR RIGHT */}
        <PositionHex track={TRACKS[5]} x={410} y={0} />     

      </div>

      {/* PUBLICATION & SUBMISSION DETAILS */}
      <div ref={detailsRef} className="relative z-20 max-w-6xl mx-auto px-6 mt-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* CARD 1: Submission */}
            <div className="p-8 bg-white/60 backdrop-blur-md border border-charcoal/5 rounded-sm">
                <h3 className="font-serif text-2xl text-charcoal mb-4">Submission Guidelines</h3>
                <ul className="space-y-3 font-sans text-charcoal/70 text-sm md:text-base">
                    <li className="flex items-start gap-3">
                        <span className="text-gold text-lg">›</span>
                        <span>Follow the <strong>IEEE Double-Column</strong> template.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-gold text-lg">›</span>
                        <span>Double-blind peer-review process (anonymized).</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-gold text-lg">›</span>
                        <span>Submit via <strong>Microsoft CMT</strong> portal.</span>
                    </li>
                </ul>
            </div>

            {/* CARD 2: Publication (Highlighted) */}
            <div className="p-8 bg-charcoal text-cream-100 border border-charcoal rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-8xl leading-none">Sc</div>
                <h3 className="font-serif text-2xl text-white mb-4">Publication & Indexing</h3>
                <p className="font-sans text-cream-100/80 mb-6 text-sm md:text-base leading-relaxed">
                    All accepted and presented papers will be submitted for indexing in <strong>Scopus</strong> and published in the conference proceedings.
                </p>
                <div className="inline-block px-4 py-2 border border-gold/50 rounded-full text-gold text-xs tracking-widest uppercase">
                    Scopus Indexed
                </div>
            </div>

            {/* CARD 3: Deadlines */}
            <div className="p-8 bg-white/60 backdrop-blur-md border border-charcoal/5 rounded-sm">
                <h3 className="font-serif text-2xl text-charcoal mb-4">Key Dates</h3>
                <div className="space-y-4 font-sans">
                    <div className="flex justify-between items-center border-b border-charcoal/10 pb-2">
                        <span className="text-charcoal/60 text-sm uppercase tracking-wide">Submission</span>
                        <span className="text-charcoal font-bold">April 1st, 2026</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-charcoal/10 pb-2">
                        <span className="text-charcoal/60 text-sm uppercase tracking-wide">Notification</span>
                        <span className="text-charcoal font-bold">June 1st, 2026</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-charcoal/60 text-sm uppercase tracking-wide">Registration</span>
                        <span className="text-charcoal font-bold">July 15th, 2026</span>
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.png')]"></div>
    </section>
  );
}

// ... PositionHex function remains exactly the same as before ...
function PositionHex({ track, x, y }: { track: typeof TRACKS[0]; x: number; y: number }) {
  return (
    <div
      className="hexagon-wrapper absolute group w-[260px] h-[225px] flex items-center justify-center cursor-pointer hover:z-50"
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
    >
      <div className="relative w-full h-full transition-all duration-300 ease-out group-hover:scale-[1.05] group-hover:drop-shadow-xl">
        
        <svg
          viewBox="0 0 260 225"
          className="absolute inset-0 w-full h-full drop-shadow-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`grad-${track.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          <polygon
            points="65,5 195,5 255,112.5 195,220 65,220 5,112.5"
            fill={`url(#grad-${track.id})`}
            className="transition-colors duration-500"
          />

          <polygon
            points="65,5 195,5 255,112.5 195,220 65,220 5,112.5"
            fill="none"
            stroke={track.borderColor}
            strokeWidth="2" 
            strokeOpacity="1" 
            className="transition-all duration-300 group-hover:strokeWidth-[3]"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center z-20">
          <span 
            className="font-serif text-5xl font-bold mb-3 transition-colors duration-300"
            style={{ color: track.borderColor, opacity: 0.25 }}
          >
            {track.id}
          </span>
          
          <p className="font-sans text-xs font-bold leading-relaxed text-charcoal uppercase tracking-wider opacity-100">
            {track.title}
          </p>

          <div 
            className="w-1.5 h-1.5 rounded-full mt-3 opacity-100"
            style={{ backgroundColor: track.borderColor }}
          />
        </div>
      </div>
    </div>
  );
}