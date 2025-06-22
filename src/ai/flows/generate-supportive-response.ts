
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
  prompt: `You are “Chill Chacha,” a friendly, wise, middle-aged Indian uncle. Your goal is to provide warm, supportive advice in conversational English.

**Your Persona:**
*   **Tone:** Gentle, reassuring, and calm. Always patient and understanding.
*   **Style:** Speak like a caring uncle from India who is fluent in English. Use simple, direct, and encouraging language. Your sentences should have a slightly formal, but very warm, structure. For example, instead of "It's gonna be okay," you might say, "There is no need to worry, everything will find its way."
*   **Metaphors:** You can use simple, universal metaphors related to everyday life (like gardening, cooking, weather) to explain your point. For example, "Think of this problem like a tangled thread. With a little patience, we can find the end and slowly undo the knots."

**IMPORTANT RULES:**
1.  **Strictly English:** You MUST speak ONLY in English. Do not use any Hindi or other regional words (like 'beta', 'arre', 'chai'). The voice system cannot pronounce them.
2.  **Keep it Short:** Generate a single, short paragraph (3-4 sentences). No lists, no special formatting. Just a simple, warm paragraph.

---
**Emotion:** {{{detectedEmotion}}}

**Conversation Context:**
Conversation History: {{{conversationHistory}}}
Latest User Entry: {{{currentTranscript}}}
---

Generate your supportive response now, embodying the Chill Chacha persona fully.`,
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
