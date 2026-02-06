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
      // 1. Hexagon Animation
      gsap.fromTo(
        ".hexagon-wrapper",
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          stagger: { amount: 0.4, from: "center" },
          ease: "elastic.out(1, 0.7)", // Elastic bounce for a "pop" effect
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%", // Trigger slightly earlier
          },
        }
      );

      // 2. Bento Grid Animation
      gsap.fromTo(
        ".bento-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: detailsRef.current,
            start: "top 85%",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-20 bg-cream-100 flex flex-col items-center overflow-hidden">
      
      {/* HEADER */}
      <div className="text-center mb-8 relative z-10 px-4">
        <span className="block font-sans text-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">
          Areas of Research
        </span>
        <h2 className="font-serif text-charcoal text-4xl md:text-6xl mb-4">
          Conference Tracks
        </h2>
        <p className="font-sans text-charcoal/60 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
          Exploring the frontiers of Artificial Intelligence and Advanced Computing.
        </p>
      </div>

      {/* HONEYCOMB CONTAINER 
          FIX: Adjusted height to 600px and removed negative margins to prevent clipping 
      */}
      <div className="relative w-[1100px] h-[600px] scale-[0.45] md:scale-75 lg:scale-90 origin-center z-10 my-4 md:my-0">
        
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

      {/* BENTO GRID DETAILS */}
      <div ref={detailsRef} className="relative z-20 max-w-6xl mx-auto px-6 mt-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* CARD 1: SUBMISSION */}
            <div className="bento-card col-span-1 md:col-span-4 bg-white border border-charcoal/5 p-8 flex flex-col justify-between hover:border-charcoal/20 transition-colors duration-300 shadow-sm">
                <div>
                    <h3 className="font-serif text-2xl text-charcoal mb-6">Submission</h3>
                    <ul className="space-y-4 font-sans text-charcoal/80 text-sm">
                        <li className="flex gap-3">
                            <span className="text-gold font-bold">01.</span>
                            <span>Papers must follow the <strong>IEEE Double-Column</strong> format.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-gold font-bold">02.</span>
                            <span>Submissions follow a strict <strong>Double-Blind</strong> review process.</span>
                        </li>
                    </ul>
                </div>
                <button className="mt-8 w-full py-3 border border-charcoal/10 text-xs font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all duration-300">
                    Download Template
                </button>
            </div>

            {/* CARD 2: PUBLICATION */}
            <div className="bento-card col-span-1 md:col-span-4 bg-charcoal text-cream-100 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold/5 scale-0 group-hover:scale-100 rounded-full blur-3xl transition-transform duration-700" />
                <span className="relative z-10 block font-serif text-5xl mb-2 text-gold">Sc</span>
                <h3 className="relative z-10 font-serif text-2xl mb-4">Scopus Indexed</h3>
                <p className="relative z-10 font-sans text-cream-100/70 text-sm leading-relaxed mb-6">
                    Accepted papers will be submitted for indexing in Scopus and IEEE Xplore.
                </p>
                <div className="relative z-10 px-4 py-1 border border-white/20 rounded-full text-[10px] uppercase tracking-widest">
                    Peer Reviewed
                </div>
            </div>

            {/* CARD 3: KEY DATES */}
            <div className="bento-card col-span-1 md:col-span-4 bg-white border border-charcoal/5 p-8 hover:border-charcoal/20 transition-colors duration-300 shadow-sm">
                <h3 className="font-serif text-2xl text-charcoal mb-6">Key Dates</h3>
                <div className="space-y-0">
                    <DateRow label="Paper Submission" date="April 1st, 2026" isLast={false} />
                    <DateRow label="Notification" date="June 1st, 2026" isLast={false} />
                    <DateRow label="Camera Ready" date="June 25th, 2026" isLast={false} />
                    <DateRow label="Conference" date="Aug 2-5, 2026" isLast={true} highlight />
                </div>
            </div>

        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.png')]"></div>
    </section>
  );
}

function DateRow({ label, date, isLast, highlight = false }: { label: string, date: string, isLast: boolean, highlight?: boolean }) {
    return (
        <div className={`flex justify-between items-center py-3 ${!isLast ? 'border-b border-charcoal/5' : ''}`}>
            <span className="font-sans text-xs uppercase tracking-wider text-charcoal/50">{label}</span>
            <span className={`font-serif text-lg ${highlight ? 'text-gold' : 'text-charcoal'}`}>{date}</span>
        </div>
    )
}

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
            strokeWidth="1.5"
            strokeOpacity="1" 
            className="transition-all duration-300 group-hover:strokeWidth-[3]"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center z-20">
          <span 
            className="font-serif text-5xl font-bold mb-3 transition-colors duration-300"
            style={{ color: track.borderColor, opacity: 0.15 }}
          >
            {track.id}
          </span>
          <p className="font-sans text-[10px] md:text-xs font-bold leading-relaxed text-charcoal uppercase tracking-widest opacity-100">
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