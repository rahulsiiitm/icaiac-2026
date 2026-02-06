import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import { ReactLenis } from "lenis/react"; // <--- UPDATED IMPORT
import "lenis/dist/lenis.css"; // <--- NEW CSS IMPORT
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: 'swap',
});

const manrope = Manrope({ 
  subsets: ["latin"], 
  variable: "--font-manrope", 
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ICAIAC 2026 | IIIT Manipur",
  description: "1st International Conference on Artificial Intelligence and Advanced Computing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="bg-cream-100 text-charcoal antialiased selection:bg-gold selection:text-white">
        {/* The 'root' prop is required to catch the main scroll */}
        <ReactLenis root>
          {children}
        </ReactLenis>
        <Analytics />
      </body>
    </html>
  );
}