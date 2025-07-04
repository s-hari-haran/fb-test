// This is an autogenerated file from Firebase Studio.
'use server';

/**
 * @fileOverview Emotion detection AI agent.
 *
 * - detectEmotion - A function that handles the emotion detection process.
 * - DetectEmotionInput - The input type for the detectEmotion function.
 * - DetectEmotionOutput - The return type for the detectEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectEmotionInputSchema = z.object({
  audioTranscript: z.string().describe('The transcript of the user audio.'),
});
export type DetectEmotionInput = z.infer<typeof DetectEmotionInputSchema>;

const DetectEmotionOutputSchema = z.object({
  detectedEmotion: z.string().describe('The predominant emotion detected in the audio transcript.'),
});
export type DetectEmotionOutput = z.infer<typeof DetectEmotionOutputSchema>;

export async function detectEmotion(input: DetectEmotionInput): Promise<DetectEmotionOutput> {
  return detectEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectEmotionPrompt',
  input: {schema: DetectEmotionInputSchema},
  output: {schema: DetectEmotionOutputSchema},
  prompt: `Analyze the following text and detect the predominant emotion expressed. Respond ONLY with the emotion detected (e.g., "anger", "sadness", "joy", "fear", "disgust", "surprise", "neutral").

Text: {{{audioTranscript}}}`,
});

const detectEmotionFlow = ai.defineFlow(
  {
    name: 'detectEmotionFlow',
    inputSchema: DetectEmotionInputSchema,
    outputSchema: DetectEmotionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
