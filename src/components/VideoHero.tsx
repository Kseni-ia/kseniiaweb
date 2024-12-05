import { Button } from "@/components/ui/button";
import { YouTubeEmbed } from "./YouTubeEmbed";

export function VideoHero() {
  return (
    <div className="container py-24 md:py-32">
      <div className="flex flex-col items-center gap-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-[#000080]">
          Transform Your English with Expert Personal Guidance
        </h1>
        <div className="w-full">
          <YouTubeEmbed videoId="cHEOsKddURQ" />
        </div>
        <div className="flex flex-col items-center gap-6">
          <p className="text-lg text-[#4169E1]">
            Hello, I am Kseniia, a certificated English tutor. Helping students achieve fluency through personalized, engaging lessons.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="h-12 px-8 bg-[#000080] text-white hover:bg-[#4169E1] transition-colors">
              Book a Lesson
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}