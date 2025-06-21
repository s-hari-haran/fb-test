import { config } from 'dotenv';
config();

import '@/ai/flows/transcribe-audio.ts';
import '@/ai/flows/detect-emotion.ts';
import '@/ai/flows/translate-audio.ts';
import '@/ai/flows/generate-supportive-response.ts';