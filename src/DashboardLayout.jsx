import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Plus, MessageSquare, MoreHorizontal, Search, Trash2, LogOut, Coins, Crown, User } from 'lucide-react';
import { AnimatedAIChat } from './components/ui/animated-ai-chat';
import { sendMessageToGemini } from './lib/gemini';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group relative
        ${isActive
          ? 'bg-primary/10 text-text-primary'
          : 'text-text-secondary hover:bg-elevated/60 hover:text-text-primary'
        }`}
    >
      <div className="flex items-center gap-2.5">
        <MessageSquare size={14} className={`shrink-0 ${isActive ? 'text-primary' : 'text-text-secondary/50 group-hover:text-text-secondary'}`} />
        <span className="truncate font-medium">{chat.title}</span>
      </div>

      {/* Hover delete */}
      {hovered && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <span
            onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }}
            className="p-1 rounded hover:bg-red-500/20 text-text-secondary/60 hover:text-red-400 transition-colors cursor-pointer"
            title="Delete chat"
          >
            <Trash2 size={13} />
          </span>
        </div>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
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
      }));

      const aiResponse = await sendMessageToGemini(apiMessages);
      appendAIMessage(chatId, aiResponse);
      
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

  const handleSendMessage = useCallback(async (text) => {
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

    const userMsg = { role: 'user', content: text.trim(), timestamp: Date.now() };

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
    <div className="min-h-screen bg-background text-text-primary flex">
      <aside className="w-[260px] fixed h-full border-r border-border bg-surface z-10 flex flex-col">
        <div className="font-display font-bold text-2xl tracking-tight flex items-center gap-2.5 px-6 pt-6 pb-4 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="FinMind Logo" className="w-8 h-8 object-contain rounded-lg" />
          <span>FinMind<span className="text-primary text-3xl">.</span></span>
        </div>

        {/* Credit Display */}
        <div className="px-3 pb-3">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Coins size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Credits</span>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                        {userDataLoading ? '...' : (userData ? userData.credits : '—')}
                    </span>
                    {!userDataLoading && !userData && (
                        <button 
                            onClick={() => refreshUserData()}
                            className="bg-primary/20 hover:bg-primary/40 text-[9px] text-primary px-1.5 py-0.5 rounded transition-colors"
                            title={syncError || "Click to retry sync"}
                        >
                            Retry
                        </button>
                    )}
                </div>
              </div>
            </div>
            <div className={`text-[10px] font-bold px-2 py-1 rounded-md ${userData?.isPremium ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
              {userData?.isPremium ? 'PREMIUM' : 'FREE'}
            </div>
          </div>
        </div>

        {/* Buy Premium Button */}
        {!userDataLoading && !userData?.isPremium && (
          <div className="px-3 pb-3">
            <button
              onClick={() => navigate('/premium')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-violet-600 hover:from-violet-600 hover:to-primary text-white border border-primary/30 rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary/20 group"
            >
              <Crown size={14} className="group-hover:scale-125 transition-transform" />
              Upgrade to Premium
            </button>
          </div>
        )}

        <div className="px-3 pb-3">
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 border
              ${activeChatId === null
                ? 'bg-primary text-white border-primary shadow-[0_0_20px_rgba(123,92,240,0.25)]'
                : 'bg-transparent text-text-primary border-border hover:border-primary/40 hover:bg-primary/5'
              }`}
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>
        </div>

        {chats.length > 0 && (
          <div className="px-3 pb-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-elevated/50 border border-border rounded-lg pl-8 pr-3 py-2 text-xs text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div key={group.label} className="mb-4">
                <div className="px-3 py-2 text-[11px] font-semibold text-text-secondary/50 uppercase tracking-wider">
                  {group.label}
                </div>
                <div className="flex flex-col gap-0.5">
                  {group.chats.map((chat) => (
                    <ChatHistoryItem
                      key={chat.id}
                      chat={chat}
                      isActive={activeChatId === chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      onDelete={handleDeleteChat}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : chats.length === 0 ? (
            <div className="text-center text-text-secondary/30 text-xs py-10 px-4">
              No conversations yet. Start a new chat to begin.
            </div>
          ) : (
            <div className="text-center text-text-secondary/40 text-xs py-8">
              No chats matching "{searchQuery}"
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border mt-auto">
          {chats.length > 0 && (
            <button 
              onClick={() => {
                if (window.confirm('Clear all chat history? This cannot be undone.')) {
                  setChats([]);
                  setActiveChatId(null);
                }
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-secondary/60 hover:text-danger hover:bg-danger/5 rounded-lg transition-all mb-4 group"
            >
              <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
              <span>Clear Conversations</span>
            </button>
          )}

          <div className="flex items-center gap-3 group px-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(123,92,240,0.3)] shrink-0">
               {user?.email?.[0].toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate text-white">{user?.email ?? 'User'}</div>
              <div className="flex items-center gap-3 mt-0.5">
                <button 
                  onClick={() => navigate('/account')}
                  className="text-text-secondary text-xs flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <User size={12}/> Account
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-text-secondary text-xs flex items-center gap-1 hover:text-red-400 transition-colors"
                >
                  <LogOut size={12}/> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-[260px] flex-1 flex flex-col min-h-screen">
        <AnimatedAIChat
          messages={activeMessages}
          onSendMessage={handleSendMessage}
          isNewChat={activeChatId === null}
          credits={userDataLoading ? 20 : (userData?.credits ?? 20)}
        />
      </main>
    </div>
  );
};

export default DashboardLayout;
