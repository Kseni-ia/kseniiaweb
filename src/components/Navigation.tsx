import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { AdminLogin } from "./admin/AdminLogin";
import { SignUpModal } from "./SignUpModal";
import { auth } from '../firebase/config';

type ActiveTab = 'chat' | 'calendar' | 'credits';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isUserLoggedIn: boolean;
  isAdminLoggedIn: boolean;
}

export function Navigation({ 
  activeTab, 
  onTabChange, 
  isUserLoggedIn, 
  isAdminLoggedIn 
}: NavigationProps) {
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleLogout = () => {
    if (isAdminLoggedIn) {
      localStorage.removeItem('isAdminLoggedIn');
    } 
    if (isUserLoggedIn) {
      auth.signOut();
    }
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <a href="/" className="flex items-center">
            <Logo />
          </a>
          
          {isUserLoggedIn || isAdminLoggedIn ? (
            <div className="flex flex-1 items-center justify-between">
              <div className="w-20"></div>
              <div className="flex items-center justify-center space-x-8">
                <button
                  onClick={() => onTabChange('chat')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === 'chat'
                      ? 'text-[#000080] border-b-2 border-[#000080]'
                      : 'text-gray-500 hover:text-[#000080]'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => onTabChange('calendar')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === 'calendar'
                      ? 'text-[#000080] border-b-2 border-[#000080]'
                      : 'text-gray-500 hover:text-[#000080]'
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => onTabChange('credits')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === 'credits'
                      ? 'text-[#000080] border-b-2 border-[#000080]'
                      : 'text-gray-500 hover:text-[#000080]'
                  }`}
                >
                  Credits
                </button>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
              >
                Log out
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden md:flex flex-1 justify-center gap-12">
                <a 
                  href="#about"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-[#000080]"
                >
                  About
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-[#000080]"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-[#000080]"
                >
                  Pricing
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-[#000080]"
                >
                  Contact
                </a>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => setIsSignUpOpen(true)}
                  className="border-[#000080] text-[#000080] hover:bg-[#000080]/10"
                  variant="outline"
                >
                  Sign up
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {isAdminLoginOpen && !isAdminLoggedIn && (
        <AdminLogin onClose={() => setIsAdminLoginOpen(false)} />
      )}
      
      {isSignUpOpen && (
        <SignUpModal onClose={() => setIsSignUpOpen(false)} />
      )}
    </nav>
  );
}