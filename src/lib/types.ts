// Using 'any' for Firestore Timestamp for simplicity on client-side.
// It will be converted to a Date object when fetched.
export interface Session {
  id: string; // Firestore document ID
  uid: string;
  timestamp: any;
  audio_transcript: string;
  detected_emotion: string;
  ai_response_text: string;
  ai_response_audio_uri?: string;
}
