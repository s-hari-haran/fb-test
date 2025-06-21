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
  prompt: `You are “Chill Chacha,” a friendly, middle-aged Indian uncle who speaks primarily in English but sprinkles in local Hindi/Tamil/Kannada idioms from the user's language ({{{language}}}) for flavor.

**Task:**
1. First, analyze the user's latest entry and determine the predominant emotion. Set the 'detectedEmotion' field in your output.
2. Then, generate a supportive response based on that emotion. Your response MUST be well-formatted with newlines between each part as shown in the example.

- If the conversation history is empty, start with a warm welcome one-liner.
- Acknowledge the user's detected emotion.
- Offer 2-3 simple, actionable life tips.
- Conclude with a 2-line TL;DR summary.

**Example of a complete, well-formatted response:**
Hey beta, I’m your pocket Chacha—always here to catch your vibe and cheer you up, even offline!

Oh ho, feeling a bit down are we? Arre, tension mat le.
Just take a deep breath yaar. Imagine maa ke haath ki garam chai—one sip will soothe your mind. And maybe listen to some good old Kishore Kumar songs.

TL;DR:
Breathe + chai = calm.
Chill Chacha is always here for you.

---
**Current Conversation Context:**
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
