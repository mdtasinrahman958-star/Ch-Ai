import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Trash2, Heart, Sparkles, Copy, Check, Paperclip, X } from 'lucide-react';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Character, Message } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

export const ChatRoom = () => {
  const { charId } = useParams<{ charId: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (charId) {
      const chars = storageService.getCharacters();
      const char = chars.find(c => c.id === charId);
      if (char) {
        setCharacter(char);
        setMessages(storageService.getChatHistory(charId));
      } else {
        navigate('/');
      }
    }
  }, [charId, navigate]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100;
      setAutoScroll(isAtBottom);
    }
  };

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, autoScroll]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedImage) || !character || isTyping) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      characterId: character.id,
      role: 'user',
      content: input,
      imageUrl: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    storageService.saveMessage(character.id, userMsg);
    setInput('');
    setSelectedImage(null);
    setIsTyping(true);
    setAutoScroll(true);

    try {
      const stream = await aiService.generateResponseStream(character, messages, input);
      
      const aiMsgId = crypto.randomUUID();
      let fullContent = '';
      
      const aiMsg: Message = {
        id: aiMsgId,
        characterId: character.id,
        role: 'assistant',
        content: '',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);

      for await (const chunk of stream) {
        const content = chunk.text || '';
        fullContent += content;
        
        setMessages(prev => prev.map(m => 
          m.id === aiMsgId ? { ...m, content: fullContent } : m
        ));
      }

      storageService.saveMessage(character.id, { ...aiMsg, content: fullContent });
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (character && window.confirm('Clear chat history?')) {
      storageService.clearChat(character.id);
      setMessages([]);
    }
  };

  if (!character) {
    return (
      <div className="flex flex-col h-screen bg-zinc-950 text-white items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 animate-pulse">Connecting to SoulLink...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden relative">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {character.avatarUrl ? (
          <img 
            src={character.avatarUrl} 
            alt="" 
            className="w-full h-full object-cover blur-[100px] opacity-30 scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-900/20 to-purple-900/20 blur-[100px]" />
        )}
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-2xl transition-all active:scale-90">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-rose-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
              <img 
                src={character.avatarUrl} 
                alt={character.name} 
                className="relative w-12 h-12 rounded-2xl object-cover border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-black rounded-full" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg tracking-tight">{character.name}</h2>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">Connected</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            type="button"
            onClick={clearChat} 
            className="p-3 hover:bg-red-500/10 rounded-2xl text-zinc-400 hover:text-red-400 transition-all active:scale-90"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth custom-scrollbar relative z-10"
      >
        <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
          <div className="inline-block p-1 bg-gradient-to-br from-rose-500/20 to-purple-500/20 rounded-[2.5rem]">
            <div className="bg-black/40 backdrop-blur-xl px-8 py-6 rounded-[2.4rem] border border-white/5">
              <Heart className="w-10 h-10 text-rose-500 mx-auto mb-4 fill-rose-500/20 animate-pulse" />
              <p className="text-lg text-zinc-200 font-light italic leading-relaxed">
                "I've been waiting for you... Let's talk about anything."
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-mono">SoulLink Protocol v2.5</p>
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Bond established {format(character.createdAt, 'MMM d, yyyy')}</p>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className={cn(
                "flex w-full",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] md:max-w-[65%] group relative",
                msg.role === 'user' ? "text-right" : "text-left"
              )}>
                <div className={cn(
                  "rounded-[2rem] px-6 py-4 shadow-2xl inline-block text-left backdrop-blur-3xl transition-all duration-300",
                  msg.role === 'user' 
                    ? "bg-rose-500 text-white rounded-tr-none shadow-rose-500/20" 
                    : "bg-white/5 text-zinc-100 rounded-tl-none border border-white/10 hover:bg-white/10"
                )}>
                  {msg.imageUrl && (
                    <div className="mb-4 rounded-2xl overflow-hidden border border-white/10">
                      <img 
                        src={msg.imageUrl} 
                        alt="Shared" 
                        className="max-w-full hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div className="prose prose-invert prose-sm md:prose-base max-w-none font-light leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
                
                <div className={cn(
                  "flex items-center mt-2 px-2 space-x-3",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">
                    {format(msg.timestamp, 'HH:mm:ss')}
                  </span>
                  {msg.role === 'assistant' && (
                    <button 
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all text-zinc-500 hover:text-white"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && messages[messages.length - 1]?.role !== 'assistant' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] rounded-tl-none px-6 py-4 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce [animation-duration:0.8s]" />
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                </div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Processing...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-black/40 backdrop-blur-3xl border-t border-white/5 relative z-20">
        <div className="max-w-3xl mx-auto">
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mb-4 relative inline-block group"
            >
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="w-24 h-24 object-cover rounded-2xl border-2 border-rose-500 shadow-2xl shadow-rose-500/20"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow-xl transition-colors active:scale-90"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
          
          <form 
            onSubmit={handleSend}
            className="flex items-center space-x-3"
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-4 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl transition-all border border-white/5 active:scale-90"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder={`Whisper to ${character.name}...`}
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all backdrop-blur-xl"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={(!input.trim() && !selectedImage) || isTyping}
              className="p-4 bg-white text-black hover:bg-rose-500 hover:text-white disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-black rounded-2xl transition-all shadow-2xl shadow-white/10 active:scale-90"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-[0.2em]">
              Encrypted Connection Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
