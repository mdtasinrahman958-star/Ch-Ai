import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Trash2, Heart } from 'lucide-react';
import { Character } from '../types';
import { storageService } from '../services/storageService';
import { motion } from 'motion/react';

interface CharacterCardProps {
  character: Character;
  onDelete: (id: string) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative bg-zinc-900/50 rounded-[2rem] overflow-hidden border border-white/5 hover:border-rose-500/30 transition-all duration-500 backdrop-blur-xl"
    >
      <div className="aspect-[4/5] bg-zinc-800 relative overflow-hidden">
        {character.avatarUrl ? (
          <img 
            src={character.avatarUrl} 
            alt={character.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-500/10 to-purple-500/10">
            <Heart className="w-16 h-16 text-rose-500/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center space-x-2 text-rose-500 font-mono text-[10px] uppercase tracking-[0.2em] mb-2">
            <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
            <span>Online</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-white mb-1 tracking-tight">{character.name}</h3>
          <p className="text-zinc-400 text-sm font-light line-clamp-1">{character.role}</p>
        </div>
      </div>
      
      <div className="p-6 flex items-center justify-between bg-black/20">
        <Link
          to={`/chat/${character.id}`}
          className="flex-1 flex items-center justify-center space-x-2 py-3 bg-white/5 hover:bg-rose-500 text-white rounded-xl text-sm font-bold transition-all group/btn"
        >
          <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          <span>Connect</span>
        </Link>
        
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(character.id);
          }}
          className="ml-4 p-3 text-zinc-600 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/5"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
