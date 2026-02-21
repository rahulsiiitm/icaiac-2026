"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleLinkClick = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const navLinks = [
    { name: "ABOUT", href: "/#about", hasDropdown: false },
    { 
      name: "COMMITTEE", 
      href: "#", 
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
          ref={navRef}
          className="pointer-events-auto bg-charcoal/90 backdrop-blur-md border border-white/10 rounded-full pl-6 pr-8 py-3 flex items-center gap-8 shadow-2xl"
        >
          
          <Link 
            href="/" 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleLinkClick}
          >
            <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110">
                <Image 
                    src="/images/logo.png" 
                    alt="ICAIAC Logo" 
                    fill 
                    className="object-contain"
                />
            </div>
            <span className="font-serif text-white font-bold text-lg">
              ICAIAC <span className="text-gold">26</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasDropdown ? (
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
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className="group flex items-center gap-1 font-sans text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                )}

                {/* Dropdown */}
                {link.hasDropdown && activeDropdown === link.name && (
                  <div className="absolute top-full mt-2 bg-charcoal/95 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden min-w-50 shadow-xl">
                    {link.submenu?.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
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

            {/* --- AUTH SECTION --- */}
            <div className="h-4 w-px bg-white/10 mx-2" />

            {session ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  onClick={handleLinkClick}
                  className="font-sans text-[11px] font-bold uppercase tracking-widest text-gold hover:text-white transition-colors"
                >
                  Portal
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="font-sans text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-gold transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/sign-in" 
                onClick={handleLinkClick}
                className="font-sans text-[11px] font-bold uppercase tracking-widest text-gold hover:text-white transition-colors border border-gold/30 px-4 py-1.5 rounded-full hover:bg-gold"
              >
                Sign In
              </Link>
            )}
          </div>

          <button 
            className="lg:hidden text-white font-sans text-xs font-bold tracking-widest ml-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-40 bg-charcoal transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex flex-col items-center justify-center h-full gap-6 p-4 overflow-y-auto">
          
          <div className="relative w-16 h-16 mb-2 animate-pulse">
            <Image 
                src="/images/logo.png" 
                alt="ICAIAC Logo" 
                fill 
                className="object-contain"
            />
          </div>

          {/* Portal / Sign In for Mobile */}
          {session ? (
            <>
              <Link href="/dashboard" className="font-serif text-3xl text-gold" onClick={handleLinkClick}>Your Portal</Link>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="font-sans text-xs font-bold text-white/50 uppercase tracking-widest"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/sign-in" className="font-serif text-3xl text-gold underline underline-offset-8" onClick={handleLinkClick}>Sign In</Link>
          )}

          <div className="w-12 h-px bg-white/10 my-4" />

          <Link href="/committee/organizing" className="font-serif text-2xl text-cream-100" onClick={handleLinkClick}>Organizing Committee</Link>
          <Link href="/committee/advisory" className="font-serif text-2xl text-cream-100" onClick={handleLinkClick}>Advisory Committee</Link>
          <Link href="/committee/technical" className="font-serif text-2xl text-cream-100" onClick={handleLinkClick}>Technical Committee</Link>
          
          {navLinks.map((link) => (
            !link.hasDropdown && (
              <Link
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="font-serif text-3xl md:text-4xl text-cream-100 hover:text-gold transition-colors text-center"
              >
                {link.name}
              </Link>
            )
          ))}

          <button 
            className="mt-8 text-white/50 text-xs font-bold tracking-widest uppercase hover:text-gold transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Close Menu
          </button>
        </div>
      </div>
    </>
  );
}