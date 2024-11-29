import { AspectRatio } from "@/components/ui/aspect-ratio";

interface YouTubeEmbedProps {
  videoId: string;
}

export function YouTubeEmbed({ videoId }: YouTubeEmbedProps) {
  return (
    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg shadow-2xl">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </AspectRatio>
  );
}