import Hero from "./components/Hero";
import About from "./components/About";
import Tracks from "./components/Tracks";
import Downloads from "./components/Downloads";
import Keynotes from "./components/Keynotes";
import Registration from "./components/Registration";
import Awards from "./components/Awards";
import Venue from "./components/Venue";
import Partners from "./components/Partners";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import BackToTop from "./components/BackToTop";

export default function Home() {
  return (
    <main className="bg-cream-100 min-h-screen selection:bg-gold selection:text-white">
      <Navbar />
      <BackToTop />
      <div id="hero"><Hero /></div>
      <div id="about"><About /></div>
      <div id="tracks"><Tracks /></div>
      <Downloads />
      <div id="keynotes"><Keynotes /></div>
      <div id="registration"><Registration /></div>
      <Awards />
      <div id="venue"><Venue /></div>
      <Partners />
      <Footer />
    </main>
  );
}