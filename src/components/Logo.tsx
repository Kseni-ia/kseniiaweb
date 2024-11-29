import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const gradientStyle = {
    background: 'linear-gradient(135deg, #6B6B45 0%, #AEB185 50%, #6B6B45 100%)',
    backgroundSize: '400% 400%',
    animation: 'shimmer 3s ease-in-out infinite',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'contrast(175%) brightness(125%)',
    textShadow: '0 0 30px rgba(107, 107, 69, 0.7)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  return (
    <div className={cn("flex items-center", className)}>
      <span 
        className="font-caudex text-3xl tracking-wider font-bold"
        style={gradientStyle}
      >
        KSENII
      </span>
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          ...gradientStyle,
          marginLeft: '4px',
          marginTop: '1px'
        }}
      >
        <path
          d="M12 2L2 20h20L12 2z"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            stroke: '#6B6B45',
            filter: 'drop-shadow(0 0 8px rgba(107, 107, 69, 0.7))'
          }}
        />
      </svg>
    </div>
  );
}