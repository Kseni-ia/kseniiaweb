import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { BookingModal } from "./BookingModal";

export function Navigation() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center">
          <Logo />
        </a>
        
        <div className="hidden md:flex flex-1 justify-center gap-20">
          <a href="#features" className="flex items-center text-lg font-medium text-[#000080] transition-all duration-300 hover:text-[#4169E1] text-center hover:scale-110">
            Why Choose Me
          </a>
          <a href="#testimonials" className="flex items-center text-lg font-medium text-[#000080] transition-all duration-300 hover:text-[#4169E1] text-center hover:scale-110">
            Student Stories
          </a>
          <a href="#pricing" className="flex items-center text-lg font-medium text-[#000080] transition-all duration-300 hover:text-[#4169E1] text-center hover:scale-110">
            Pricing
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