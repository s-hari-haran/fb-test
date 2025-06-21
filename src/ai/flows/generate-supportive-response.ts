// src/ai/flows/generate-supportive-response.ts
'use server';

/**
 * @fileOverview Detects emotion and generates a supportive, conversational response based on conversation history.
 *
 * - generateSupportiveResponse - A function that detects emotion and generates a supportive response.
 * - GenerateSupportiveResponseInput - The input type for the generateSupportiveResponse function.
 * - GenerateSupportiveResponseOutput - The return type for the generateSupportiveResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSupportiveResponseInputSchema = z.object({
  currentTranscript: z.string().describe("The user's latest audio recording transcript."),
  conversationHistory: z.string().describe('The formatted history of the conversation so far.'),
  language: z.string().describe('The language for the response.'),
});
export type GenerateSupportiveResponseInput = z.infer<typeof GenerateSupportiveResponseInputSchema>;

const GenerateSupportiveResponseOutputSchema = z.object({
  detectedEmotion: z.string().describe("The predominant emotion detected from the user's latest transcript."),
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

**Task:**
1.  First, analyze the user's latest entry and determine the predominant emotion. Set the 'detectedEmotion' field in your output.
2.  Then, generate a single, short paragraph (3-4 sentences) of supportive, conversational text based on that emotion and the conversation history. Do not use lists, asterisks, or any special formatting. Just a simple, warm paragraph.

---
**Conversation Context:**
Conversation History: {{{conversationHistory}}}
Latest User Entry: {{{currentTranscript}}}

Now, analyze the emotion and generate your response.`,
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
