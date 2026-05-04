import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Plus, MessageSquare, MoreHorizontal, Search, Trash2, LogOut, Coins, Crown, User, LayoutDashboard, PenTool, X } from 'lucide-react';
import { AnimatedAIChat } from './components/ui/animated-ai-chat';
import { sendMessageToGemini, streamSendMessageToGemini } from './lib/gemini';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from './lib/utils';
import SubscriptionExpiryModal from './components/SubscriptionExpiryModal';

// Helpers for localStorage persistence (Scoped by user UID)
const getStorageKey = (uid) => `finmind_chats_${uid}`;

const loadChats = (uid) => {
  if (!uid) return [];
  try {
    const raw = localStorage.getItem(getStorageKey(uid));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveChats = (uid, chats) => {
  if (!uid) return;
  try {
    localStorage.setItem(getStorageKey(uid), JSON.stringify(chats));
  } catch (e) {
    console.warn('Failed to save chats', e);
  }
};

// Group chats by relative date
const groupChatsByDate = (chats) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const groups = [
    { label: 'Today', chats: [] },
    { label: 'Yesterday', chats: [] },
    { label: 'Previous 7 Days', chats: [] },
    { label: 'Previous 30 Days', chats: [] },
    { label: 'Older', chats: [] },
  ];

  const sorted = [...chats].sort((a, b) => b.createdAt - a.createdAt);

  sorted.forEach((chat) => {
    const chatDate = new Date(chat.createdAt);
    if (chatDate >= today) groups[0].chats.push(chat);
    else if (chatDate >= yesterday) groups[1].chats.push(chat);
    else if (chatDate >= sevenDaysAgo) groups[2].chats.push(chat);
    else if (chatDate >= thirtyDaysAgo) groups[3].chats.push(chat);
    else groups[4].chats.push(chat);
  });

  return groups.filter((g) => g.chats.length > 0);
};

const ChatHistoryItem = ({ chat, isActive, onClick, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden
        ${isActive
          ? 'bg-primary/15 text-white shadow-[inset_0_0_20px_rgba(123,92,240,0.1)] border border-primary/30'
          : 'text-text-secondary hover:bg-white/5 hover:text-white border border-transparent'
        }`}
    >
      <div className="flex items-center gap-3 relative z-10">
        <MessageSquare size={14} className={`shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-text-secondary/50 group-hover:text-primary/70'}`} />
        <span className="truncate font-medium">{chat.title}</span>
      </div>

      {/* Hover delete */}
      {hovered && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <span
            onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-text-secondary/60 hover:text-red-400 transition-all cursor-pointer backdrop-blur-md"
            title="Delete chat"
          >
            <Trash2 size={13} />
          </span>
        </div>
      )}

      {/* Active glow effect */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
      )}
    </button>
  );
};

const DashboardLayout = () => {
  const { user, userData, userDataLoading, syncError, refreshUserData, logout, deductCredits, buyPremium } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState(() => loadChats(user?.uid));
  const [activeChatId, setActiveChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Persist chats to localStorage whenever they change
  useEffect(() => {
    if (user?.uid) {
      saveChats(user.uid, chats);
    }
  }, [chats, user?.uid]);

  // Load chats when user changes
  useEffect(() => {
    if (user?.uid) {
      setChats(loadChats(user.uid));
    }
  }, [user?.uid]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const activeMessages = activeChat ? activeChat.messages : [];

  const appendAIMessage = (chatId, content) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { role: 'assistant', content, timestamp: Date.now() },
              ],
            }
          : c
      )
    );
  };

  const updateAIMessage = (chatId, chunk, isStreaming = true) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        const lastMsg = c.messages[c.messages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && lastMsg.isStreaming) {
          const newMessages = [...c.messages];
          newMessages[newMessages.length - 1] = {
            ...lastMsg,
            content: lastMsg.content + chunk,
            isStreaming
          };
          return { ...c, messages: newMessages };
        } else {
          return {
            ...c,
            messages: [
              ...c.messages,
              { role: 'assistant', content: chunk, timestamp: Date.now(), isStreaming }
            ]
          };
        }
      })
    );
  };

  const fetchAIResponse = async (chatId) => {
    try {
      let currentMessages = [];
      setChats((prev) => {
        const found = prev.find((c) => c.id === chatId);
        if (found) currentMessages = found.messages;
        return prev;
      });

      const apiMessages = currentMessages.map((m) => ({
        role: m.role,
        content: m.content,
        images: m.images || []
      }));

      const stream = streamSendMessageToGemini(apiMessages, userData?.plan || 'free');
      let fullResponse = "";
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        updateAIMessage(chatId, chunk, true);
      }
      
      // Final update to mark as complete
      updateAIMessage(chatId, "", false);
      
      // Deduct credits only after success
      await deductCredits(3);
    } catch (error) {
      console.error('Gemini API error:', error);
      appendAIMessage(
        chatId,
        `⚠️ **Error connecting to FinMind AI**\n\n${error.message || 'An unexpected error occurred.'}\n\nPlease try again in a moment.`
      );
    }
  };

  const handleSendMessage = useCallback(async (text, images = []) => {
    if (!text.trim()) return;

    // CREDIT CHECK
    if (!userData && !userDataLoading) {
        alert(`FinMind couldn't retrieve your user data.\n\nError: ${syncError || 'Unknown Error'}\n\nThis usually happens if the connection is lost or if your account hasn't been initialized in our database yet.`);
        return;
    }

    if (userData && userData.credits < 3) {
      alert("Insufficient credits. You need 3 credits to send a message.");
      return;
    }

    // Skip deduction here — we will deduct only AFTER the AI successfully responds
    // to ensure user doesn't lose credits for failed API calls.

    const userMsg = { role: 'user', content: text.trim(), images, timestamp: Date.now() };

    if (!activeChatId) {
      const newId = 'chat_' + Date.now();
      const title = text.trim().length > 50 ? text.trim().slice(0, 50) + '…' : text.trim();
      const newChat = {
        id: newId,
        title,
        messages: [userMsg],
        createdAt: Date.now(),
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newId);
      setTimeout(() => fetchAIResponse(newId), 100);
    } else {
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, messages: [...c.messages, userMsg] }
            : c
        )
      );
      const chatId = activeChatId;
      setTimeout(() => fetchAIResponse(chatId), 100);
    }
  }, [activeChatId, chats, userData, userDataLoading, deductCredits]);

  const handleNewChat = () => {
    setActiveChatId(null);
  };

  const handleDeleteChat = (chatId) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const grouped = groupChatsByDate(chats);
  const filteredGroups = searchQuery.trim()
    ? grouped
        .map((g) => ({
          ...g,
          chats: g.chats.filter((c) =>
            c.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((g) => g.chats.length > 0)
    : grouped;





  return (
    <div className="min-h-screen bg-[#0A0A0F] text-text-primary flex selection:bg-primary/30 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "w-[280px] fixed top-0 left-0 h-screen border-r border-white/5 bg-[#0D0D12]/80 backdrop-blur-2xl z-[100] flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* ... existing sidebar content ... */}
        <div className="font-display font-bold text-2xl tracking-tighter flex items-center justify-between px-7 pt-8 pb-6 cursor-pointer group shrink-0">
          <span className="relative z-10 text-white tracking-tight" onClick={() => navigate('/')}>FinMind<span className="text-primary">AI</span></span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl bg-white/5 text-text-secondary hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-0 flex flex-col">
          {/* Search Bar */}
          <div className="px-4 pb-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-secondary/50 group-focus-within:text-primary transition-colors">
                <Search size={14} />
              </div>
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 focus:border-primary/30 focus:bg-white/[0.05] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-text-secondary/30 outline-none transition-all"
              />
            </div>
          </div>

          {/* Credit Display */}
          <div className="px-4 pb-4">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-inner group hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Coins size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-secondary uppercase font-black tracking-[0.1em]">Treasury</span>
                  <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white tracking-tight">
                          {userDataLoading ? '...' : (userData ? userData.credits : '—')}
                      </span>
                  </div>
                </div>
              </div>
              <div className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded-lg border ${userData?.isPremium ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                {userData?.plan ?? 'FREE'}
              </div>
            </div>
          </div>

          {/* Upgrade Button */}
          {!userDataLoading && userData?.plan !== 'advance' && (
            <div className="px-4 pb-4">
              <button
                onClick={() => navigate('/pricing')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-[#7C3AED] via-[#6366F1] to-[#4F46E5] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] text-white rounded-2xl text-[13px] font-bold transition-all active:scale-[0.98] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Crown size={15} className="group-hover:rotate-12 transition-transform" />
                <span>{userData?.plan === 'starter' ? 'Upgrade to Advance' : 'Unlock Pro Features'}</span>
              </button>
            </div>
          )}

          <div className="px-4 pb-4">
            <button
              onClick={handleNewChat}
              className={`w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 border active:scale-95
                ${activeChatId === null
                  ? 'bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.15)]'
                  : 'bg-white/5 text-white/70 border-white/5 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
                }`}
            >
              <Plus size={18} className={activeChatId === null ? "text-black" : "text-primary"} />
              <span>New Session</span>
            </button>
          </div>

          <div className="px-4 pb-6">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <div key={group.label} className="mb-6">
                  <div className="px-3 py-2 text-[10px] font-black text-text-secondary/30 uppercase tracking-[0.15em]">
                    {group.label}
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    {group.chats.map((chat) => (
                      <ChatHistoryItem
                        key={chat.id}
                        chat={chat}
                        isActive={activeChatId === chat.id}
                        onClick={() => {
                          setActiveChatId(chat.id);
                          if (window.innerWidth < 768) setIsSidebarOpen(false);
                        }}
                        onDelete={handleDeleteChat}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>

        <div className="p-4 bg-[#0A0A0F]/50 border-t border-white/5 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-primary/20 shrink-0 group-hover:scale-105 transition-transform">
               {user?.email?.[0].toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate text-white tracking-tight">{user?.email?.split('@')[0] ?? 'Explorer'}</div>
              <div className="flex items-center gap-3 mt-1">
                <button 
                  onClick={() => navigate('/account')}
                  className="text-text-secondary/60 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:text-white transition-colors"
                >
                  Profile
                </button>
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <button 
                  onClick={handleLogout}
                  className="text-text-secondary/60 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col lg:ml-[280px] w-full max-w-full h-screen relative overflow-hidden overflow-x-hidden">
        {/* Mobile/Tablet Header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0D0D12]/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-white/5 text-white/70 hover:text-white transition-colors border border-white/5 shadow-inner"
            >
              <LayoutDashboard size={20} />
            </button>
            <div className="font-display font-bold text-xl tracking-tighter">
              FinMind<span className="text-primary">AI</span>
            </div>
          </div>
          
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-lg shadow-primary/20 border border-white/10" onClick={() => navigate('/account')}>
            {user?.email?.[0].toUpperCase() ?? 'U'}
          </div>
        </div>
        {/* Background ambient glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <SubscriptionExpiryModal />
        
        <div className="relative z-10 flex flex-col flex-1 transition-all duration-500 ease-in-out min-h-0">
            <AnimatedAIChat
                messages={activeMessages}
                onSendMessage={handleSendMessage}
                isNewChat={activeChatId === null}
                credits={userDataLoading ? 20 : (userData?.credits ?? 20)}
                plan={userData?.plan ?? 'free'}
            />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
