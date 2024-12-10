import ReactFullpage from "@fullpage/react-fullpage";
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { VideoHero } from "@/components/VideoHero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";

const licenseKey = 'YOUR_KEY_HERE'; // Replace with your fullPage.js license key

function App() {
  const [currentSection, setCurrentSection] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ReactFullpage
        licenseKey={licenseKey}
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
        afterLoad={(origin, destination) => {
          setCurrentSection(destination.index);
        }}
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
                <Pricing />
              </div>
            </div>
            
            <div className="section min-h-screen">
              <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
                <Contact />
              </div>
            </div>
          </ReactFullpage.Wrapper>
        )}
      />
    </div>
  );
}

export default App;