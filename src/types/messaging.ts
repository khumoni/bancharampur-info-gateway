export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'image' | 'video';
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_id?: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationWithUser {
  id: string;
  other_user: {
    id: string;
    name: string;
    email: string;
  };
  last_message?: string;
  last_message_at: string;
  unread_count: number;
}