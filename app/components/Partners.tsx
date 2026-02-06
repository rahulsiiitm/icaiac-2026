"use client";

import Image from "next/image";

// Placeholder logos - In a real project, you would replace these with real partner logos
const PARTNERS = [
  "Partner One", "TechDaily", "AI World", "Science Today", 
  "Innovate 360", "Future Labs", "DeepMind Daily", "ComputeX"
];

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

      {/* MARQUEE CONTAINER */}
      <div className="relative w-full flex overflow-hidden mask-linear-fade">
        
        {/* SCROLLING TRACK (Duplicated for seamless loop) */}
        <div className="flex animate-marquee whitespace-nowrap">
          {[...PARTNERS, ...PARTNERS].map((partner, i) => (
            <div key={i} className="mx-8 md:mx-16 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
              {/* Replacing Image with stylized text for now. 
                  If you have logos, use <Image src="..." /> here. 
              */}
              <span className="font-serif text-3xl md:text-5xl text-charcoal whitespace-nowrap">
                {partner}
              </span>
            </div>
          ))}
        </div>

        {/* CSS for the Marquee Animation */}
        <style jsx>{`
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .mask-linear-fade {
             mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
        `}</style>
      </div>

    </section>
  );
}