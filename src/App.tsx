import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { CreateCharacter } from './pages/CreateCharacter';
import { ChatRoom } from './components/ChatRoom';
import { ChatsPage } from './pages/ChatsPage';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from './lib/utils';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Layout component
const Layout = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat/');

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {!isChatPage && <Sidebar />}
      <main className={cn(
        "flex-1 overflow-x-hidden relative h-screen",
        !isChatPage && "pb-20 md:pb-0"
      )}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateCharacter />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/chat/:charId" element={<ChatRoom />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
