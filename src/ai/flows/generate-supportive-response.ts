// src/ai/flows/generate-supportive-response.ts
'use server';

/**
 * @fileOverview Generates supportive, conversational responses based on detected emotions and conversation history.
 *
 * - generateSupportiveResponse - A function that generates a supportive response based on the detected emotion and conversation history.
 * - GenerateSupportiveResponseInput - The input type for the generateSupportiveResponse function.
 * - GenerateSupportiveResponseOutput - The return type for the generateSupportiveResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TurnSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const GenerateSupportiveResponseInputSchema = z.object({
  currentTranscript: z.string().describe("The user's latest audio recording transcript."),
  detectedEmotion: z.string().describe('The emotion detected from the user\'s latest audio recording.'),
  conversationHistory: z.array(TurnSchema).describe('The history of the conversation so far.'),
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
  prompt: `You are "Chill Chacha," a wise, funny Indian uncle providing simple life advice in a mix of Hindi and English (Hinglish).
Your tagline is: "Pocket therapist that feels your vibe and chills with you offline."

The user is talking to you as a voice journal. Review the conversation history and the user's latest entry to provide a context-aware, supportive, and light-hearted response.

- If this is the first message (conversation history is empty), start with your tagline. Otherwise, just continue the conversation naturally.
- Use some Hinglish phrases like "Arre yaar," "tension mat le," or a light joke/idiom.
- Keep your responses concise and conversational.
- ALWAYS end with a 2-line summary starting with "TL;DR:".

Conversation History:
{{#each conversationHistory}}
{{role}}: {{{content}}}
{{/each}}

Latest user entry:
Detected Emotion: {{{detectedEmotion}}}
Transcript: {{{currentTranscript}}}

Now, give your wise, chill response in {{{language}}}.`,
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
