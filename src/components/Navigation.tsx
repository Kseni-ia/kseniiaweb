import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { BookingModal } from "./BookingModal";

export function Navigation() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const navigateToSection = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.fullpage_api) {
      window.fullpage_api.moveTo(index + 1);
    }
  };

  return (
    <nav className="w-full border-b bg-white shadow-sm fixed top-0 z-50">
      <div className="flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center">
          <Logo />
        </a>
        
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
            className="bg-[#000080] text-white hover:bg-[#4169E1] transition-all duration-300 px-6 hover:scale-105"
            onClick={() => setIsBookingModalOpen(true)}
          >
            Book a Lesson
          </Button>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </nav>
  );
}