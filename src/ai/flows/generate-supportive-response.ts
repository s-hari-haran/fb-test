// src/ai/flows/generate-supportive-response.ts
'use server';

/**
 * @fileOverview Generates supportive responses based on detected emotions.
 *
 * - generateSupportiveResponse - A function that generates a supportive response based on the detected emotion.
 * - GenerateSupportiveResponseInput - The input type for the generateSupportiveResponse function.
 * - GenerateSupportiveResponseOutput - The return type for the generateSupportiveResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSupportiveResponseInputSchema = z.object({
  detectedEmotion: z.string().describe('The emotion detected from the user\'s audio recording.'),
  audioTranscript: z.string().describe('The transcript of the user\'s audio recording.'),
});
export type GenerateSupportiveResponseInput = z.infer<typeof GenerateSupportiveResponseInputSchema>;

const GenerateSupportiveResponseOutputSchema = z.object({
  supportiveResponse: z.string().describe('A supportive response based on the detected emotion.'),
});
export type GenerateSupportiveResponseOutput = z.infer<typeof GenerateSupportiveResponseOutputSchema>;

export async function generateSupportiveResponse(input: GenerateSupportiveResponseInput): Promise<GenerateSupportiveResponseOutput> {
  return generateSupportiveResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSupportiveResponsePrompt',
  input: {schema: GenerateSupportiveResponseInputSchema},
  output: {schema: GenerateSupportiveResponseOutputSchema},
  prompt: `You are an AI mental health assistant. Your goal is to provide supportive responses to users based on their detected emotion and audio transcript.

  Detected Emotion: {{{detectedEmotion}}}
  Audio Transcript: {{{audioTranscript}}}

  Generate a supportive response that acknowledges the user's emotion and provides helpful advice or encouragement.`,
});

const generateSupportiveResponseFlow = ai.defineFlow(
  {
    name: 'generateSupportiveResponseFlow',
    inputSchema: GenerateSupportiveResponseInputSchema,
    outputSchema: GenerateSupportiveResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
