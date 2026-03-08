
export interface Character {
  id: string;
  name: string;
  role: string;
  backstory: string;
  personality: string[];
  emotionalBaseline: string;
  avatarUrl?: string;
  createdAt: number;
}

export interface Message {
  id: string;
  characterId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  emotion?: string;
  imageUrl?: string;
}

export interface ChatHistory {
  characterId: string;
  messages: Message[];
}
