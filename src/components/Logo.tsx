import { cn } from "@/lib/utils";
import "../styles/logo.css";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center transition-all duration-300 hover:scale-110", className)}>
      <span className="logo-text font-caudex text-3xl tracking-wider font-bold">
        EDUBRIDGE
      </span>
    </div>
  );
}