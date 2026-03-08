import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Save, X } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Character } from '../types';
import { motion } from 'motion/react';

export const CharacterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    backstory: '',
    personality: '',
    emotionalBaseline: 'Optimistic',
    avatarUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCharacter: Character = {
      id: crypto.randomUUID(),
      name: formData.name,
      role: formData.role,
      backstory: formData.backstory,
      personality: formData.personality.split(',').map(p => p.trim()),
      emotionalBaseline: formData.emotionalBaseline,
      avatarUrl: formData.avatarUrl || `https://picsum.photos/seed/${formData.name}/400/400`,
      createdAt: Date.now()
    };
    
    storageService.saveCharacter(newCharacter);
    navigate('/');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-zinc-900/40 p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-3xl"
    >
      <div className="flex items-center space-x-4 mb-12">
        <div className="p-4 bg-rose-500 rounded-2xl shadow-2xl shadow-rose-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Entity Configuration</h2>
          <p className="text-zinc-500 text-sm font-light">Manifest your companion into existence</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 pl-1">Identity</label>
            <input
              required
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all"
              placeholder="e.g. Seraphina"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 pl-1">Designation</label>
            <input
              required
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all"
              placeholder="e.g. Mysterious Librarian"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 pl-1">Origin Story</label>
          <textarea
            required
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all resize-none font-light leading-relaxed"
            placeholder="Describe their past, secrets, and the core of their being..."
            value={formData.backstory}
            onChange={e => setFormData({ ...formData, backstory: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 pl-1">Neural Patterns (Comma Separated)</label>
          <input
            required
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all"
            placeholder="e.g. Sarcastic, Loyal, Intelligent"
            value={formData.personality}
            onChange={e => setFormData({ ...formData, personality: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 pl-1">Emotional Baseline</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all appearance-none cursor-pointer"
              value={formData.emotionalBaseline}
              onChange={e => setFormData({ ...formData, emotionalBaseline: e.target.value })}
            >
              <option className="bg-zinc-900">Optimistic</option>
              <option className="bg-zinc-900">Melancholic</option>
              <option className="bg-zinc-900">Stoic</option>
              <option className="bg-zinc-900">Passionate</option>
              <option className="bg-zinc-900">Anxious</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 pl-1">Visual Manifestation</label>
            <div className="flex space-x-3">
              <input
                type="url"
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all"
                placeholder="https://..."
                value={formData.avatarUrl}
                onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
              />
              <button
                type="button"
                onClick={() => {
                  if (!formData.name || !formData.role) {
                    alert('Please provide a name and role first.');
                    return;
                  }
                  const prompt = encodeURIComponent(`${formData.name}, ${formData.role}, ${formData.backstory.slice(0, 50)}, character portrait, digital art, high quality`);
                  const url = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
                  setFormData({ ...formData, avatarUrl: url });
                }}
                className="px-6 bg-white text-black hover:bg-rose-500 hover:text-white rounded-2xl font-bold transition-all shadow-xl active:scale-95 flex items-center justify-center"
                title="Generate AI Portrait"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 pt-8">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-3 bg-rose-500 hover:bg-rose-600 text-white py-5 rounded-[2rem] font-bold transition-all shadow-2xl shadow-rose-500/20 active:scale-[0.98]"
          >
            <Save className="w-5 h-5" />
            <span>Manifest Companion</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-10 bg-white/5 hover:bg-white/10 text-white py-5 rounded-[2rem] font-bold transition-all border border-white/5 active:scale-[0.98]"
          >
            Abort
          </button>
        </div>
      </form>
    </motion.div>
  );
};
