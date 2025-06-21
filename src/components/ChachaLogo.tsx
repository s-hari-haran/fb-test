import { cn } from "@/lib/utils";
import Image from 'next/image';

const ChachaLogo = ({ className }: { className?: string }) => (
  <Image
    src="https://placehold.co/100x100.png"
    alt="Chill Chacha Logo"
    width={100}
    height={100}
    data-ai-hint="friendly uncle"
    className={cn("w-12 h-12 rounded-full", className)}
  />
);

export default ChachaLogo;
