import { useState } from "react";
import { Button } from "@/components/ui/button";
import { YouTubeEmbed } from "./YouTubeEmbed";
import { BookingModal } from "./BookingModal";

export function VideoHero() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="w-full h-[calc(100vh-6rem)] flex flex-col lg:flex-row items-center justify-center gap-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:w-1/2 space-y-4 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-tight tracking-tighter text-[#000080]">
          Transform Your English with Expert Personal Guidance
        </h1>
        <div className="flex justify-center lg:justify-start">
          <Button 
            className="w-fit bg-[#000080] hover:bg-[#4169E1] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            onClick={() => setIsBookingModalOpen(true)}
          >
            Book a Lesson
          </Button>
        </div>
      </div>
      <div className="lg:w-1/2 mt-4 lg:mt-0 w-full max-w-xl mx-auto">
        <div className="relative">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#000080] via-[#4169E1] to-[#000080] rounded-2xl blur opacity-30"></div>
          <div className="relative rounded-xl overflow-hidden border-2 border-[#000080]/20 shadow-xl">
            <YouTubeEmbed 
              videoId="cHEOsKddURQ" 
              className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}