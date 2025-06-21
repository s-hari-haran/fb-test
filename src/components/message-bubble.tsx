'use client';

import { cn } from '@/lib/utils';
import { User, Bot, Smile, Frown, Meh, Angry, Dna, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ReactNode } from 'react';

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
};

const EmotionBadge = ({ emotion }: { emotion: string }) => {
    const EmotionIcon = emotionIcons[emotion.toLowerCase()] || Dna;
    return (
      <Badge variant="outline" className="capitalize text-xs border-primary/50 bg-primary/10 text-primary-dark font-medium">
        <EmotionIcon className="w-3.5 h-3.5 mr-1.5" />
        {emotion}
      </Badge>
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

  const IconComponent = isUser ? User : Bot;
  const iconClasses = cn(
    "w-8 h-8 p-1.5 rounded-full flex-shrink-0",
    isUser ? "bg-primary text-primary-foreground" : "bg-card text-foreground border"
  );

  return (
    <div className={bubbleClasses}>
      <IconComponent className={iconClasses} />
      <Card className={cardClasses}>
        {emotion && (
            <CardHeader className="p-3 pb-1">
                <EmotionBadge emotion={emotion} />
            </CardHeader>
        )}
        <CardContent className={cn("p-4 text-base", emotion && 'pt-1')}>
            {typeof message.content === 'string' ? (
                 <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
                message.content
            )}
            {message.audioUri && (
                <audio controls src={message.audioUri} className="w-full mt-3 h-10">
                    Your browser does not support the audio element.
                </audio>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
