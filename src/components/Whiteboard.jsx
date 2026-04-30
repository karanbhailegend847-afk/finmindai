import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Sparkles, Target, Landmark, FileText, Save, StickyNote as StickyNoteIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { sendMessageToGemini } from '../lib/gemini';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const NOTE_COLORS = [
  'bg-violet-600/10 border-violet-500/20 text-violet-200 shadow-[0_8px_32px_rgba(124,58,237,0.05)]',
  'bg-emerald-600/10 border-emerald-500/20 text-emerald-200 shadow-[0_8px_32px_rgba(16,185,129,0.05)]',
  'bg-amber-600/10 border-amber-500/20 text-amber-200 shadow-[0_8px_32px_rgba(245,158,11,0.05)]',
  'bg-blue-600/10 border-blue-500/20 text-blue-200 shadow-[0_8px_32px_rgba(59,130,246,0.05)]',
  'bg-rose-600/10 border-rose-500/20 text-rose-200 shadow-[0_8px_32px_rgba(244,63,94,0.05)]',
];

const CATEGORY_ICONS = {
  Goal: <Target className="w-4 h-4" />,
  Budget: <Landmark className="w-4 h-4" />,
  Note: <FileText className="w-4 h-4" />,
};

const GoalNote = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.text);

  const handleSave = () => {
    if (editedText.trim()) {
      onUpdate(note.id, { text: editedText });
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "relative p-6 rounded-[2rem] border backdrop-blur-xl group h-full flex flex-col justify-between min-h-[180px] transition-all",
        note.color || NOTE_COLORS[0]
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-[9px] uppercase font-black tracking-widest text-white/70 border border-white/5">
          {CATEGORY_ICONS[note.category] || <FileText className="w-3.5 h-3.5" />}
          <span>{note.category || 'Note'}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white">
              <Edit2 size={12} />
            </button>
          )}
          <button onClick={() => onDelete(note.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          autoFocus
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="bg-transparent border-none focus:ring-0 text-sm w-full resize-none h-24 p-0 leading-relaxed placeholder:text-white/20 text-white font-medium"
          placeholder="What's your financial goal?"
        />
      ) : (
        <div className="text-sm font-semibold leading-relaxed overflow-hidden line-clamp-4 text-white/90">
          {note.text}
        </div>
      )}

      {isEditing && (
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/10 rounded-xl text-white/40">
            <X size={14} />
          </button>
          <button onClick={handleSave} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white">
            <Check size={14} />
          </button>
        </div>
      )}
      
      {!isEditing && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
          <div className="text-[9px] font-bold text-white/20 uppercase tracking-tighter uppercase">
            {note.createdAt && typeof note.createdAt.toDate === 'function' 
              ? note.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
              : 'Just now'}
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
      )}
    </motion.div>
  );
};

export const Whiteboard = () => {
  const { user, userData, userDataLoading, deductCredits } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ text: '', category: 'Goal' });
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log("Whiteboard: No user found, waiting...");
      return;
    }

    console.log("Whiteboard: Setting up listener for", user.uid);
    setLoading(true);

    const q = query(collection(db, `users/${user.uid}/goals`));
    const unsubscribe = onSnapshot(q, 
      { includeMetadataChanges: true },
      (snapshot) => {
        console.log("Whiteboard Snapshot fired. Metadata source:", snapshot.metadata.fromCache ? 'cache' : 'server');
        const notesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Robust sort: newest first
        const sorted = [...notesData].sort((a, b) => {
          const aTime = a.createdAt?.seconds || (Date.now() / 1000);
          const bTime = b.createdAt?.seconds || (Date.now() / 1000);
          return bTime - aTime;
        });
        
        setNotes(sorted);
        setLoading(false);
      },
      (error) => {
        console.error("Whiteboard Firestore Error:", error);
        setLoading(false);
      }
    );

    // Timeout fallback: if no data after 7 seconds, stop spinner
    const timer = setTimeout(() => {
        setLoading(prev => {
            if (prev) console.warn("Whiteboard: Data loading timed out after 7s");
            return false;
        });
    }, 7000);

    return () => {
        unsubscribe();
        clearTimeout(timer);
    };
  }, [user]);

  const addNote = async () => {
    if (!newNote.text.trim()) return;
    setIsSaving(true);
    try {
      const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
      await addDoc(collection(db, `users/${user.uid}/goals`), {
        ...newNote,
        color,
        createdAt: serverTimestamp()
      });
      setNewNote({ text: '', category: 'Goal' });
      setIsAdding(false);
    } catch (e) {
      console.error("Save Error:", e);
      alert(`Failed to save note: ${e.message || 'Check your internet connection or permissions.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const updateNote = async (id, data) => {
    await updateDoc(doc(db, `users/${user.uid}/goals`, id), data);
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, `users/${user.uid}/goals`, id));
  };

  const handleAISync = async () => {
    if (isSyncing) return;

    // Credit Check
    if (userData && userData.credits < 3) {
      alert(`Insufficient credits! You need 3 credits to perform an AI Sync.\n\nYour current balance: ${userData.credits} credits.`);
      return;
    }

    setIsSyncing(true);
    try {
      // 1. Get recent chats from localStorage (Multi-chat context)
      const storageKey = `finmind_chats_${user.uid}`;
      const rawChats = localStorage.getItem(storageKey);
      const chats = rawChats ? JSON.parse(rawChats) : [];
      
      // Aggregate the last 20 messages from the top 5 chats for broad context
      let recentMessages = [];
      chats.slice(0, 5).forEach(chat => {
        if (chat.messages) {
            recentMessages = [...recentMessages, ...chat.messages.slice(-10)];
        }
      });
      
      // Sort by timestamp if available, or just take the last 20
      recentMessages = recentMessages
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 20);

      // 2. Prepare the prompt
      const currentNotesStr = notes.map(n => `- [${n.category}] ${n.text}`).join('\n');
      const chatContext = recentMessages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

      const prompt = `
        YOU ARE: FinMind AI financial mission control.
        
        CONTEXT:
        We are syncing the user's "Fridge" (Financial Whiteboard).
        
        CURRENT WHITEBOARD NOTES:
        ${currentNotesStr || 'None (The board is empty)'}

        RECENT CHAT CONVERSATION HISTORY:
        ${chatContext || 'None (Brand new user)'}

        TASK:
        Analyze the conversation history and the existing notes. 
        Detect ANY financial goals, budget requirements, or reminders mentioned by the user.
        Suggest 2-3 NEW sticky notes that would be helpful. 
        DO NOT suggest duplicates of existing notes.
        
        CATEGORIES:
        - "Goal": Future savings or milestones (e.g., "Save $1000 for emergency fund")
        - "Budget": Spending limits or category targets (e.g., "Limit dining to $200/mo")
        - "Note": General financial wisdom or reminders (e.g., "Check recurring subscriptions")

        CRITICAL: 
        Return ONLY a JSON object. No other text.
        
        JSON STRUCTURE:
        {
          "suggestions": [
            { "text": "Specific, actionable note text", "category": "Goal|Budget|Note" }
          ]
        }
      `;

      const response = await sendMessageToGemini([{ role: 'user', content: prompt }]);
      
      // Improved JSON Extraction (Handles markdown blocks and loose text)
      let jsonData = null;
      try {
        // Try to find JSON in markdown blocks first
        const markdownMatch = response.match(/```json\s*(\{[\s\S]*\})\s*```/);
        if (markdownMatch) {
            jsonData = JSON.parse(markdownMatch[1]);
        } else {
            // Fallback to first '{' and last '}'
            const braceMatch = response.match(/\{[\s\S]*\}/);
            if (braceMatch) {
                jsonData = JSON.parse(braceMatch[0]);
            }
        }
      } catch (parseError) {
        console.error("JSON Parsing failed", parseError, response);
        throw new Error("I received the advice but couldn't format it into notes. Please try again.");
      }

      if (jsonData && jsonData.suggestions) {
        setSuggestions(jsonData.suggestions);
        // DEDUCT CREDITS ON SUCCESS
        await deductCredits(3);
      } else {
        setSuggestions([]);
      }
    } catch (e) {
      console.error('AI Sync failed', e);
      alert('AI Sync failed. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const acceptSuggestion = async (idx) => {
    const sug = suggestions[idx];
    try {
        const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
        await addDoc(collection(db, `users/${user.uid}/goals`), {
          ...sug,
          color,
          createdAt: serverTimestamp()
        });
        setSuggestions(prev => prev.filter((_, i) => i !== idx));
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent p-6 md:p-12 relative overflow-hidden selection:bg-primary/30">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                Command Center
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/20 border border-white/10">
                <StickyNoteIcon size={28} />
              </div>
              <h1 className="text-5xl font-display font-black tracking-tight text-white">The Fridge</h1>
            </div>
            <p className="text-text-secondary text-lg max-w-xl font-medium leading-relaxed">
              Your AI-monitored financial mission control. Pin your goals, budgets, and strategic notes.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2.5 px-7 py-4 bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] rounded-2xl font-bold transition-all active:scale-95"
            >
              <Plus size={20} />
              <span>New Sticky</span>
            </button>
            <button 
                onClick={handleAISync}
                disabled={isSyncing}
                className="flex items-center gap-2.5 px-7 py-4 bg-[#0D0D12] border border-white/5 hover:border-primary/40 text-white rounded-2xl font-bold transition-all group disabled:opacity-50 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles size={18} className={cn("text-primary transition-transform group-hover:rotate-12", isSyncing && "animate-spin")} />
              <span>{isSyncing ? 'Analyzing...' : 'AI Sync'}</span>
            </button>
          </div>
        </div>

        {/* AI Suggestions Overlay */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="mb-10 p-6 bg-primary/10 border border-primary/20 rounded-3xl overflow-hidden"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <Sparkles size={16} />
                        <span>AI Suggested Notes</span>
                    </div>
                    <button onClick={() => setSuggestions([])} className="text-white/40 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.map((sug, i) => (
                        <div key={i} className="bg-surface/50 border border-white/5 p-4 rounded-2xl flex flex-col justify-between gap-3">
                            <div>
                                <div className="text-[10px] font-bold uppercase text-primary mb-1">{sug.category}</div>
                                <div className="text-sm text-text-primary/80 italic">"{sug.text}"</div>
                            </div>
                            <button 
                                onClick={() => acceptSuggestion(i)}
                                className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold rounded-xl transition-all"
                            >
                                Pin to Fridge
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!user ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div className="p-4 rounded-full bg-red-500/10 text-red-400 mb-2">
              <Landmark size={32} />
            </div>
            <h2 className="text-xl font-bold text-white">Authentication Required</h2>
            <p className="text-text-secondary max-w-xs">Please sign in to access your financial mission control.</p>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {isAdding && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-6 rounded-3xl border border-primary/30 bg-primary/5 backdrop-blur-xl flex flex-col min-h-[220px]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {['Goal', 'Budget', 'Note'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setNewNote(prev => ({ ...prev, category: cat }))}
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full transition-all",
                          newNote.category === cat ? "bg-primary text-white" : "bg-white/5 text-white/30 hover:bg-white/10"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <textarea
                    autoFocus
                    value={newNote.text}
                    onChange={(e) => setNewNote(prev => ({ ...prev, text: e.target.value }))}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm resize-none p-0 placeholder:text-white/20 leading-relaxed text-white"
                    placeholder="Write your goal here..."
                  />
                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                    <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-white/40 hover:text-white transition-colors">
                      Cancel
                    </button>
                    <button 
                        onClick={addNote} 
                        disabled={isSaving}
                        className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={14} />
                        )}
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {notes.map(note => (
                <GoalNote
                  key={note.id}
                  note={note}
                  onUpdate={updateNote}
                  onDelete={deleteNote}
                />
              ))}
            </AnimatePresence>

            {notes.length === 0 && !isAdding && (
              <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 opacity-30">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                   <Plus size={24} />
                </div>
                <p className="text-sm font-medium">Your Fridge is empty. Add a note or click AI Sync to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
