import Hero from "./components/Hero";
import About from "./components/About";
import Tracks from "./components/Tracks";
import Downloads from "./components/Downloads";
import Awards from "./components/Awards";
import Keynotes from "./components/Keynotes";
import Registration from "./components/Registration";
import Partners from "./components/Partners"; // <--- Import Partners
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-cream-100 min-h-screen selection:bg-gold selection:text-white">
      <Hero />
      <About />
      <Tracks />
      <Downloads />
      <Keynotes />
      <Registration />
      <Awards />
      <Partners /> {/* <--- Added Media Partners here */}
      <Footer />   {/* <--- Footer now acts as the detailed Contact Us section */}
    </main>
  );
}