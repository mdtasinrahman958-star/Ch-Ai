import React from 'react';
import { CharacterForm } from '../components/CharacterForm';
import { Sparkles } from 'lucide-react';

export const CreateCharacter = () => {
  return (
    <div className="p-6 md:p-12 min-h-screen max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 space-y-4">
          <div className="flex items-center space-x-2 text-rose-500 font-mono text-xs tracking-widest uppercase">
            <Sparkles className="w-3 h-3" />
            <span>Creation Protocol</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-display font-black text-white tracking-tighter leading-none">
            Design Your <span className="text-rose-500">Soulmate</span>
          </h1>
          <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-xl">
            Define their personality, backstory, and emotional depth to create a truly unique bond that evolves with every message.
          </p>
        </div>
        <CharacterForm />
      </div>
    </div>
  );
};
