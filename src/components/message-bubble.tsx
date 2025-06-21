"use client";

import { cn } from "@/lib/utils";
import { User, Smile, Frown, Meh, Angry, Dna, Rocket, Loader2, BrainCircuit, Play } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React, { type ReactNode } from "react";
import ChachaLogo from './ChachaLogo';
import { Button } from "./ui/button";

type Message = {
  role: 'user' | 'ai';
  content: string | ReactNode;
  audioUri?: string;
};

type MessageBubbleProps = {
  message: Message;
  emotion?: string;
};

const emotionIcons: { [key: string]: React.FC<React.ComponentProps<'svg'>> } = {
  joy: Smile,
  sadness: Frown,
  neutral: Meh,
  anger: Angry,
  fear: Dna,
  surprise: Rocket,
  thinking: BrainCircuit,
};

const EmotionBadge = ({ emotion }: { emotion: string }) => {
    const EmotionIcon = emotionIcons[emotion.toLowerCase()] || Dna;
    
    if (emotion === 'thinking') {
      return (
        <Badge variant="outline" className="capitalize text-xs border-blue-500/50 bg-blue-500/10 text-blue-600 font-medium">
          <EmotionIcon className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
          Chacha is thinking...
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="capitalize text-xs border-primary/50 bg-primary/10 text-primary-dark font-medium">
        <EmotionIcon className="w-3.5 h-3.5 mr-1.5" />
        {emotion}
      </Badge>
    );
};

const AudioPlayer = ({ audioUri }: { audioUri: string }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handlePlay = () => {
    audioRef.current?.play();
  };
  
  // Auto-play the audio when the component mounts
  React.useEffect(() => {
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio auto-play failed, user interaction needed.", e));
    }
  }, []);

  return (
    <div className="mt-3 flex items-center gap-2">
       <audio ref={audioRef} src={audioUri} preload="auto" />
       <Button variant="outline" size="icon" className="w-8 h-8 rounded-full" onClick={handlePlay}>
        <Play className="w-4 h-4" />
        <span className="sr-only">Play audio</span>
      </Button>
       <p className="text-xs text-muted-foreground">Chacha's voice</p>
    </div>
  );
};


export default function MessageBubble({ message, emotion }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  const bubbleClasses = cn(
    'flex items-start gap-4 max-w-[85%]',
    isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
  );

  const cardClasses = cn(
    'rounded-2xl shadow-md',
    isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none'
  );

  const iconClasses = cn(
    "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
    isUser 
      ? "bg-primary text-primary-foreground p-1.5" 
      : "bg-card text-foreground border"
  );

  const content = message.content === '...' 
    ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> 
    : message.content;

  return (
    <div className={bubbleClasses}>
       <div className={iconClasses}>
        {isUser ? <User className="w-full h-full" /> : <ChachaLogo className="w-8 h-8" />}
      </div>
      <Card className={cardClasses}>
        {emotion && (
            <CardHeader className="p-3 pb-1">
                <EmotionBadge emotion={emotion} />
            </CardHeader>
        )}
        <CardContent className={cn("p-4 text-base", emotion && 'pt-1')}>
            {typeof content === 'string' ? (
                 <p className="whitespace-pre-wrap">{content}</p>
            ) : (
                content
            )}
            {message.audioUri && <AudioPlayer audioUri={message.audioUri} />}
        </CardContent>
      </Card>
    </div>
  );
}
