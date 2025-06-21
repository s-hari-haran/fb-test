'use client';

import type { ConversationTurn } from '@/lib/types';
import MessageBubble from './message-bubble';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ConversationViewProps = {
  conversation: ConversationTurn[];
  isProcessing: boolean;
};

const WelcomeMessage = () => (
  <Card className="shadow-md border-primary/20 bg-card/50 mb-8">
    <CardContent className="p-6 text-center">
      <Bot className="w-12 h-12 mx-auto text-primary mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to InnerSight</h2>
      <p className="text-muted-foreground">
        Your personal space for reflection. Tap the microphone below to start a new entry whenever you're ready.
      </p>
    </CardContent>
  </Card>
);

const ProcessingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    <MessageBubble
      message={{
        role: 'ai',
        content: <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />,
      }}
    />
  </motion.div>
);

export default function ConversationView({ conversation, isProcessing }: ConversationViewProps) {
  return (
    <div className="space-y-6 pb-4">
      <AnimatePresence>
        {conversation.length === 0 && !isProcessing && <WelcomeMessage />}
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
                message={{ role: 'user', content: turn.transcript }}
                emotion={turn.detectedEmotion}
              />
              <MessageBubble
                message={{ role: 'ai', content: turn.supportiveResponse }}
              />
            </div>
           </motion.div>
        ))}
      </AnimatePresence>
      
      {isProcessing && <ProcessingIndicator />}
    </div>
  );
}
