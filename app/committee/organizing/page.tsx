"use client";

import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer";

export default function OrganizingPage() {
  const PATRONS = [
    { role: "Chief Patron", name: "Prof. Krishnan Baskar", title: "Director, IIIT Manipur" },
  ];
  
  const CONVENORS = [
    { role: "Convenor", name: "Dr. Nongmeikapam Kishorjit Singh", title: "IIIT Manipur" },
    { role: "Co-Convenor", name: "Dr. Khoirom Motilal Singh", title: "IIIT Manipur" },
  ];

  const SECRETARIES = [
    { name: "Dr. Navnath Saharia", title: "HOD, CSE, IIIT Manipur" },
    { name: "Dr. Rajkumari Bidyalakshmi Devi", title: "IIIT Manipur" },
    { name: "Dr. Sanasam Chanu Inunganbi", title: "IIIT Manipur" },
    { name: "Dr. Salam Michael Singh", title: "IIIT Manipur" },
    { name: "Dr. Jennil Thiyam", title: "IIIT Manipur" },
    { name: "Dr. Sunita Warjri", title: "IIIT Manipur" },
    { name: "Dr. Teressa Loingjam", title: "IIIT Manipur" },
    { name: "Dr. Rahul Lahkar", title: "IIIT Manipur" },
  ];

  const TECHNICAL_SUPPORT = [
    { name: "Mr. Rajkumar Nareshkumar Singh", title: "Jr. Technician, CSE" },
    { name: "Mr. Uttamananda Kalita", title: "Jr. Technician, CSE" },
    { name: "Mr. Nirjit Oinam", title: "Jr. Technician, CSE" },
  ];

  return (
    <main className="bg-cream-100 min-h-screen selection:bg-gold selection:text-white">
      <Navbar />
      
      {/* HEADER */}
      <section className="pt-40 pb-20 px-6 text-center bg-charcoal text-white">
        <h1 className="font-serif text-5xl md:text-6xl mb-4">Organizing Committee</h1>
        <p className="font-sans text-gold text-sm tracking-widest uppercase">The Leadership Team</p>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-24 space-y-24">
        
        {/* BLOCK 1: PATRON */}
        <div>
           <h3 className="font-serif text-3xl text-charcoal mb-10 text-center">Chief Patron</h3>
           <div className="flex justify-center">
              {PATRONS.map((p, i) => (
                <div key={i} className="p-10 bg-white border border-charcoal/5 text-center shadow-lg max-w-md w-full">
                  <span className="block text-gold text-xs font-bold tracking-widest uppercase mb-2">{p.role}</span>
                  <h4 className="font-serif text-3xl text-charcoal mb-2">{p.name}</h4>
                  <p className="text-charcoal/60 text-sm">{p.title}</p>
                </div>
              ))}
           </div>
        </div>

        {/* BLOCK 2: CONVENORS */}
        <div>
           <h3 className="font-serif text-3xl text-charcoal mb-10 text-center">Convenors</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {CONVENORS.map((p, i) => (
                <div key={i} className="p-8 bg-white border border-charcoal/5 text-center shadow-sm">
                  <span className="block text-gold text-xs font-bold tracking-widest uppercase mb-2">{p.role}</span>
                  <h4 className="font-serif text-2xl text-charcoal mb-1">{p.name}</h4>
                  <p className="text-charcoal/60 text-sm">{p.title}</p>
                </div>
              ))}
           </div>
        </div>

        {/* BLOCK 3: ORGANISING SECRETARIES */}
        <div>
           <h3 className="font-serif text-3xl text-charcoal mb-10 text-center">Organising Secretaries</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SECRETARIES.map((p, i) => (
                <div key={i} className="p-6 bg-white border border-charcoal/5 text-center hover:border-gold/30 transition-colors">
                  <h4 className="font-serif text-lg text-charcoal mb-1">{p.name}</h4>
                  <p className="text-charcoal/50 text-xs uppercase tracking-wide">{p.title}</p>
                </div>
              ))}
           </div>
        </div>

        {/* BLOCK 4: TECHNICAL SUPPORT */}
        <div>
           <h3 className="font-serif text-2xl text-charcoal mb-8 text-center opacity-80">Technical Support</h3>
           <div className="flex flex-wrap justify-center gap-8">
              {TECHNICAL_SUPPORT.map((p, i) => (
                <div key={i} className="text-center">
                  <h4 className="font-serif text-lg text-charcoal">{p.name}</h4>
                  <p className="text-charcoal/50 text-xs uppercase tracking-wide">{p.title}</p>
                </div>
              ))}
           </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}