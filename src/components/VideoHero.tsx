import { Button } from "@/components/ui/button";
import { YouTubeEmbed } from "./YouTubeEmbed";

export function VideoHero() {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:w-1/2 space-y-4 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter text-[#000080]">
          Transform Your English with Expert Personal Guidance
        </h1>
        <p className="text-base sm:text-lg text-[#4169E1] max-w-xl mx-auto lg:mx-0">
          Hello, I am Kseniia, a certificated English tutor. Helping students achieve fluency through personalized, engaging lessons.
        </p>
        <div className="flex justify-center lg:justify-start">
          <Button 
            className="w-fit bg-[#000080] hover:bg-[#4169E1] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Book a Lesson
          </Button>
        </div>
      </div>
      <div className="lg:w-1/2 mt-6 lg:mt-0 w-full max-w-md mx-auto">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#000080] via-[#4169E1] to-[#000080] rounded-2xl blur opacity-30"></div>
          <div className="relative rounded-xl overflow-hidden border-2 border-[#000080]/20 shadow-xl">
            <YouTubeEmbed 
              videoId="cHEOsKddURQ" 
              className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}