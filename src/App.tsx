import ReactFullpage from "@fullpage/react-fullpage";
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
      <ReactFullpage
        scrollingSpeed={800}
        scrollBar={false}
        navigation={true}
        navigationPosition="right"
        css3={true}
        dragAndMove={true}
        autoScrolling={true}
        fitToSection={true}
        paddingTop="0"
        responsiveWidth={768}
        render={() => (
          <ReactFullpage.Wrapper>
            <div className="section min-h-screen pt-16">
              <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
                <VideoHero />
              </div>
            </div>
            
            <div className="section min-h-screen">
              <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
                <Features />
              </div>
            </div>
            
            <div className="section min-h-screen">
              <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
                <Testimonials />
              </div>
            </div>
            
            <div className="section min-h-screen">
              <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
                <Pricing />
              </div>
            </div>
            
            <div className="section min-h-screen">
              <div className="max-w-7xl mx-auto h-full flex flex-col items-center justify-center">
                <Contact />
                <Footer />
              </div>
            </div>
          </ReactFullpage.Wrapper>
        )}
      />
    </div>
  );
}

export default App;