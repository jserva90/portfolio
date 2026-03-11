import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Experience } from "@/components/Experience";
import { HowIWork } from "@/components/HowIWork";
import { Education } from "@/components/Education";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Experience />
        <HowIWork />
        <Education />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
