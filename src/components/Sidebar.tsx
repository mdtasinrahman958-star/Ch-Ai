import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, MessageSquare, Settings, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: PlusCircle, label: 'Summon', path: '/create' },
    { icon: MessageSquare, label: 'Archive', path: '/chats' },
  ];

  return (
    <aside className="fixed bottom-0 left-0 z-50 w-full bg-black/40 backdrop-blur-3xl border-t border-white/5 md:relative md:w-72 md:h-screen md:border-t-0 md:border-r md:bg-black">
      <div className="flex flex-row justify-around p-3 md:flex-col md:justify-start md:p-8 md:space-y-4">
        <div className="hidden md:flex flex-col space-y-2 mb-12">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-500 rounded-2xl shadow-2xl shadow-rose-500/40">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-display font-black tracking-tighter text-white">SoulLink</span>
          </div>
          <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.3em] pl-1">Protocol v2.5</p>
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center p-3 rounded-2xl transition-all duration-300 md:flex-row md:space-x-4 md:px-6 md:py-4 group relative overflow-hidden",
                isActive 
                  ? "text-white bg-white/5" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-rose-500 rounded-full hidden md:block"
                />
              )}
              <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-rose-500")} />
              <span className="text-[10px] md:text-sm font-bold tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
