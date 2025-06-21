'use client';

import type { Session } from '@/lib/types';
import MessageBubble from './message-bubble';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import ChachaLogo from './ChachaLogo';

type ConversationViewProps = {
  conversation: Session[];
};

const WelcomeMessage = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Card className="shadow-md border-primary/20 bg-card/50 mb-8">
      <CardContent className="p-6 text-center">
        <ChachaLogo className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to ChillChacha</h2>
        <p className="text-muted-foreground">
          Your personal space for reflection. Tap the microphone below to start a new entry whenever you're ready.
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function ConversationView({ conversation }: ConversationViewProps) {
  return (
    <div className="space-y-6 pb-4">
      <AnimatePresence>
        {conversation.length === 0 && <WelcomeMessage />}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {conversation.map((turn, index) => (
           <motion.div
            key={turn.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
           >
            <div className="space-y-6">
              <MessageBubble
                message={{ role: 'user', content: turn.audio_transcript }}
                emotion={turn.detected_emotion}
              />
              {turn.ai_response_text && (
                <MessageBubble
                  message={{ role: 'ai', content: turn.ai_response_text, audioUri: turn.ai_response_audio_uri }}
                  emotion={turn.detected_emotion}
                />
              )}
            </div>
           </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
