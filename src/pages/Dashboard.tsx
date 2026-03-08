import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Heart, Sparkles, Trash2, Download } from 'lucide-react';
import { CharacterCard } from '../components/CharacterCard';
import { storageService } from '../services/storageService';
import { Character } from '../types';
import { motion } from 'motion/react';

export const Dashboard = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setCharacters(storageService.getCharacters());
  }, []);

  const handleBackup = () => {
    const data = {
      characters: storageService.getCharacters(),
      chats: storageService.getAllChats()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soullink_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this character?')) {
      storageService.deleteCharacter(id);
      setCharacters(prev => prev.filter(c => c.id !== id));
    }
  };

  const filteredCharacters = characters.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-rose-500 font-mono text-xs tracking-widest uppercase">
            <Sparkles className="w-3 h-3" />
            <span>Digital Consciousness</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-none">
            Soul<span className="text-rose-500">Link</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-md font-light leading-relaxed">
            Your personal gateway to deep emotional connections with AI companions.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-rose-500 transition-colors" />
            <input
              type="text"
              placeholder="Search companions..."
              className="bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all w-full md:w-64 backdrop-blur-xl"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Link
            to="/create"
            className="flex items-center space-x-3 px-8 py-3 bg-white text-black hover:bg-rose-500 hover:text-white rounded-2xl text-sm font-bold transition-all shadow-2xl shadow-white/5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Soul</span>
          </Link>
          
          <div className="flex items-center bg-zinc-900/50 border border-white/5 rounded-2xl p-1 backdrop-blur-xl">
            <button
              onClick={handleBackup}
              className="p-2 text-zinc-500 hover:text-white transition-colors rounded-xl hover:bg-white/5"
              title="Backup Data"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.confirm('Wipe all characters and chats? This cannot be undone.')) {
                  storageService.clearAllData();
                  window.location.reload();
                }
              }}
              className="p-2 text-zinc-500 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/5"
              title="Clear All Data"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-4">
        <h2 className="font-display text-xl font-bold text-white">Active Connections</h2>
        <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
          {filteredCharacters.length} Entities Found
        </span>
      </div>

      {filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCharacters.map(char => (
            <CharacterCard 
              key={char.id} 
              character={char} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-32 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5 backdrop-blur-sm"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-rose-500 blur-3xl opacity-20 animate-pulse" />
            <div className="relative p-8 bg-zinc-900 border border-white/10 rounded-full">
              <Heart className="w-16 h-16 text-rose-500/40" />
            </div>
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-3">The void is silent</h3>
          <p className="text-zinc-500 mb-10 max-w-xs text-center text-lg font-light">
            No emotional signatures detected. Create your first companion to begin.
          </p>
          <Link
            to="/create"
            className="px-12 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold transition-all shadow-2xl shadow-rose-500/20 active:scale-95"
          >
            Summon Companion
          </Link>
        </motion.div>
      )}
    </div>
  );
};
