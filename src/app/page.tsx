
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Session } from '@/lib/types';
import { handleUserTurn, summarizeConversationAction } from '@/app/actions';
import AudioRecorder from '@/components/audio-recorder';
import ConversationView from '@/components/conversation-view';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from "@/hooks/use-toast";
import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import SummarySidebar from '@/components/summary-sidebar';
import { firestore } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const languages = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Español' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'de-DE', label: 'Deutsch' },
  { value: 'it-IT', label: 'Italiano' },
  { value: 'pt-BR', label: 'Português (BR)' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'ko-KR', label: '한국어' },
  { value: 'zh-CN', label: '中文 (简体)' },
  { value: 'kn-IN', label: 'ಕನ್ನಡ' },
  { value: 'ta-IN', label: 'தமிழ்' },
  { value: 'hi-IN', label: 'हिन्दी' },
];

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

  // Load deviceId, language, and response mode from local storage on initial mount
  useEffect(() => {
    let id = localStorage.getItem('chillchacha-device-id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('chillchacha-device-id', id);
    }
    setDeviceId(id);
    
    const savedLanguage = localStorage.getItem('chillchacha-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const savedMode = localStorage.getItem('chillchacha-response-mode');
    if (savedMode === 'voice' || savedMode === 'text') {
      setResponseMode(savedMode);
    } else {
      setResponseMode('voice');
      localStorage.setItem('chillchacha-response-mode', 'voice');
    }
  }, []);

  // Subscribe to Firestore for conversation updates
  useEffect(() => {
    if (deviceId) {
      const q = query(
        collection(firestore, 'sessions'),
        where('uid', '==', deviceId)
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
        // Sort sessions by timestamp client-side
        sessions.sort((a, b) => {
            if (a.timestamp && b.timestamp) {
                return a.timestamp.getTime() - b.timestamp.getTime();
            }
            if (a.timestamp) return 1;
            if (b.timestamp) return -1;
            return 0;
        });
        setConversation(sessions);
      }, (error) => {
        console.error("Firestore snapshot error:", error);
        toast({ variant: "destructive", title: "Connection Error", description: "Could not fetch session history. Please check your internet connection and Firebase setup." });
      });

      return () => unsubscribe();
    }
  }, [deviceId, toast]);

  // Scroll to the bottom of the conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('chillchacha-language', newLanguage);
  };
  
  const handleResponseModeChange = (newMode: 'voice' | 'text') => {
    setResponseMode(newMode);
    localStorage.setItem('chillchacha-response-mode', newMode);
  };

  const handleRecordingComplete = async (audioDataUri: string) => {
    if (!deviceId) return;
    setIsProcessing(true);
    setSummary('');

    // Optimistically add the user's turn to the UI
    const tempProcessingTurnId = crypto.randomUUID();

    // Show a temporary "processing" bubble
    setConversation(prev => [
      ...prev,
      {
        id: tempProcessingTurnId,
        uid: deviceId,
        timestamp: new Date(),
        audio_transcript: '...', // Placeholder for transcription
        detected_emotion: 'thinking',
        ai_response_text: '...',
      },
    ]);

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
        // Remove the processing bubble if silent
        setConversation(prev => prev.filter(turn => turn.id !== tempProcessingTurnId));
      } else {
        // Here is where the conversation state is updated with the real AI response.
        // This causes React to re-render the components with the new data.
        setConversation(prev => 
            prev.map(turn => turn.id === tempProcessingTurnId ? { ...result, id: result.id || tempProcessingTurnId } as Session : turn)
        );

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Voice Generation Failed",
                description: result.error,
            });
        }
      }

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Please try again.";
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: errorMessage,
      });
      // Remove the processing bubble on error
       setConversation(prev => prev.filter(turn => turn.id !== tempProcessingTurnId));
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
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Response Mode</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={responseMode} onValueChange={(value) => handleResponseModeChange(value as 'voice' | 'text')}>
                    <DropdownMenuRadioItem value="voice">Voice</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="text">Text</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Language</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
                     {languages.map(lang => (
                        <DropdownMenuRadioItem key={lang.value} value={lang.value}>{lang.label}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto">
              <ConversationView conversation={conversation} />
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
