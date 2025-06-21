import { cn } from "@/lib/utils";

const ChachaLogo = ({ className }: { className?: string }) => (
  <svg
    className={cn("w-12 h-12 rounded-full", className)}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_301_2)">
      <path
        d="M120 60C120 93.1371 93.1371 120 60 120C26.8629 120 0 93.1371 0 60C0 26.8629 26.8629 0 60 0C93.1371 0 120 26.8629 120 60Z"
        fill="hsl(var(--accent))"
      />
      <g filter="url(#filter0_d_301_2)">
        <path
          d="M60 100C74.3417 100 87.4111 91.2917 93.0333 80H26.9667C32.5889 91.2917 45.6583 100 60 100Z"
          fill="#E1D4C7"
        />
      </g>
      <g filter="url(#filter1_d_301_2)">
        <path
          d="M60 92.5C49.25 92.5 39.5 86.875 34.25 78.75L35.2167 77.25C38.0833 73.125 42.4583 70 47.75 70H72.25C77.5417 70 81.9167 73.125 84.7833 77.25L85.75 78.75C80.5 86.875 70.75 92.5 60 92.5Z"
          fill="#6B4F3A"
        />
        <path
          d="M78 40C78 41.6569 76.6569 43 75 43C73.3431 43 72 41.6569 72 40C72 38.3431 73.3431 37 75 37C76.6569 37 78 38.3431 78 40Z"
          fill="#3A2D24"
        />
        <path
          d="M48 40C48 41.6569 46.6569 43 45 43C43.3431 43 42 41.6569 42 40C42 38.3431 43.3431 37 45 37C46.6569 37 48 38.3431 48 40Z"
          fill="#3A2D24"
        />
        <path
          d="M60 70C62.2083 70 64 68.2083 64 66.25C64 64.2917 62.2083 62.5 60 62.5C57.7917 62.5 56 64.2917 56 66.25C56 68.2083 57.7917 70 60 70Z"
          fill="#3A2D24"
        />
      </g>
      <g filter="url(#filter2_d_301_2)">
        <path
          d="M74.5 35C74.5 37.4853 72.4853 39.5 70 39.5C67.5147 39.5 65.5 37.4853 65.5 35C65.5 32.5147 67.5147 30.5 70 30.5C72.4853 30.5 74.5 32.5147 74.5 35Z"
          fill="white"
        />
        <path
          d="M54.5 35C54.5 37.4853 52.4853 39.5 50 39.5C47.5147 39.5 45.5 37.4853 45.5 35C45.5 32.5147 47.5147 30.5 50 30.5C52.4853 30.5 54.5 32.5147 54.5 35Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_301_2"
        x="22.9667"
        y="76"
        width="74.0667"
        height="28"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-1" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_301_2"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_301_2"
          result="shape"
        />
      </filter>
      <filter
        id="filter1_d_301_2"
        x="30.25"
        y="37"
        width="59.5"
        height="63.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_301_2"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_301_2"
          result="shape"
        />
      </filter>
      <filter
        id="filter2_d_301_2"
        x="44.5"
        y="30.5"
        width="31"
        height="10"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="0.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_301_2"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_301_2"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_301_2">
        <rect width="120" height="120" rx="60" fill="white" />
      </clipPath>
    </defs>
    <style>
      {`
        @keyframes chacha-bob {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        g {
          animation: chacha-bob 3s ease-in-out infinite;
        }
      `}
    </style>
  </svg>
);

export default ChachaLogo;
