'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';

type AudioRecorderProps = {
  onRecordingComplete: (audioDataUri: string) => void;
  isProcessing: boolean;
};

export default function AudioRecorder({ onRecordingComplete, isProcessing }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onRecordingComplete(base64data);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setTimer(0);
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert("Could not start recording. Please ensure you have a microphone and have granted permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 w-full">
      <div className="w-20 text-center">
        <span className="font-mono text-lg text-muted-foreground">{formatTime(timer)}</span>
      </div>
      <Button
        onClick={handleButtonClick}
        disabled={isProcessing}
        className={`w-16 h-16 rounded-full transition-all duration-300 ease-in-out shadow-lg transform active:scale-95 ${
          isRecording ? 'bg-accent animate-pulse-ring' : 'bg-primary'
        }`}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isProcessing ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : isRecording ? (
          <Square className="w-8 h-8 text-accent-foreground fill-current" />
        ) : (
          <Mic className="w-8 h-8 text-primary-foreground" />
        )}
      </Button>
       <div className="w-20 text-center">
        {isRecording ? (
            <span className="text-sm text-accent font-semibold">Recording...</span>
        ) : isProcessing ? (
            <span className="text-sm text-primary font-semibold">Processing...</span>
        ) : (
            <span className="text-sm text-muted-foreground">Tap to record</span>
        )}
       </div>
    </div>
  );
}
