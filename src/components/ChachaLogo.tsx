import { cn } from "@/lib/utils";

const ChachaLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-12 h-12", className)}
    aria-label="Chill Chacha Logo"
  >
    <style>
      {`
        .wink-eye {
          animation: wink-animation 4s infinite;
          transform-origin: center;
        }
        @keyframes wink-animation {
          0%, 90%, 100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.1);
          }
        }
      `}
    </style>
    {/* Head */}
    <circle cx="50" cy="50" r="35" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth="2" />

    {/* Moustache */}
    <path
      d="M 30 55 Q 50 65, 70 55 Q 50 60, 30 55"
      fill="hsl(var(--foreground))"
    />

    {/* Eyes */}
    <circle cx="38" cy="45" r="3" fill="hsl(var(--foreground))" />
    <path
      className="wink-eye"
      d="M 62 42 A 5 5 0 0 1 62 48"
      stroke="hsl(var(--foreground))"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Smile */}
    <path
      d="M 40 65 Q 50 72, 60 65"
      stroke="hsl(var(--foreground))"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export default ChachaLogo;
