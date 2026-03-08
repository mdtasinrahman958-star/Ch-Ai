import { Character, ChatHistory, Message } from '../types';

const CHARACTERS_KEY = 'soullink_characters';
const CHATS_KEY = 'soullink_chats';

export const storageService = {
  getCharacters: (): Character[] => {
    const data = localStorage.getItem(CHARACTERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCharacter: (character: Character) => {
    const characters = storageService.getCharacters();
    characters.push(character);
    localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
  },

  deleteCharacter: (id: string) => {
    const characters = storageService.getCharacters().filter(c => c.id !== id);
    localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
    // Also delete chat history
    const chats = storageService.getAllChats();
    delete chats[id];
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  },

  getAllChats: (): Record<string, ChatHistory> => {
    const data = localStorage.getItem(CHATS_KEY);
    return data ? JSON.parse(data) : {};
  },

  getChatHistory: (characterId: string): Message[] => {
    const chats = storageService.getAllChats();
    return chats[characterId]?.messages || [];
  },

  saveMessage: (characterId: string, message: Message) => {
    const chats = storageService.getAllChats();
    if (!chats[characterId]) {
      chats[characterId] = { characterId, messages: [] };
    }
    chats[characterId].messages.push(message);
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  },

  clearChat: (characterId: string) => {
    const chats = storageService.getAllChats();
    chats[characterId] = { characterId, messages: [] };
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  },

  clearAllData: () => {
    localStorage.removeItem(CHARACTERS_KEY);
    localStorage.removeItem(CHATS_KEY);
  }
};
