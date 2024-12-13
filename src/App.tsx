import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { VideoHero } from "@/components/VideoHero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import ReactFullpage from '@fullpage/react-fullpage';
import { UserDashboard } from './components/user/UserDashboard';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { Toaster } from 'sonner';

type ActiveTab = 'chat' | 'calendar' | 'credits';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsAdminLoggedIn(adminLoggedIn);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-2xl text-[#000080]">Loading...</div>
      </div>
    );
  }

  if (isUserLoggedIn || isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Toaster position="top-center" />
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isUserLoggedIn={isUserLoggedIn}
          isAdminLoggedIn={isAdminLoggedIn}
        />
        <UserDashboard activeTab={activeTab} />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isUserLoggedIn={isUserLoggedIn}
        isAdminLoggedIn={isAdminLoggedIn}
      />
      <ReactFullpage
        scrollingSpeed={1000}
        onLeave={(origin, destination) => {
          setCurrentSection(destination.index);
        }}
        render={() => (
          <ReactFullpage.Wrapper>
            <div className="section">
              <VideoHero />
            </div>
            <div className="section">
              <Features />
            </div>
            <div className="section">
              <Pricing />
            </div>
            <div className="section">
              <Contact />
            </div>
          </ReactFullpage.Wrapper>
        )}
      />
    </>
  );
}

export default App;