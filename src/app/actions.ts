'use server';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { detectEmotion } from '@/ai/flows/detect-emotion';
import { generateSupportiveResponse } from '@/ai/flows/generate-supportive-response';
import { summarizeConversation } from '@/ai/flows/summarize-conversation';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { Session } from '@/lib/types';
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

// Helper type for conversation history passed to the AI flow
type Turn = {
  role: 'user' | 'model';
  content: string;
};

// Step 1: Process user's audio and create the initial session entry
export async function processUserAudio({
  uid,
  audioDataUri,
  language,
}: {
  uid: string;
  audioDataUri: string;
  language: string;
}) {
  if (!uid) {
    throw new Error('User is not authenticated.');
  }
  if (!audioDataUri) {
    throw new Error('Audio data is missing.');
  }

  // 1. Transcribe audio
  const { transcript } = await transcribeAudio({ audioDataUri, language });
  if (!transcript) {
    return { id: null, transcript: null, detectedEmotion: null, error: 'silent' };
  }

  // 2. Detect emotion
  const { detectedEmotion } = await detectEmotion({ audioTranscript: transcript });
  if (!detectedEmotion) {
    throw new Error('Emotion detection failed.');
  }

  // 3. Save initial session to Firestore
  const sessionRef = await addDoc(collection(firestore, 'sessions'), {
    uid,
    timestamp: serverTimestamp(),
    audio_transcript: transcript,
    detected_emotion: detectedEmotion,
    ai_response_text: '', // Initially empty
    ai_response_audio_uri: '', // Initially empty
  });

  return { id: sessionRef.id, transcript, detectedEmotion, error: null };
}

// Step 2: Generate AI response and update the session
export async function generateAndSaveChachaResponse({
  sessionId,
  conversationHistory,
  language,
}: {
  sessionId: string;
  conversationHistory: Turn[];
  language: string;
}) {
  const sessionDocRef = doc(firestore, 'sessions', sessionId);
  const sessionDoc = await getDoc(sessionDocRef);

  if (!sessionDoc.exists()) {
    throw new Error('Session not found.');
  }

  const { audio_transcript: currentTranscript, detected_emotion: detectedEmotion } = sessionDoc.data();

  // 1. Generate Chill Chacha response text using the flow
  const { supportiveResponse: supportiveResponseText } =
    await generateSupportiveResponse({
      currentTranscript,
      detectedEmotion,
      conversationHistory,
      language,
    });

  if (!supportiveResponseText) {
    throw new Error('Response generation failed.');
  }

  // 2. Generate audio from the response text
  const { audioDataUri: responseAudioUri } = await textToSpeech({
    text: supportiveResponseText,
  });

  if (!responseAudioUri) {
    throw new Error('Text-to-speech conversion failed.');
  }

  // 3. Update session with AI response text and audio URI
  await updateDoc(sessionDocRef, {
    ai_response_text: supportiveResponseText,
    ai_response_audio_uri: responseAudioUri,
  });

  return { success: true };
}


export async function summarizeConversationAction(conversation: Session[]) {
  const transcripts = conversation.map((turn) => turn.audio_transcript);

  if (transcripts.length === 0) {
    return { summary: "There's nothing to summarize yet. Start a conversation first." };
  }

  const { summary } = await summarizeConversation({ conversationTurns: transcripts });
  return { summary };
}
