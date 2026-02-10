"use client";

import { Download } from "lucide-react";

export default function Downloads() {
  return (
    <section className="w-full bg-charcoal border-y border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl text-white mb-2">Author Resources</h3>
            <p className="font-sans text-white/50 text-sm">Download official templates for your submission.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
            <DownloadButton 
              label="Microsoft Word Template" 
              type="DOCX" 
              href="/Conferences%20Event/2026_conference/Template/Conference_Templates_Word.zip" 
            />
            <DownloadButton 
              label="LaTeX Template" 
              type="TEX" 
              href="/Conferences%20Event/2026_conference/Template/conference_latex_template.zip" 
            />
        </div>

      </div>
    </section>
  )
}

function DownloadButton({ label, type, href }: { label: string, type: string, href: string }) {
    return (
        <a 
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 hover:bg-gold hover:border-gold hover:text-charcoal transition-all duration-300 rounded-sm cursor-pointer"
        >
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-charcoal/10 transition-colors">
                <Download size={18} className="text-gold group-hover:text-charcoal" />
            </div>
            <div className="text-left">
                <span className="block font-bold text-[10px] tracking-widest text-white/40 group-hover:text-charcoal/60 transition-colors uppercase">
                    {type}
                </span>
                <span className="block font-sans text-sm text-white group-hover:text-charcoal font-medium">
                    {label}
                </span>
            </div>
        </a>
    )
}