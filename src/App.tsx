import { Navigation } from "@/components/Navigation";
import { VideoHero } from "@/components/VideoHero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <VideoHero />
        <Features />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;