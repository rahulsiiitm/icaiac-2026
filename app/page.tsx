import Hero from "./components/Hero";
import About from "./components/About";
import Tracks from "./components/Tracks";
import Keynotes from "./components/Keynotes"; // <--- Import

export default function Home() {
  return (
    <main className="bg-cream-100 min-h-screen selection:bg-gold selection:text-white">
      <Hero />
      <About />
      <Tracks />
      <Keynotes /> {/* <--- Added */}
      
      {/* Placeholder for Next Section (Registration/Timeline) */}
      <div className="h-screen bg-charcoal text-cream-100 flex items-center justify-center">
        <p className="font-serif text-3xl opacity-50">
          Next: Important Dates & Registration
        </p>
      </div>
    </main>
  );
}