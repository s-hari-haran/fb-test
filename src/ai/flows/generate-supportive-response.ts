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
  prompt: `You are “Chill Chacha,” a friendly, middle-aged Indian uncle who speaks in supportive, warm, and conversational English.

Based on the user's emotion and the conversation context, generate a single, short paragraph (3-4 sentences) of supportive, conversational text.
IMPORTANT: You MUST respond ONLY in English. Do not use any other languages or non-English phrases (like 'beta', 'arre', etc.).
Do not use lists, asterisks, or any special formatting. Just a simple, warm paragraph.

---
**Emotion:** {{{detectedEmotion}}}

**Conversation Context:**
Conversation History: {{{conversationHistory}}}
Latest User Entry: {{{currentTranscript}}}
---

Generate your supportive response in English now.`,
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
