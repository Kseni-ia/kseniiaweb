import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { Login } from "./Login";
import { auth } from '../firebase/config';

declare global {
  interface Window {
    fullpage_api?: {
      moveTo: (section: number) => void;
    };
  }
}

interface NavigationProps {
  isAdminLoggedIn: boolean;
}

export function Navigation({ isAdminLoggedIn }: NavigationProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('isStudentLoggedIn');
    localStorage.removeItem('studentId');
    auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <a href="/" className="flex items-center">
            <Logo />
          </a>
          
          {isAdminLoggedIn ? (
            // Admin Navigation
            <div className="flex items-center justify-end space-x-4">
              <Button
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
              >
                Logout
              </Button>
            </div>
          ) : (
            // Public Navigation
            <>
              <div className="hidden md:flex flex-1 justify-center gap-12">
                <a 
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    window.fullpage_api?.moveTo(1);
                  }}
                  className="inline-flex items-center px-1 pt-1 text-lg font-bold text-[#000080] hover:text-[#4169E1] transition-all duration-300 transform hover:scale-110 font-caudex cursor-pointer"
                >
                  About
                </a>
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault();
                    window.fullpage_api?.moveTo(2);
                  }}
                  className="inline-flex items-center px-1 pt-1 text-lg font-bold text-[#000080] hover:text-[#4169E1] transition-all duration-300 transform hover:scale-110 font-caudex cursor-pointer"
                >
                  Why Choose EduBridge
                </a>
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    window.fullpage_api?.moveTo(3);
                  }}
                  className="inline-flex items-center px-1 pt-1 text-lg font-bold text-[#000080] hover:text-[#4169E1] transition-all duration-300 transform hover:scale-110 font-caudex cursor-pointer"
                >
                  Pricing
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    window.fullpage_api?.moveTo(4);
                  }}
                  className="inline-flex items-center px-1 pt-1 text-lg font-bold text-[#000080] hover:text-[#4169E1] transition-all duration-300 transform hover:scale-110 font-caudex cursor-pointer"
                >
                  Contact
                </a>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300"
                >
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {isLoginOpen && (
        <Login onClose={() => setIsLoginOpen(false)} />
      )}
    </nav>
  );
}