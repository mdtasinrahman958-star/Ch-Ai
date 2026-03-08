import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Heart, ChevronRight, Clock } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Character, ChatHistory } from '../types';
import { formatDistanceToNow } from 'date-fns';

export const ChatsPage = () => {
  const [chats, setChats] = useState<Record<string, ChatHistory>>({});
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    setChats(storageService.getAllChats());
    setCharacters(storageService.getCharacters());
  }, []);

  const activeChats = (Object.values(chats) as ChatHistory[]).filter(chat => chat.messages.length > 0);

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto min-h-screen">
      <header className="mb-16 space-y-4">
        <div className="flex items-center space-x-2 text-rose-500 font-mono text-xs tracking-widest uppercase">
          <MessageSquare className="w-3 h-3" />
          <span>Communication Archive</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-black text-white tracking-tighter leading-none">
          Recent <span className="text-rose-500">Echoes</span>
        </h1>
        <p className="text-zinc-500 text-lg font-light leading-relaxed">
          Reconnect with the digital signatures you've encountered.
        </p>
      </header>

      <div className="space-y-6">
        {activeChats.length > 0 ? (
          activeChats.sort((a, b) => {
            const lastA = a.messages[a.messages.length - 1].timestamp;
            const lastB = b.messages[b.messages.length - 1].timestamp;
            return lastB - lastA;
          }).map(chat => {
            const char = characters.find(c => c.id === chat.characterId);
            if (!char) return null;
            const lastMsg = chat.messages[chat.messages.length - 1];

            return (
              <Link
                key={chat.characterId}
                to={`/chat/${chat.characterId}`}
                className="flex items-center p-6 bg-zinc-900/40 rounded-[2rem] border border-white/5 hover:border-rose-500/30 transition-all group backdrop-blur-3xl"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-rose-500 rounded-2xl blur-md opacity-0 group-hover:opacity-20 transition-opacity" />
                  <img 
                    src={char.avatarUrl} 
                    alt={char.name} 
                    className="relative w-16 h-16 rounded-2xl object-cover border border-white/10 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="ml-6 flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold text-xl text-white tracking-tight">{char.name}</h3>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center">
                      <Clock className="w-3 h-3 mr-2" />
                      {formatDistanceToNow(lastMsg.timestamp)} ago
                    </span>
                  </div>
                  <p className="text-zinc-500 font-light truncate pr-8 leading-relaxed">
                    {lastMsg.role === 'user' ? (
                      <span className="text-rose-500/60 font-mono text-[10px] uppercase mr-2 tracking-widest">You</span>
                    ) : null}
                    {lastMsg.content}
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5 backdrop-blur-sm">
            <div className="p-8 bg-zinc-900 border border-white/10 rounded-full mb-8">
              <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3">The archive is empty</h3>
            <p className="text-zinc-500 text-lg font-light mb-10 max-w-xs text-center">No active conversations found in the protocol.</p>
            <Link 
              to="/" 
              className="px-10 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold transition-all shadow-2xl shadow-rose-500/20 active:scale-95"
            >
              Return to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
