import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { AdminLogin } from "./admin/AdminLogin";
import { AdminDashboard } from "./admin/AdminDashboard";

export function Navigation() {
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'bookings' | 'contacts'>('messages');

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsAdminLoggedIn(adminLoggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.reload();
  };

  const navigateToSection = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.fullpage_api) {
      window.fullpage_api.moveTo(index + 1);
    }
  };

  return (
    <>
      <nav className="w-full border-b bg-white shadow-sm fixed top-0 z-50">
        <div className="flex h-16 items-center justify-between px-4">
          <a href="/" className="flex items-center">
            <Logo />
          </a>
          
          {isAdminLoggedIn ? (
            <div className="flex flex-1 items-center justify-between">
              <div className="w-20"></div> {/* Spacer for centering */}
              <div className="flex items-center justify-center space-x-8">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                    activeTab === 'messages'
                      ? 'text-[#000080] border-b-2 border-[#000080]'
                      : 'text-gray-700 hover:text-[#000080]'
                  }`}
                >
                  Messages
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                    activeTab === 'bookings'
                      ? 'text-[#000080] border-b-2 border-[#000080]'
                      : 'text-gray-700 hover:text-[#000080]'
                  }`}
                >
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                    activeTab === 'contacts'
                      ? 'text-[#000080] border-b-2 border-[#000080]'
                      : 'text-gray-700 hover:text-[#000080]'
                  }`}
                >
                  Contacts
                </button>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700 transition-all duration-300 w-20"
              >
                Log out
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden md:flex flex-1 justify-center gap-12">
                <a 
                  href="#get-started" 
                  onClick={navigateToSection(0)}
                  className="flex items-center text-lg font-medium text-[#000080] transition-all duration-300 hover:text-[#4169E1] text-center hover:scale-110"
                >
                  Get Started
                </a>
                <a 
                  href="#features" 
                  onClick={navigateToSection(1)}
                  className="flex items-center text-lg font-medium text-[#000080] transition-all duration-300 hover:text-[#4169E1] text-center hover:scale-110"
                >
                  Why Choose EDUBRIDGE
                </a>
                <a 
                  href="#pricing" 
                  onClick={navigateToSection(2)}
                  className="flex items-center text-lg font-medium text-[#000080] transition-all duration-300 hover:text-[#4169E1] text-center hover:scale-110"
                >
                  Pricing
                </a>
                <a 
                  href="#contact" 
                  onClick={navigateToSection(3)}
                  className="flex items-center text-lg font-medium text-[#000080] transition-all duration-300 hover:text-[#4169E1] text-center hover:scale-110"
                >
                  Contact
                </a>
              </div>

              <div className="flex items-center">
                <Button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300"
                >
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </nav>

      {isAdminLoginOpen && !isAdminLoggedIn && (
        <AdminLogin onClose={() => setIsAdminLoginOpen(false)} />
      )}
      
      {isAdminLoggedIn && <AdminDashboard activeTab={activeTab} />}
    </>
  );
}