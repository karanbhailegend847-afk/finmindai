import React, { useEffect, useRef, useCallback, useTransition, useState } from "react";
import { cn } from "../../lib/utils";
import {
    ImageIcon,
    FileUp,
    PenTool,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    SendIcon,
    XIcon,
    LoaderIcon,
    Sparkles,
    Command,
    User,
    Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function useAutoResizeTextarea({ minHeight, maxHeight }) {
    const textareaRef = useRef(null);

    const adjustHeight = useCallback(
        (reset) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

const Textarea = React.forwardRef(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className={cn(
        "relative",
        containerClassName
      )}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {showRing && isFocused && (
          <motion.span 
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

// Message bubble component
function MessageBubble({ message, isLast }) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            className={cn(
                "flex gap-3 max-w-3xl mx-auto w-full px-6",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {/* Avatar */}
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                isUser
                    ? "bg-primary/20 text-primary"
                    : "bg-gradient-to-br from-primary to-violet-600 text-white"
            )}>
                {isUser ? <User size={15} /> : <img src="/logo.png" className="w-5 h-5 object-contain" />}
            </div>

            {/* Message */}
            <div className={cn(
                "flex-1 min-w-0",
                isUser ? "text-right" : "text-left"
            )}>
                <div className={cn(
                    "text-xs font-medium mb-1.5",
                    isUser ? "text-primary/70" : "text-text-secondary/60"
                )}>
                    {isUser ? 'You' : 'FinMind AI'}
                </div>
                <div className={cn(
                    "inline-block text-[14.5px] leading-relaxed rounded-2xl px-4 py-3 max-w-full",
                    isUser
                        ? "bg-primary/15 text-text-primary rounded-tr-sm text-left"
                        : "bg-surface border border-border text-text-primary/90 rounded-tl-sm"
                )}>
                    {/* Message Content */}
                    <div className="flex flex-col gap-3">
                        {message.images && message.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-1">
                                {message.images.map((img, i) => (
                                    <img 
                                        key={i} 
                                        src={img} 
                                        alt="Uploaded content" 
                                        className="max-w-[200px] max-h-[200px] rounded-lg object-cover border border-border/50" 
                                    />
                                ))}
                            </div>
                        )}
                        {isUser ? (
                            message.content
                        ) : (
                            <div className="chat-markdown overflow-x-auto">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Typing indicator for AI
function TypingIndicator() {
    return (
        <motion.div
            className="flex gap-3 max-w-3xl mx-auto w-full px-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
        >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-gradient-to-br from-primary to-violet-600 text-white">
                <img src="/logo.png" className="w-5 h-5 object-contain" />
            </div>
            <div className="text-left">
                <div className="text-xs font-medium mb-1.5 text-text-secondary/60">FinMind AI</div>
                <div className="inline-flex items-center gap-1 bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                    <TypingDots />
                </div>
            </div>
        </motion.div>
    );
}

export function AnimatedAIChat({ messages = [], onSendMessage, isNewChat = true, credits = 0 }) {
    const [value, setValue] = useState("");
    const [attachments, setAttachments] = useState([]); // Store File objects
    const [isWaitingReply, setIsWaitingReply] = useState(false);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [recentCommand, setRecentCommand] = useState(null);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });
    const [inputFocused, setInputFocused] = useState(false);
    const commandPaletteRef = useRef(null);
    const messagesEndRef = useRef(null);
    const prevMessagesLength = useRef(messages.length);

    const isOutOfCredits = credits < 3;

    const commandSuggestions = [
        { 
            icon: <ImageIcon className="w-4 h-4" />, 
            label: "Clone UI", 
            description: "Generate a UI from a screenshot", 
            prefix: "/clone" 
        },
        { 
            icon: <PenTool className="w-4 h-4" />, 
            label: "Import Layout", 
            description: "Extract components from design", 
            prefix: "/layout" 
        },
        { 
            icon: <Sparkles className="w-4 h-4" />, 
            label: "Database Query", 
            description: "Fetch financial data directly", 
            prefix: "/query" 
        },
        { 
            icon: <Sparkles className="w-4 h-4" />, 
            label: "Improve", 
            description: "Improve existing UI design", 
            prefix: "/improve" 
        },
    ];

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messages.length > prevMessagesLength.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        prevMessagesLength.current = messages.length;
    }, [messages]);

    // Track waiting state — when last message is user's, we're waiting for AI
    useEffect(() => {
        if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
            setIsWaitingReply(true);
        } else {
            setIsWaitingReply(false);
        }
    }, [messages]);

    useEffect(() => {
        if (value.startsWith('/') && !value.includes(' ')) {
            setShowCommandPalette(true);
            
            const matchingSuggestionIndex = commandSuggestions.findIndex(
                (cmd) => cmd.prefix.startsWith(value)
            );
            
            if (matchingSuggestionIndex >= 0) {
                setActiveSuggestion(matchingSuggestionIndex);
            } else {
                setActiveSuggestion(-1);
            }
        } else {
            setShowCommandPalette(false);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
            const commandButton = document.querySelector('[data-command-button]');
            
            if (commandPaletteRef.current && 
                !commandPaletteRef.current.contains(target) && 
                !commandButton?.contains(target)) {
                setShowCommandPalette(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e) => {
        if (showCommandPalette) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev < commandSuggestions.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev > 0 ? prev - 1 : commandSuggestions.length - 1
                );
            } else if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestion >= 0) {
                    const selectedCommand = commandSuggestions[activeSuggestion];
                    setValue(selectedCommand.prefix + ' ');
                    setShowCommandPalette(false);
                    
                    setRecentCommand(selectedCommand.label);
                    setTimeout(() => setRecentCommand(null), 3500);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowCommandPalette(false);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !isOutOfCredits) {
                handleSendMessage();
            }
        }
    };

    const handleSendMessage = async () => {
        if ((value.trim() || attachments.length > 0) && onSendMessage && !isOutOfCredits) {
            setIsWaitingReply(true);
            
            // Process images to base64
            const imagePromises = attachments
                .filter(file => file.type.startsWith('image/'))
                .map(file => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                    });
                });
            
            const base64Images = await Promise.all(imagePromises);
            
            onSendMessage(value.trim(), base64Images);
            setValue("");
            setAttachments([]);
            adjustHeight(true);
        }
    };

    const fileInputRef = useRef(null);

    const handleAttachFile = (e) => {
        if (isOutOfCredits) return;
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setAttachments(prev => [...prev, ...files]);
        }
        // Reset so same file can be picked again
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const triggerFileInput = () => {
        if (isOutOfCredits) return;
        fileInputRef.current?.click();
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };
    
    const selectCommandSuggestion = (index) => {
        const selectedCommand = commandSuggestions[index];
        setValue(selectedCommand.prefix + ' ');
        setShowCommandPalette(false);
        
        setRecentCommand(selectedCommand.label);
        setTimeout(() => setRecentCommand(null), 2000);
    };

    const hasMessages = messages.length > 0;

    return (
        <div className="flex-1 flex flex-col w-full bg-transparent text-white relative overflow-hidden">
            {/* Hidden File Input */}
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleAttachFile}
                className="hidden"
                multiple
            />
            {/* Background effects */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-dim/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
            </div>

            {/* Messages area or empty state */}
            {hasMessages ? (
                <div className="flex-1 overflow-y-auto relative z-10 py-8">
                    <div className="flex flex-col gap-6">
                        {messages.map((msg, idx) => (
                            <MessageBubble
                                key={msg.timestamp + '-' + idx}
                                message={msg}
                                isLast={idx === messages.length - 1}
                            />
                        ))}

                        {/* Typing indicator when waiting for AI */}
                        <AnimatePresence>
                            {isWaitingReply && <TypingIndicator />}
                        </AnimatePresence>

                        <div ref={messagesEndRef} />
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center relative z-10 px-6">
                    <motion.div 
                        className="w-full max-w-xl space-y-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="text-center space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-block"
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <img src="/logo.png" alt="FinMind Logo" className="w-20 h-20 object-contain rounded-3xl shadow-[0_0_50px_rgba(123,92,240,0.3)] mb-2" />
                                    <h1 className="font-display text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40 pb-1">
                                        FinMind Protocol
                                    </h1>
                                </div>
                                <motion.div 
                                    className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent my-2"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "100%", opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                />
                            </motion.div>
                            <motion.p 
                                className="text-sm text-white/40 font-mono"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Intelligence Engine Online. Awaiting financial parameters.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: "📊", label: "Monthly Budget", desc: "Create a 50/30/20 plan", prompt: "Create a monthly budget plan for me based on the 50/30/20 rule. My monthly income is $5,000." },
                                { icon: "📈", label: "Investment Advice", desc: "Strategy for Q4 2024", prompt: "What should my investment strategy look like for the rest of 2024? I have a moderate risk tolerance." },
                                { icon: "💰", label: "Savings Goal", desc: "Saving for a home downpayment", prompt: "How should I save for a $50,000 house downpayment? I want to reach this goal in 3 years." },
                                { icon: "🏦", label: "Bank Audit", desc: "Compare high-yield accounts", prompt: "What are the best high-yield savings accounts available right now? Help me compare their features." }
                            ].map((suggestion, i) => (
                                <motion.button
                                    key={suggestion.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    onClick={() => !isOutOfCredits && onSendMessage(suggestion.prompt)}
                                    disabled={isOutOfCredits}
                                    className={cn(
                                        "flex flex-col items-start p-4 bg-surface/40 border border-border/50 rounded-2xl transition-all group text-left",
                                        isOutOfCredits ? "opacity-50 cursor-not-allowed" : "hover:bg-surface/60 hover:border-primary/30"
                                    )}
                                >
                                    <span className="text-2xl mb-2">{suggestion.icon}</span>
                                    <span className="font-semibold text-white group-hover:text-primary transition-colors">{suggestion.label}</span>
                                    <span className="text-xs text-text-secondary/80">{suggestion.desc}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
            
            {/* Input area — always at bottom */}
            <div className="relative z-10 p-6 pt-2">
                <div className="w-full max-w-3xl mx-auto">
                    <motion.div 
                        className={cn(
                            "relative backdrop-blur-2xl rounded-2xl border overflow-visible shadow-[0_0_80px_rgba(123,92,240,0.08)] transition-all duration-300",
                            isOutOfCredits ? "bg-red-500/5 border-red-500/20 shadow-[0_0_80px_rgba(239,68,68,0.08)]" : "bg-surface/50 border-border"
                        )}
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <AnimatePresence>
                            {showCommandPalette && !isOutOfCredits && (
                                <motion.div 
                                    ref={commandPaletteRef}
                                    className="absolute left-4 right-4 bottom-full mb-2 backdrop-blur-xl bg-[#0A0A0F]/95 rounded-xl z-50 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-primary/20 overflow-hidden"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="py-1">
                                        {commandSuggestions.map((suggestion, index) => (
                                            <motion.div
                                                key={suggestion.prefix}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer",
                                                    activeSuggestion === index 
                                                        ? "bg-primary/20 text-white" 
                                                        : "text-white/70 hover:bg-white/5"
                                                )}
                                                onClick={() => selectCommandSuggestion(index)}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.03 }}
                                            >
                                                <div className="w-5 h-5 flex items-center justify-center text-primary">
                                                    {suggestion.icon}
                                                </div>
                                                <div className="font-medium">{suggestion.label}</div>
                                                <div className="text-white/40 text-xs ml-1 font-mono">
                                                    {suggestion.prefix}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-3 pb-0">
                            <Textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    adjustHeight();
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                disabled={isOutOfCredits}
                                placeholder={
                                    isOutOfCredits 
                                        ? "Insufficient credits. Your balance resets to 20 daily." 
                                        : (hasMessages ? "Continue the conversation..." : "Request analysis, query ledger, or formulate plans...")
                                }
                                containerClassName="w-full"
                                className={cn(
                                    "w-full px-4 py-3",
                                    "resize-none",
                                    "bg-transparent text-[15px]",
                                    "border-none ring-0 focus:ring-0 focus:outline-none",
                                    isOutOfCredits ? "text-red-400/50" : "text-white/90",
                                    "placeholder:text-white/20",
                                    "min-h-[56px]"
                                )}
                                style={{ overflow: "hidden" }}
                                showRing={false}
                            />
                        </div>

                        <AnimatePresence>
                            {attachments.length > 0 && (
                                <motion.div 
                                    className="px-4 pb-2 flex gap-2 flex-wrap"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    {attachments.map((file, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center gap-2 text-xs bg-white/10 border border-white/10 py-1.5 px-3 rounded-xl text-white/90"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                        >
                                            <span className="font-mono">{file.name}</span>
                                            <button 
                                                onClick={() => removeAttachment(index)}
                                                className="text-white/40 hover:text-danger hover:scale-110 transition-all"
                                            >
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-3 pt-1 border-t border-border/30 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <motion.button
                                    type="button"
                                    onClick={triggerFileInput}
                                    whileTap={{ scale: 0.94 }}
                                    disabled={isOutOfCredits}
                                    className={cn(
                                        "p-2 rounded-xl transition-colors",
                                        isOutOfCredits ? "text-white/10 cursor-not-allowed" : "text-white/40 hover:text-primary hover:bg-primary/10"
                                    )}
                                    title="Attach documents"
                                >
                                    <Paperclip className="w-4.5 h-4.5" />
                                </motion.button>
                                <motion.button
                                    type="button"
                                    data-command-button
                                    onClick={(e) => {
                                        if (isOutOfCredits) return;
                                        e.stopPropagation();
                                        setShowCommandPalette(prev => !prev);
                                    }}
                                    whileTap={{ scale: 0.94 }}
                                    disabled={isOutOfCredits}
                                    className={cn(
                                        "p-2 rounded-xl transition-colors",
                                        isOutOfCredits ? "text-white/10 cursor-not-allowed" : cn(
                                            "text-white/40 hover:text-primary hover:bg-primary/10",
                                            showCommandPalette && "bg-primary/20 text-primary"
                                        )
                                    )}
                                >
                                    <Command className="w-4.5 h-4.5" />
                                </motion.button>
                                
                                {isOutOfCredits && (
                                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter ml-2 bg-red-500/10 px-2 py-1 rounded">
                                        Limit Reached
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {value.trim().length > 0 && !isOutOfCredits && (
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-50">Cost: 3 Credits</span>
                                )}
                                <motion.button
                                    type="button"
                                    onClick={handleSendMessage}
                                    whileHover={!isOutOfCredits && value.trim() ? { scale: 1.02 } : {}}
                                    whileTap={!isOutOfCredits && value.trim() ? { scale: 0.95 } : {}}
                                    disabled={isWaitingReply || !value.trim() || isOutOfCredits}
                                    className={cn(
                                        "px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                                        "flex items-center gap-2",
                                        !isOutOfCredits && value.trim()
                                            ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(123,92,240,0.5)]"
                                            : "bg-surface text-white/10"
                                    )}
                                >
                                    {isWaitingReply ? (
                                        <LoaderIcon className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
                                    ) : (
                                        <SendIcon className="w-4 h-4" />
                                    )}
                                    <span>Send</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}


function TypingDots() {
    return (
        <div className="flex items-center ml-1">
            {[1, 2, 3].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 bg-primary rounded-full mx-0.5"
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [0.85, 1.2, 0.85]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: dot * 0.15,
                        ease: "easeInOut",
                    }}
                    style={{
                        boxShadow: "0 0 8px rgba(123,92,240, 0.5)"
                    }}
                />
            ))}
        </div>
    );
}
