import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import HowToOrder from "@/components/HowToOrder";
import Footer from "@/components/Footer";
import Packages from "@/components/Packages";
import Dishes from "@/components/Dishes";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import { getPackages, getDishes, getSettings, getTestimonials, getGalleries } from "./actions";

export default async function Home() {
  const packages = await getPackages();
  const dishes = await getDishes();
  const settings = await getSettings();
  const testimonials = await getTestimonials();
  const galleries = await getGalleries();
  
  return (
    <>
      <Navbar settings={settings} />
      <Hero />
      <Packages />
      <Dishes dishes={dishes} />
      <About settings={settings} />
      <Gallery galleries={galleries} />
      <HowToOrder settings={settings} />
      <Testimonials testimonials={testimonials} settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
