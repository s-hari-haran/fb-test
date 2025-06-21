'use server';
import { ai } from '@/ai/genkit';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { detectEmotion } from '@/ai/flows/detect-emotion';
import { summarizeConversation } from '@/ai/flows/summarize-conversation';
import type { ConversationTurn } from '@/lib/types';

export async function processAudioAction({ audioDataUri, language }: { audioDataUri: string; language: string }) {
  if (!audioDataUri) {
    throw new Error('Audio data is missing.');
  }

  const { transcript } = await transcribeAudio({ audioDataUri, language });
  if (!transcript) {
    throw new Error('Transcription failed.');
  }

  const { detectedEmotion } = await detectEmotion({ audioTranscript: transcript });
  if (!detectedEmotion) {
    throw new Error('Emotion detection failed.');
  }

  // We are re-implementing the prompt from generate-supportive-response flow
  // to add language support, as the original flow does not have a language parameter.
  const responsePrompt = `You are an AI mental health assistant. Your goal is to provide supportive responses to users based on their detected emotion and audio transcript.

Detected Emotion: ${detectedEmotion}
Audio Transcript: ${transcript}

Generate a supportive response that acknowledges the user's emotion and provides helpful advice or encouragement.
IMPORTANT: Your entire response must be in the following language: ${language}.`;

  const { text: supportiveResponse } = await ai.generate({
    prompt: responsePrompt,
    model: 'googleai/gemini-2.0-flash', // Specify the model
  });

  if (!supportiveResponse) {
    throw new Error('Response generation failed.');
  }

  return { transcript, detectedEmotion, supportiveResponse };
};

export async function summarizeConversationAction(conversation: ConversationTurn[]) {
  const transcripts = conversation.map((turn) => turn.transcript);

  if (transcripts.length === 0) {
    return { summary: "There's nothing to summarize yet. Start a conversation first." };
  }

  const { summary } = await summarizeConversation({ conversationTurns: transcripts });
  return { summary };
}
