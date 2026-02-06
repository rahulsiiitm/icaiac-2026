"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdvisoryPage() {
  const ADVISORS = [
    { name: "Prof. D V L N Somayajulu", title: "Director, NIT Manipur" },
    { name: "Prof. Chandbabu Singh", title: "Vice-Chancellor, DM University" },
    { name: "Prof. N Lokendra Singh", title: "Vice-Chancellor, Manipur University" },
    { name: "Prof. A. Elayaperumal", title: "Director, NIT Nagaland" },
    { name: "Prof. Mohan Aware", title: "Director, NIT Arunachal Pradesh" },
    { name: "Prof. Pinakeswar Mahanta", title: "Director, NIT Meghalaya" },
    { name: "Prof. Sarat Kumar Patra", title: "Director, NIT Agartala, IIIT Guwahati" },
    { name: "Prof. Abhay Kumar", title: "Director, IIIT Agartala" },
    { name: "Prof. Dilip Kumar Baidya", title: "Director, NIT Silchar" },
    { name: "Prof. Mahesh Chandra Govil", title: "Director, NIT Sikkim" },
    { name: "Prof. S. Sundar", title: "Director, NIT Mizoram" },
    { name: "Prof. Yumnam Jayanta", title: "Director, NIELIT Manipur" },
    { name: "Dr. Kishorjit Nongmeikapam", title: "Registrar, IIIT Manipur" },
    { name: "Dr. Navanath Saharia", title: "Head CSE, IIIT Manipur" },
    { name: "Dr. Nagesh Ch", title: "Head ECE, IIIT Manipur" },
    { name: "Dr. Sanjib Choudhury", title: "Head HBS, IIIT Manipur" },
  ];

  return (
    <main className="bg-cream-100 min-h-screen selection:bg-gold selection:text-white">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 text-center bg-charcoal text-white">
        <h1 className="font-serif text-5xl md:text-6xl mb-4">Advisory Committee</h1>
        <p className="font-sans text-gold text-sm tracking-widest uppercase">National & Institutional Leaders</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ADVISORS.map((person, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-white border border-charcoal/5 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="w-10 h-10 bg-cream-100 flex items-center justify-center text-charcoal font-serif font-bold text-lg group-hover:bg-gold group-hover:text-white transition-colors">
                        {i + 1}
                    </div>
                    <div>
                        <h4 className="font-serif text-xl text-charcoal">{person.name}</h4>
                        <p className="font-sans text-xs uppercase tracking-wider text-charcoal/50 mt-1">{person.title}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}