export interface Message {
  message_id: string;
  conversation_id: string;
  sender_type: SenderType;
  created_at: Date;
}

export type SenderType = "PERSON" | "BOT";
