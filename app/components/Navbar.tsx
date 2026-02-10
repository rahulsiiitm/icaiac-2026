"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null); // Ref to track the nav container

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // We use this to close the menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const navLinks = [
    { name: "ABOUT", href: "/#about", hasDropdown: false },
    { 
      name: "COMMITTEE", 
      href: "#", // Placeholder
      hasDropdown: true,
      submenu: [
        { name: "Organizing Committee", href: "/committee/organizing" },
        { name: "Advisory Committee", href: "/committee/advisory" },
        { name: "Technical Committee", href: "/committee/technical" },
      ]
    },
    { name: "FOR AUTHORS", href: "/#tracks", hasDropdown: false },
    { name: "KEYNOTE SPEAKERS", href: "/#keynotes", hasDropdown: false },
    { name: "REGISTRATION", href: "/#registration", hasDropdown: false },
    { name: "CONTACT", href: "/#venue", hasDropdown: false },
  ];

  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-center pointer-events-none">
        <div 
            ref={navRef} // Attach ref here
            className="pointer-events-auto bg-charcoal/90 backdrop-blur-md border border-white/10 rounded-full px-8 py-3 flex items-center gap-8 shadow-2xl"
        >
          
          <Link 
            href="/" 
            className="font-serif text-white font-bold text-lg cursor-pointer"
            onClick={handleLinkClick}
          >
            ICAIAC <span className="text-gold">26</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasDropdown ? (
                  // DROPDOWN TOGGLE BUTTON
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                    className="group flex items-center gap-1 font-sans text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                    <svg 
                      className={`w-3 h-3 opacity-70 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180 text-gold' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  // STANDARD LINK (Uses Next.js Link)
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className="group flex items-center gap-1 font-sans text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                )}

                {/* DROPDOWN MENU */}
                {link.hasDropdown && activeDropdown === link.name && (
                  <div className="absolute top-full mt-2 bg-charcoal/95 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden min-w-[200px] shadow-xl">
                    {link.submenu?.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href} // This links to the actual pages now
                        onClick={handleLinkClick}
                        className="block w-full text-left px-4 py-3 font-sans text-[11px] font-medium tracking-wide text-white/80 hover:text-gold hover:bg-white/5 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            className="lg:hidden text-white font-sans text-xs font-bold tracking-widest"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-40 bg-charcoal transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 p-4">
          
          {/* Explicit Mobile Links for Committee */}
          <Link href="/committee/organizing" className="mobile-link" onClick={handleLinkClick}>Organizing Committee</Link>
          <Link href="/committee/advisory" className="mobile-link" onClick={handleLinkClick}>Advisory Committee</Link>
          <Link href="/committee/technical" className="mobile-link" onClick={handleLinkClick}>Technical Committee</Link>
          
          <div className="w-12 h-[1px] bg-white/10 my-4" />

          {navLinks.map((link) => (
            !link.hasDropdown && (
              <Link
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="mobile-link"
              >
                {link.name}
              </Link>
            )
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .mobile-link {
            @apply font-serif text-3xl md:text-4xl text-cream-100 hover:text-gold transition-colors text-center;
        }
      `}</style>
    </>
  );
}