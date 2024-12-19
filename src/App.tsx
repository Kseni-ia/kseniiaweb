import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { VideoHero } from "@/components/VideoHero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import ReactFullpage from '@fullpage/react-fullpage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { Toaster } from 'sonner';
import { PageDots } from './components/PageDots';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const studentLoggedIn = localStorage.getItem('isStudentLoggedIn') === 'true';
    setIsAdminLoggedIn(adminLoggedIn);
    setIsStudentLoggedIn(studentLoggedIn);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-2xl text-[#000080]">Loading...</div>
      </div>
    );
  }

  if (isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Toaster position="top-center" />
        <AdminDashboard />
      </div>
    );
  }

  if (isStudentLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Toaster position="top-center" />
        <StudentDashboard />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <Navigation isAdminLoggedIn={isAdminLoggedIn} />
      <PageDots currentSection={currentSection} totalSections={4} />
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