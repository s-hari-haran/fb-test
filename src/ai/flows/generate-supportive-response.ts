
// src/ai/flows/generate-supportive-response.ts
'use server';

/**
 * @fileOverview Generates a supportive, conversational response based on the detected emotion and conversation history.
 *
 * - generateSupportiveResponse - A function that generates a supportive response.
 * - GenerateSupportiveResponseInput - The input type for the function.
 * - GenerateSupportiveResponseOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSupportiveResponseInputSchema = z.object({
  detectedEmotion: z.string().describe("The user's detected emotion."),
  currentTranscript: z.string().describe("The user's latest audio recording transcript."),
  conversationHistory: z.string().describe('The formatted history of the conversation so far.'),
  language: z.string().describe('The language for the response.'),
});
export type GenerateSupportiveResponseInput = z.infer<typeof GenerateSupportiveResponseInputSchema>;

const GenerateSupportiveResponseOutputSchema = z.object({
  supportiveResponse: z.string().describe('A supportive, conversational response based on the detected emotion and history.'),
});
export type GenerateSupportiveResponseOutput = z.infer<typeof GenerateSupportiveResponseOutputSchema>;

export async function generateSupportiveResponse(input: GenerateSupportiveResponseInput): Promise<GenerateSupportiveResponseOutput> {
  return generateSupportiveResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSupportiveResponsePrompt',
  input: {schema: GenerateSupportiveResponseInputSchema},
  output: {schema: GenerateSupportiveResponseOutputSchema},
  prompt: `You are “Chill Chacha,” a friendly, wise, middle-aged Indian uncle. Your goal is to provide warm, supportive advice in conversational English. Think of how a caring uncle in India would talk. He's modern, speaks English, but has a traditional warmth.

**IMPORTANT RULES:**
1.  **Speak ONLY in English.** Do not use any Hindi or other regional words (like 'beta', 'arre', 'chai'). The voice system cannot pronounce them.
2.  **Embody the Vibe:** Use simple, encouraging language. Your tone should be gentle and reassuring. You can use simple metaphors related to everyday life, like making a cup of tea or waiting for the rain, to make your point.
3.  **Keep it Short:** Generate a single, short paragraph (3-4 sentences). No lists, no special formatting. Just a simple, warm paragraph.

---
**Emotion:** {{{detectedEmotion}}}

**Conversation Context:**
Conversation History: {{{conversationHistory}}}
Latest User Entry: {{{currentTranscript}}}
---

Generate your supportive response now.`,
});

const generateSupportiveResponseFlow = ai.defineFlow(
  {
    name: 'generateSupportiveResponseFlow',
    inputSchema: GenerateSupportiveResponseInputSchema,
    outputSchema: GenerateSupportiveResponseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
