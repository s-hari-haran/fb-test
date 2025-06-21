'use client';

import { useState, useRef, useEffect } from 'react';
import type { ConversationTurn } from '@/lib/types';
import { processAudioAction, summarizeConversationAction } from '@/app/actions';
import AudioRecorder from '@/components/audio-recorder';
import ConversationView from '@/components/conversation-view';
import LanguageSelector from '@/components/language-selector';
import { useToast } from "@/hooks/use-toast"
import { Languages } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import SummarySidebar from '@/components/summary-sidebar';

export default function Home() {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast()
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleRecordingComplete = async (audioDataUri: string) => {
    setIsProcessing(true);
    setSummary('');
    try {
      const result = await processAudioAction({ audioDataUri, language });
      if (result) {
        setConversation(prev => [...prev, { id: Date.now(), ...result }]);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to process audio. Please try again.",
      })
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
            <div className="max-w-4xl mx-auto flex items-center justify-end">
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
