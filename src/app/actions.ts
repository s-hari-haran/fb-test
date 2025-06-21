'use server';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
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

  // 2. Generate response and detect emotion in one step for better performance
  const historyString = conversationHistory.length > 0 
    ? "Conversation History:\n" + conversationHistory.map(turn => `${turn.role}: ${turn.content}`).join('\n')
    : "";
  
  const { supportiveResponse: aiResponseText, detectedEmotion } = await generateSupportiveResponse({
    currentTranscript: transcript,
    conversationHistory: historyString,
    language,
  });
   if (!aiResponseText || !detectedEmotion) {
    throw new Error('Response generation or emotion detection failed.');
  }

  // 3. Conditionally generate audio for the response
  let aiResponseAudioUri: string | undefined = undefined;
  if (responseMode === 'voice') {
      try {
        const { audioDataUri } = await textToSpeech({ text: aiResponseText });
        aiResponseAudioUri = audioDataUri;
      } catch (e) {
        console.error("Text-to-speech conversion failed:", e);
        // We can continue without audio, aiResponseAudioUri will remain undefined.
      }
  }

  // 4. Create session object for UI update
  const newSessionTurn: Omit<Session, 'id' | 'timestamp'> = {
    uid,
    audio_transcript: transcript,
    detected_emotion: detectedEmotion,
    ai_response_text: aiResponseText,
    ai_response_audio_uri: aiResponseAudioUri,
  };
  
  // 5. Prepare data for Firestore, removing any undefined fields to prevent errors.
  const dataToSave: any = {
      ...newSessionTurn,
      timestamp: serverTimestamp(),
  };
  if (dataToSave.ai_response_audio_uri === undefined) {
      delete dataToSave.ai_response_audio_uri;
  }
  
  // Save to Firestore in the background
  addDoc(collection(firestore, 'sessions'), dataToSave).catch(console.error);
  
  // 6. Return the full turn data to the client for immediate UI update
  return {
    id: crypto.randomUUID(), // A temporary ID for React key
    ...newSessionTurn,
    timestamp: new Date(), // Use client-side date for optimistic update
    error: null,
  };
}


export async function summarizeConversationAction(conversation: Session[]) {
  if (conversation.length === 0) {
    return { summary: "There's nothing to summarize yet. Start a conversation first." };
  }

  const conversationTurns = conversation.flatMap(turn => [
    { role: 'user', content: turn.audio_transcript },
    { role: 'model', content: turn.ai_response_text },
  ]).filter(turn => turn.content);

  const { summary } = await summarizeConversation({ conversationTurns });
  return { summary };
}
