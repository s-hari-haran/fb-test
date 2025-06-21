import { config } from 'dotenv';
config();

import '@/ai/flows/transcribe-audio.ts';
import '@/ai/flows/generate-supportive-response.ts';
import '@/ai/flows/summarize-conversation.ts';
import '@/ai/flows/text-to-speech.ts';
