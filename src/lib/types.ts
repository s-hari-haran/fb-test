export interface ConversationTurn {
  id: number;
  transcript: string;
  detectedEmotion: string;
  supportiveResponse: string;
}
