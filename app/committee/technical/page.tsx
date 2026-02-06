"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function TechnicalPage() {
  const TECHNICAL_MEMBERS = [
    { name: "Prof. Ahangar Kiasari", aff: "Aarhus University, Denmark" },
    { name: "Prof. Alagar, Sridhar", aff: "University of Texas at Dallas, USA" },
    { name: "Prof. Alakesh Kalita", aff: "IIT (ISM) Dhanbad" },
    { name: "Prof. Anteneh Girma", aff: "University of the District of Columbia, Washington DC" },
    { name: "Prof. Arijit Nath", aff: "IIIT Guwahati" },
    { name: "Dr. Arambam Neelima", aff: "NIT Nagaland" },
    { name: "Dr. Asif Ekbal", aff: "IIT Patna" },
    { name: "Prof. A Dinamani Singh", aff: "NIT Manipur" },
    { name: "Dr. Biplab Baneerji", aff: "IIT Bombay" },
    { name: "Dr. Dalton Thounaojam", aff: "Manipur University" },
    { name: "Dr. Dmitrii Kaplun", aff: "Saint Petersburg Electrotechnical University, Russia" },
    { name: "Dr. Dipankar Das", aff: "Jadavpur University" },
    { name: "Prof. Gopal Gupta", aff: "University of Texas at Dallas, USA" },
    { name: "Prof. Jayakesavan Veerasamy", aff: "University of Texas at Dallas, USA" },
    { name: "Prof. Khumanthem Manglem Singh", aff: "NIT Manipur" },
    { name: "Dr. Khumukcham Robindro Singh", aff: "Manipur University" },
    { name: "Dr. Khundrakpam Johnson Singh", aff: "NIT Manipur" },
    { name: "Dr. Kishore Kashyap", aff: "Guwahati University, Assam" },
    { name: "Dr. Laiphrakpam Dolendro Singh", aff: "NIT Silchar" },
    { name: "Dr. Lilapati Waikhom", aff: "NERIST" },
    { name: "Dr. Lithungo Murry", aff: "NIT Nagaland" },
    { name: "Dr. Loitongbam Gyanendro Singh", aff: "IIT Ropar" },
    { name: "Prof. Meenakshi Maitra", aff: "University of Texas at Dallas, USA" },
    { name: "Dr. Moirangthem Dennis Singh", aff: "NIT Manipur" },
    { name: "Dr. Nagaraju Baydeti", aff: "NIT Nagaland" },
    { name: "Prof. Naveen Garg", aff: "IIT Delhi" },
    { name: "Dr. Ningthoujam Johny Singh", aff: "NIT Meghalaya" },
    { name: "Dr. Oinam Bidyapati Chanu", aff: "NIT Manipur" },
    { name: "Prof. Pachiyannan Prabu", aff: "IMSIU, Riyadh, Saudi Arabia" },
    { name: "Dr. Partha Pakray", aff: "NIT Silchar" },
    { name: "Prof. Pawan K. Mishra", aff: "IIIT Guwahati" },
    { name: "Prof. Po-Keng Cheng", aff: "National Taipei University" },
    { name: "Mr. Pramesh Baral", aff: "Infosys Limited, USA" },
    { name: "Prof. Pushpak Bhattacharyya", aff: "IIT Bombay" },
    { name: "Prof. Ram Sarkar", aff: "Jadavpur University" },
    { name: "Prof. Rakesh Balbant Rai", aff: "IIIT Bhubaneswar" },
    { name: "Prof. Rashmi Varma", aff: "University of Texas at Dallas, USA" },
    { name: "Dr. Ravi Yadav", aff: "NIT Jalandhar" },
    { name: "Dr. Ripon Patgiri", aff: "NIT Silchar" },
    { name: "Prof. S. Chitrakala", aff: "Anna University, TN" },
    { name: "Prof. Shikhar Kumar Sarma", aff: "Gauhati University, Assam" },
    { name: "Dr. Shouvik Dey", aff: "NIT Nagaland" },
    { name: "Dr. Sibesh Lodh", aff: "NIT Nagaland" },
    { name: "Prof. Sivaji Bandyopadhyay", aff: "Jadavpur University, Kolkata" },
    { name: "Dr. Somnath Banerjee", aff: "University of Tartu, Estonia" },
    { name: "Dr. Sudip Naskar", aff: "Jadavpur University, Kolkata" },
    { name: "Prof. Sudip Misra", aff: "IIT Kharagpur" },
    { name: "Prof. Tamil Lakshman", aff: "University of Texas at Dallas, USA" },
    { name: "Dr. Tapan Jain", aff: "IIIT Nagpur, Maharashtra" },
    { name: "Prof. Utpal Sharma", aff: "Tezpur University, Assam" },
    { name: "Dr. Vaskar Deka", aff: "Guwahati University, Assam" },
    { name: "Prof. Vishal Goyal", aff: "Punjabi University, Punjab" },
    { name: "Prof. Themrichon Tuithung", aff: "NIT Nagaland" },
    { name: "Prof. Xiao-Zhi Gao", aff: "University of Eastern Finland" },
    { name: "Prof. Yumnam Jayanta", aff: "NIELIT Manipur" },
    { name: "Dr. Yumnam Surajkanta", aff: "NIT Manipur" }
  ];

  return (
    <main className="bg-cream-100 min-h-screen selection:bg-gold selection:text-white">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 text-center bg-charcoal text-white">
        <h1 className="font-serif text-5xl md:text-6xl mb-4">Technical Committee</h1>
        <p className="font-sans text-gold text-sm tracking-widest uppercase">Program Reviewers & Track Chairs</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        {/* A Masonry-style dense grid for the long list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {TECHNICAL_MEMBERS.map((person, i) => (
                <div key={i} className="flex items-baseline gap-3 border-b border-charcoal/5 pb-2 hover:bg-white p-2 rounded-sm transition-colors">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0 self-center" />
                    <div>
                        <h4 className="font-serif text-charcoal font-medium">{person.name}</h4>
                        <p className="font-sans text-xs text-charcoal/50">{person.aff}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}