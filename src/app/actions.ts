'use server';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { detectEmotion } from '@/ai/flows/detect-emotion';
import { generateSupportiveResponse } from '@/ai/flows/generate-supportive-response';
import { summarizeConversation } from '@/ai/flows/summarize-conversation';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { Session } from '@/lib/types';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

// Helper type for conversation history passed to the AI flow
type Turn = {
  role: 'user' | 'model';
  content: string;
};

export async function recordAndAnalyzeAudio({
  uid,
  audioDataUri,
  language,
  conversationHistory,
}: {
  uid: string;
  audioDataUri: string;
  language: string;
  conversationHistory: Turn[];
}) {
  if (!uid) {
    throw new Error('User is not authenticated.');
  }
  if (!audioDataUri) {
    throw new Error('Audio data is missing.');
  }

  // 1. Transcribe and detect emotion
  const { transcript } = await transcribeAudio({ audioDataUri, language });
  if (!transcript) {
    throw new Error('Transcription failed.');
  }

  const { detectedEmotion } = await detectEmotion({ audioTranscript: transcript });
  if (!detectedEmotion) {
    throw new Error('Emotion detection failed.');
  }

  // 2. Save initial session to Firestore
  const sessionRef = await addDoc(collection(firestore, 'sessions'), {
    uid,
    timestamp: serverTimestamp(),
    audio_transcript: transcript,
    detected_emotion: detectedEmotion,
    ai_response_text: '', // Initially empty
    ai_response_audio_uri: '', // Initially empty
  });

  // 3. Generate Chill Chacha response text using the flow
  const { supportiveResponse: supportiveResponseText } =
    await generateSupportiveResponse({
      currentTranscript: transcript,
      detectedEmotion,
      conversationHistory,
      language,
    });

  if (!supportiveResponseText) {
    throw new Error('Response generation failed.');
  }

  // 4. Generate audio from the response text
  const { audioDataUri: responseAudioUri } = await textToSpeech({
    text: supportiveResponseText,
  });

  if (!responseAudioUri) {
    throw new Error('Text-to-speech conversion failed.');
  }

  // 5. Update session with AI response text and audio URI
  await updateDoc(doc(firestore, 'sessions', sessionRef.id), {
    ai_response_text: supportiveResponseText,
    ai_response_audio_uri: responseAudioUri,
  });

  return { id: sessionRef.id };
}


export async function summarizeConversationAction(conversation: Session[]) {
  const transcripts = conversation.map((turn) => turn.audio_transcript);

  if (transcripts.length === 0) {
    return { summary: "There's nothing to summarize yet. Start a conversation first." };
  }

  const { summary } = await summarizeConversation({ conversationTurns: transcripts });
  return { summary };
}
