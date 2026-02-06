export default function Downloads() {
  return (
    <div className="w-full bg-charcoal border-y border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl text-white mb-2">Author Resources</h3>
            <p className="font-sans text-white/50 text-sm">Download official templates for your submission.</p>
        </div>

        <div className="flex gap-4">
            <DownloadButton label="Microsoft Word Template" icon="DOCX" />
            <DownloadButton label="LaTeX Template" icon="TEX" />
        </div>

      </div>
    </div>
  )
}

function DownloadButton({ label, icon }: { label: string, icon: string }) {
    return (
        <button className="group flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 hover:bg-gold hover:border-gold hover:text-charcoal transition-all duration-300 rounded-sm">
            <span className="font-bold text-xs tracking-wider text-white group-hover:text-charcoal opacity-50 group-hover:opacity-100">{icon}</span>
            <span className="font-sans text-sm text-white group-hover:text-charcoal font-medium">{label}</span>
        </button>
    )
}