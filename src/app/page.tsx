'use client';

import { useState, useRef, useEffect } from 'react';
import type { Session } from '@/lib/types';
import { handleUserTurn, summarizeConversationAction } from '@/app/actions';
import AudioRecorder from '@/components/audio-recorder';
import ConversationView from '@/components/conversation-view';
import LanguageSelector from '@/components/language-selector';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Languages, Volume2, MessageSquareText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import SummarySidebar from '@/components/summary-sidebar';
import { firestore } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function Home() {
  const [conversation, setConversation] = useState<Session[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [responseMode, setResponseMode] = useState<'voice' | 'text'>('voice');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const { toast } = useToast();
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let id = localStorage.getItem('chillchacha-device-id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('chillchacha-device-id', id);
    }
    setDeviceId(id);
  }, []);

  useEffect(() => {
    if (deviceId) {
      const q = query(
        collection(firestore, 'sessions'),
        where('uid', '==', deviceId),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const sessions: Session[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          sessions.push({
            id: doc.id,
            uid: data.uid,
            timestamp: data.timestamp?.toDate(),
            audio_transcript: data.audio_transcript,
            detected_emotion: data.detected_emotion,
            ai_response_text: data.ai_response_text,
            ai_response_audio_uri: data.ai_response_audio_uri,
          });
        });
        setConversation(sessions);
      }, (error) => {
        console.error("Firestore snapshot error:", error);
        toast({ variant: "destructive", title: "Connection Error", description: "Could not fetch session history." });
      });

      return () => unsubscribe();
    }
  }, [deviceId, toast]);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleRecordingComplete = async (audioDataUri: string) => {
    if (!deviceId) return;
    setIsProcessing(true);
    setSummary('');

    try {
       const conversationHistory = conversation
        .map(turn => [
          { role: 'user' as const, content: turn.audio_transcript },
          { role: 'model' as const, content: turn.ai_response_text },
        ])
        .flat()
        .filter(turn => turn.content);

      const result = await handleUserTurn({
        uid: deviceId,
        audioDataUri,
        language,
        conversationHistory,
        responseMode
      });

      if (result.error === 'silent') {
        toast({
          title: "I didn't hear anything, beta.",
          description: "Please try speaking a little louder.",
        });
      } else if (result) {
        // Optimistically update the UI
        setConversation(prev => [...prev, result as Session]);
      }

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Please try again.";
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSummarize = async () => {
    if (conversation.length === 0) {
      toast({
        description: "There's nothing to summarize yet. Record a message first.",
      });
      return;
    }
    setIsSummarizing(true);
    try {
      const result = await summarizeConversationAction(conversation);
      if (result) {
        setSummary(result.summary);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate summary. Please try again.",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <SidebarProvider>
      <SummarySidebar
        summary={summary}
        onSummarize={handleSummarize}
        isSummarizing={isSummarizing}
      />
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background font-body">
          <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 shadow-sm sticky top-0 z-10">
            <div className="max-w-4xl mx-auto flex items-center justify-end gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResponseMode(mode => (mode === 'voice' ? 'text' : 'voice'))}
                aria-label={`Switch to ${responseMode === 'voice' ? 'text' : 'voice'} mode`}
                className="w-28"
              >
                {responseMode === 'voice' ? <Volume2 className="mr-2" /> : <MessageSquareText className="mr-2" />}
                {responseMode === 'voice' ? 'Voice' : 'Text'} Mode
              </Button>
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-muted-foreground" />
                <LanguageSelector selectedLanguage={language} onLanguageChange={setLanguage} />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto">
              <ConversationView conversation={conversation} isProcessing={isProcessing} />
              <div ref={conversationEndRef} />
            </div>
          </main>

          <footer className="bg-card/80 backdrop-blur-sm border-t border-border p-4 shadow-sm sticky bottom-0">
            <div className="max-w-4xl mx-auto">
                <Card className="rounded-full">
                  <CardContent className="p-2">
                    <AudioRecorder onRecordingComplete={handleRecordingComplete} isProcessing={isProcessing} />
                  </CardContent>
                </Card>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
