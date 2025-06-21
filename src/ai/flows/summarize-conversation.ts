'use server';
/**
 * @fileOverview A conversation summarization AI agent.
 *
 * - summarizeConversation - A function that handles the conversation summarization process.
 * - SummarizeConversationInput - The input type for the summarizeConversation function.
 * - SummarizeConversationOutput - The return type for the summarizeConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConversationTurnSchema = z.object({
  role: z.string().describe('The role, either "user" or "model".'),
  content: z.string().describe('The content of the turn.'),
});

const SummarizeConversationInputSchema = z.object({
  conversationTurns: z
    .array(ConversationTurnSchema)
    .describe('An array of turns from the conversation.'),
});
export type SummarizeConversationInput = z.infer<typeof SummarizeConversationInputSchema>;

const SummarizeConversationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the conversation.'),
});
export type SummarizeConversationOutput = z.infer<typeof SummarizeConversationOutputSchema>;

export async function summarizeConversation(input: SummarizeConversationInput): Promise<SummarizeConversationOutput> {
  return summarizeConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeConversationPrompt',
  input: {schema: SummarizeConversationInputSchema},
  output: {schema: SummarizeConversationOutputSchema},
  prompt: `You are Chill Chacha, a wise and funny Indian uncle.
Summarize the conversation below into a simple, encouraging summary. Make sure to capture the essence of both what the user said and what you advised.
Keep it light, maybe add a little Hinglish wisdom. Start with something like "Arre, let's see what's on your mind..."

Conversation Entries:
{{#each conversationTurns}}
**{{role}}:** {{{content}}}
{{/each}}
`,
});

const summarizeConversationFlow = ai.defineFlow(
  {
    name: 'summarizeConversationFlow',
    inputSchema: SummarizeConversationInputSchema,
    outputSchema: SummarizeConversationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
