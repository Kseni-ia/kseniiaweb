import { Button } from "@/components/ui/button";
import { YouTubeEmbed } from "./YouTubeEmbed";

export function VideoHero() {
  return (
    <div className="container py-24 md:py-32">
      <div className="flex flex-col items-center gap-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-red-200">
          Transform Your Englishggg with Expert Personal Guidance
        </h1>
        <div className="w-full">
          <YouTubeEmbed videoId="cHEOsKddURQ" />
        </div>
        <div className="flex flex-col items-center gap-6">
          <p className="text-lg text-muted-foreground">
            Hi, I'm Kseniia, a certified English tutor with over 8 years of experience helping students achieve fluency through personalized, engaging lessons.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="h-12 px-8 bg-white text-black hover:bg-white/90 transition-colors">
              Book a Free Trial
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8">Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}