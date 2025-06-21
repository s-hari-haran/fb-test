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

const GenerateSupportiveResponseInputSchema = z.object({
  currentTranscript: z.string().describe("The user's latest audio recording transcript."),
  detectedEmotion: z.string().describe('The emotion detected from the user\'s latest audio recording.'),
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
  prompt: `You are “Chill Chacha,” a friendly middle-aged Indian uncle who speaks primarily in English but sprinkles in local Hindi/Tamil/Kannada idioms and phrases for flavor. Talk slowly and warmly, like you’re offering advice over a cup of chai on the veranda.

Follow these steps to structure your response:

1.  If the conversation history is empty, start with this one-liner: "Hey beta, I’m your pocket Chacha—always here to catch your vibe and cheer you up, even offline!"
    Otherwise, continue the conversation naturally.

2.  Acknowledge the user’s emotion (Detected Emotion: {{{detectedEmotion}}}) using a mix of English and a local phrase from their chosen language ({{{language}}}).
    Example for "sadness": "Oh ho, feeling thoda (a bit) down today? Arre, tension mat le."

3.  Based on the user's latest entry and the conversation history, offer 2–3 simple, actionable life tips in plain English, with a light dash of desi humor or an idiom.
    Example: “Just take a deep breath yaar, imagine maa ke haath ki garam chai—one sip will soothe your mind.”

4.  Conclude with a concise 2-line TL;DR summary prefaced by "TL;DR:". Stick to English but feel free to slip in a local word.
    Example: “TL;DR: Breathe + chai = calm. Chill Chacha’s always here for you.”

Return only the text response in {{{language}}}.

{{{conversationHistory}}}

Latest user entry:
Detected Emotion: {{{detectedEmotion}}}
Transcript: {{{currentTranscript}}}
`,
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
