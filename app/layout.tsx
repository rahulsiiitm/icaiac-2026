import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-serif",
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: 'swap',
});

export const metadata: Metadata = {
  
  metadataBase: new URL("https://icaiac.iiitmanipur.ac.in"),

  title: "ICAIAC 2026 | IIIT Manipur",
  description: "1st International Conference on Artificial Intelligence and Advanced Computing",
  keywords: ["ICAIAC", "AI Conference", "IIIT Manipur", "Machine Learning", "Computer Science Conference"],
  
  // 1. Browser Tab Icons
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },

  // 2. Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    title: "ICAIAC 2026 | IIIT Manipur",
    description: "Join us for the 1st International Conference on AI & Advanced Computing.",
    url: "https://icaiac.iiitmanipur.ac.in",
    siteName: "ICAIAC 2026",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "ICAIAC 2026 Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 3. Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "ICAIAC 2026 | IIIT Manipur",
    description: "International Conference on Artificial Intelligence and Advanced Computing",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${inter.variable} bg-charcoal text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}