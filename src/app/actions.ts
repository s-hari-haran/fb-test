'use server';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { detectEmotion } from '@/ai/flows/detect-emotion';
import { generateSupportiveResponse } from '@/ai/flows/generate-supportive-response';
import { summarizeConversation } from '@/ai/flows/summarize-conversation';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { Session } from '@/lib/types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

// Helper type for conversation history passed to the AI flow
type Turn = {
  role: 'user' | 'model';
  content: string;
};

export async function handleUserTurn({
  uid,
  audioDataUri,
  language,
  conversationHistory,
  responseMode,
}: {
  uid: string;
  audioDataUri: string;
  language: string;
  conversationHistory: Turn[];
  responseMode: 'voice' | 'text';
}) {
  if (!uid) {
    throw new Error('User/device ID is missing.');
  }
  if (!audioDataUri) {
    throw new Error('Audio data is missing.');
  }

  // 1. Transcribe audio
  const { transcript } = await transcribeAudio({ audioDataUri, language });
  if (!transcript) {
    return { error: 'silent' };
  }

  // 2. Detect emotion
  const { detectedEmotion } = await detectEmotion({ audioTranscript: transcript });
  if (!detectedEmotion) {
    throw new Error('Emotion detection failed.');
  }
  
  const historyString = conversationHistory.length > 0 
    ? "Conversation History:\n" + conversationHistory.map(turn => `${turn.role}: ${turn.content}`).join('\n')
    : "";


  // 3. Generate Chill Chacha response text
  const { supportiveResponse: aiResponseText } = await generateSupportiveResponse({
    currentTranscript: transcript,
    detectedEmotion,
    conversationHistory: historyString,
    language,
  });
   if (!aiResponseText) {
    throw new Error('Response generation failed.');
  }

  // 4. Conditionally generate audio for the response
  let aiResponseAudioUri: string | undefined = undefined;
  if (responseMode === 'voice') {
      try {
        const { audioDataUri } = await textToSpeech({ text: aiResponseText });
        aiResponseAudioUri = audioDataUri;
      } catch (e) {
        console.error("Text-to-speech conversion failed:", e);
        // We can continue without audio
      }
  }

  // 5. Create new session object for the UI and database
  const newSessionTurn: Omit<Session, 'id' | 'timestamp'> = {
    uid,
    audio_transcript: transcript,
    detected_emotion: detectedEmotion,
    ai_response_text: aiResponseText,
    ai_response_audio_uri: aiResponseAudioUri,
  };
  
  // 6. Save to Firestore in the background
  addDoc(collection(firestore, 'sessions'), {
    ...newSessionTurn,
    timestamp: serverTimestamp(),
  }).catch(console.error);
  
  // 7. Return the full turn data to the client for immediate UI update
  return {
    id: crypto.randomUUID(), // A temporary ID for React key
    ...newSessionTurn,
    timestamp: new Date(), // Use client-side date for optimistic update
    error: null,
  };
}


export async function summarizeConversationAction(conversation: Session[]) {
  const transcripts = conversation.map((turn) => turn.audio_transcript);

  if (transcripts.length === 0) {
    return { summary: "There's nothing to summarize yet. Start a conversation first." };
  }

  const { summary } = await summarizeConversation({ conversationTurns: transcripts });
  return { summary };
}
