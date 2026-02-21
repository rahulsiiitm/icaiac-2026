"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, Download, Calendar, AlertCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// --- 1. CONFIGURATION ---

const TRACKS = [
  { id: "1", title: "Cloud & Cybersecurity", borderColor: "#6B9BD1" },
  { id: "2", title: "IoT & Smart Systems", borderColor: "#9B7EBD" },
  { id: "3", title: "Software Engineering", borderColor: "#E8A05D" },
  { id: "4", title: "HCI & Robotics", borderColor: "#8FB569" },
  { id: "5", title: "AI & Machine Learning", borderColor: "#D4AF37" }, 
  { id: "6", title: "Data Science & Big Data", borderColor: "#5DBED6" },
  { id: "7", title: "Quantum Computing", borderColor: "#B86FA6" },
  { id: "8", title: "Blockchain & FinTech", borderColor: "#C85A54" },
  { id: "9", title: "Emerging Technologies", borderColor: "#5D8FA6" },
];

const DOWNLOAD_LINKS = {
  latex: "/Conferences%20Event/2026_conference/Template/conference_latex_template.zip",
  word: "/Conferences%20Event/2026_conference/Template/Conference_Templates_Word.zip",
  cmt: "https://cmt3.research.microsoft.com/User/Login?ReturnUrl=%2FICAIAC2026",
};

export default function Tracks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hexagon-wrapper",
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          stagger: { amount: 0.4, from: "center" },
          ease: "elastic.out(1, 0.7)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="tracks" ref={containerRef} className="relative w-full py-24 bg-charcoal flex flex-col items-center overflow-hidden">
      <HeaderSection />
      <div className="relative w-275 h-150 scale-[0.45] md:scale-75 lg:scale-90 origin-center z-10 my-4 md:my-0">
        <PositionHex track={TRACKS[0]} x={0} y={-230} />
        <PositionHex track={TRACKS[4]} x={0} y={0} />
        <PositionHex track={TRACKS[8]} x={0} y={230} />
        <PositionHex track={TRACKS[1]} x={-205} y={-115} />
        <PositionHex track={TRACKS[6]} x={-205} y={115} />
        <PositionHex track={TRACKS[2]} x={205} y={-115} />
        <PositionHex track={TRACKS[7]} x={205} y={115} />
        <PositionHex track={TRACKS[3]} x={-410} y={0} />
        <PositionHex track={TRACKS[5]} x={410} y={0} />
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-6 mt-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <SubmissionCard />
          <ScopusCard />
          <TimelineCard />
        </div>
      </div>
    </section>
  );
}

function HeaderSection() {
  return (
    <div className="text-center mb-12 relative z-10 px-4">
      <span className="block font-sans text-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">
        Areas of Research
      </span>
      <h2 className="font-serif text-white text-4xl md:text-6xl mb-6">
        Conference Tracks
      </h2>
      <p className="font-sans text-white/60 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
        Exploring the frontiers of Artificial Intelligence and Advanced Computing.
      </p>
    </div>
  );
}

function SubmissionCard() {
  return (
    <div className="bento-card col-span-1 md:col-span-4 bg-white/8 border border-gold/40 p-8 flex flex-col justify-between hover:border-gold hover:bg-white/10 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
      <div>
        <h3 className="font-serif text-2xl text-white mb-6">Submission Details</h3>
        <div className="bg-charcoal-dark/50 border-l-2 border-gold p-4 mb-6 rounded-r-sm">
          <p className="font-sans text-white/90 text-xs leading-relaxed">
            The <strong>Microsoft CMT</strong> service is used for managing the peer-reviewing process.
            Papers must not exceed <strong>10 pages</strong> (extra pages chargeable).
            Please strictly follow the <strong>Standard Double Column</strong> template.
          </p>
          <p className="font-sans text-gold text-xs font-bold mt-3 flex items-center gap-2">
            <AlertCircle size={12} />
            All presentations will be in Physical Mode.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <DownloadButton href={DOWNLOAD_LINKS.latex} label="Latex" />
        <DownloadButton href={DOWNLOAD_LINKS.word} label="Word" />
      </div>
      <div className="mt-3">
        <a
          href={DOWNLOAD_LINKS.cmt}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg w-full"
        >
          Submit via CMT <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

function ScopusCard() {
  return (
    <div className="bento-card col-span-1 md:col-span-4 bg-linear-to-br from-charcoal-light to-black border border-white/10 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gold/10 scale-0 group-hover:scale-100 rounded-full blur-3xl transition-transform duration-700" />
      <span className="relative z-10 block font-serif text-5xl mb-2 text-gold opacity-80">Sc</span>
      <h3 className="relative z-10 font-serif text-xl text-white mb-4">Scopus Indexed</h3>
      <p className="relative z-10 font-sans text-white/50 text-xs leading-relaxed mb-0">
        Accepted papers will be submitted for inclusion into Scopus indexed proceedings subject to meeting scope and quality requirements.
      </p>
    </div>
  );
}

function TimelineCard() {
  return (
    <div className="bento-card col-span-1 md:col-span-4 bg-white/3 border border-white/10 p-8 hover:border-gold/30 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="text-gold" size={24} />
        <h3 className="font-serif text-2xl text-white">Timeline</h3>
      </div>
      <div className="space-y-0">
        <DateRow label="Paper Submission" date="Apr 1, 2026" isLast={false} />
        <DateRow label="Notification" date="Jun 1, 2026" isLast={false} />
        <DateRow label="Camera-Ready" date="Jun 25, 2026" isLast={false} />
        <DateRow label="Early Registration" date="Jul 1, 2026" isLast={false} />
        <DateRow label="Final Registration" date="Jul 15, 2026" isLast={false} />
        <DateRow label="Conference" date="Aug 2-5, 2026" isLast={true} highlight />
      </div>
    </div>
  );
}

function DownloadButton({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 border border-white/30 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-charcoal transition-all">
      <Download size={14} /> {label}
    </a>
  );
}

function DateRow({ label, date, isLast, highlight = false }: { label: string, date: string, isLast: boolean, highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-3 ${!isLast ? 'border-b border-white/5' : ''}`}>
      <span className="font-sans text-xs uppercase tracking-wider text-white/40">{label}</span>
      <span className={`font-serif text-md ${highlight ? 'text-gold font-bold' : 'text-white'}`}>{date}</span>
    </div>
  );
}

function PositionHex({ track, x, y }: { track: typeof TRACKS[0]; x: number; y: number }) {
  return (
    <div className="hexagon-wrapper absolute group w-65 h-56.25 flex items-center justify-center cursor-pointer hover:z-50" style={{ left: "50%", top: "50%", transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}>
      <div className="relative w-full h-full transition-all duration-300 ease-out group-hover:scale-[1.05] group-hover:drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
        <svg viewBox="0 0 260 225" className="absolute inset-0 w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`grad-${track.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1A1A1A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#050505" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <polygon points="65,5 195,5 255,112.5 195,220 65,220 5,112.5" fill={`url(#grad-${track.id})`} className="transition-colors duration-500" />
          <polygon points="65,5 195,5 255,112.5 195,220 65,220 5,112.5" fill="none" stroke={track.borderColor} strokeWidth="1.5" strokeOpacity="0.5" className="transition-all duration-300 group-hover:strokeWidth-[3] group-hover:strokeOpacity-100" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center z-20">
          <span className="font-serif text-6xl font-bold mb-1 transition-colors duration-300 absolute top-6 opacity-10" style={{ color: track.borderColor }}>{track.id}</span>
          <p className="font-sans text-sm font-bold leading-tight text-white uppercase tracking-widest relative z-10 mt-6 drop-shadow-lg">{track.title}</p>
          <div className="w-1.5 h-1.5 rounded-full mt-3 opacity-80" style={{ backgroundColor: track.borderColor }} />
        </div>
      </div>
    </div>
  );
}