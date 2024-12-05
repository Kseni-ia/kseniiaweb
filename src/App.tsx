import { Navigation } from "@/components/Navigation";
import { VideoHero } from "@/components/VideoHero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto">
        <Navigation />
        <main className="flex flex-col items-center w-full px-4">
          <VideoHero />
          <Features />
          <Testimonials />
          <Pricing />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;