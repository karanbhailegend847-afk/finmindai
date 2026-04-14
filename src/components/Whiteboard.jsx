import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Sparkles, Target, Landmark, FileText, Save, StickyNote as StickyNoteIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { sendMessageToGemini } from '../lib/gemini';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const NOTE_COLORS = [
  'bg-violet-500/20 border-violet-500/30 text-violet-200',
  'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
  'bg-amber-500/20 border-amber-500/30 text-amber-200',
  'bg-blue-500/20 border-blue-500/30 text-blue-200',
  'bg-rose-500/20 border-rose-500/30 text-rose-200',
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "relative p-5 rounded-3xl border backdrop-blur-md group h-full flex flex-col justify-between min-h-[160px]",
        note.color || NOTE_COLORS[0]
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 text-[10px] uppercase font-bold tracking-wider">
          {CATEGORY_ICONS[note.category] || <FileText className="w-4 h-4" />}
          <span>{note.category || 'Note'}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <Edit2 size={12} />
            </button>
          )}
          <button onClick={() => onDelete(note.id)} className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          autoFocus
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="bg-transparent border-none focus:ring-0 text-sm w-full resize-none h-24 p-0 leading-relaxed placeholder:text-white/20"
          placeholder="What's your financial goal?"
        />
      ) : (
        <div className="text-sm font-medium leading-relaxed overflow-hidden line-clamp-4">
          {note.text}
        </div>
      )}

      {isEditing && (
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => setIsEditing(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40">
            <X size={14} />
          </button>
          <button onClick={handleSave} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white">
            <Check size={14} />
          </button>
        </div>
      )}
      
      {!isEditing && (
        <div className="text-[10px] text-white/30 mt-4 font-mono">
          {note.createdAt && typeof note.createdAt.toDate === 'function' 
            ? note.createdAt.toDate().toLocaleDateString() 
            : 'Just now'}
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
    <div className="flex-1 flex flex-col bg-background/50 p-6 md:p-10 relative overflow-hidden">
      {/* Background Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <StickyNoteIcon size={24} />
              </div>
              <h1 className="text-4xl font-display font-black tracking-tight text-white">The Fridge</h1>
            </div>
            <p className="text-text-secondary">Your AI-monitored financial mission control and goal whiteboard.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(123,92,240,0.3)] hover:scale-[1.02]"
            >
              <Plus size={18} />
              <span>New Sticky Note</span>
            </button>
            <button 
                onClick={handleAISync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-6 py-3 bg-surface border border-primary/20 hover:border-primary/40 text-text-primary rounded-2xl font-bold transition-all group disabled:opacity-50"
            >
              <Sparkles size={18} className={cn("text-primary", isSyncing && "animate-spin")} />
              <span>{isSyncing ? 'Syncing...' : 'AI Sync'}</span>
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
