import React, { useEffect, useRef, useCallback, useTransition, useState } from "react";
import { cn } from "../../lib/utils";
import {
    Image,
    FileUp,
    PenTool,
    Monitor,
    CircleUserRound,
    ArrowUp,
    Paperclip,
    Plus,
    Send,
    X,
    Loader2,
    Sparkles,
    Command,
    User,
    Bot,
    TrendingUp,
    Globe,
    ExternalLink,
    Wallet,
    Info,
    ShieldCheck,
    Target,
    Zap,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Smile,
    Frown,
    AlertCircle,
    Eye,
    ShieldAlert,
    PieChart,
    Layers,
    SearchX,
    Cpu,
    CheckCircle2,
    Box,
    Brain,
    ChevronDown,
    ChevronUp,
    BarChart,
    LogOut
} from "lucide-react";
import { 
    Area, 
    AreaChart, 
    CartesianGrid, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    BarChart as RechartsBarChart,
    Bar,
    Cell,
    ComposedChart,
    Line,
    ReferenceLine
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

const Candlestick = (props) => {
    const { x, y, width, height, low, high, open, close } = props;
    const isUp = close >= open;
    const color = isUp ? "#22c55e" : "#ef4444"; // TradingView green/red
    
    // Calculate wick positions
    const wickX = x + width / 2;
    const candleWidth = width * 0.7; // Leave some gap between candles
    const candleX = x + (width - candleWidth) / 2;
    
    // Map price to pixel height ratio
    const priceToPixel = height / (high - low);
    const bodyHeight = Math.max(1, Math.abs(open - close) * priceToPixel);
    const bodyY = isUp 
        ? y + (high - close) * priceToPixel 
        : y + (high - open) * priceToPixel;

    return (
        <g>
            {/* Wick */}
            <line 
                x1={wickX} 
                y1={y} 
                x2={wickX} 
                y2={y + height} 
                stroke={color} 
                strokeWidth={1} 
            />
            {/* Body */}
            <rect
                x={candleX}
                y={bodyY}
                width={candleWidth}
                height={bodyHeight}
                fill={color}
                stroke={color}
                strokeWidth={1}
            />
        </g>
    );
};
import { PromptInputBox } from "./ai-prompt-box";

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

import FinancialChart from "./financial-chart";

// Typing effect component for smooth text reveal
function TypingEffect({ content, onComplete }) {
    const [displayedContent, setDisplayedContent] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const words = content.split(" ");
    
    useEffect(() => {
        if (currentIndex < words.length) {
            const timer = setTimeout(() => {
                setDisplayedContent(prev => prev + (prev ? " " : "") + words[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 30); // Adjust speed here
            return () => clearTimeout(timer);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, words, onComplete]);

    return (
        <div className="chat-markdown overflow-x-auto relative">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {displayedContent}
            </ReactMarkdown>
            {currentIndex < words.length && (
                <motion.span 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-1.5 h-4 bg-primary ml-1 align-middle"
                />
            )}
        </div>
    );
}

// Global Regex for parsing special blocks
const chartRegex = /\[CHART_DATA\]\s*({[\s\S]*?})\s*\[\/CHART_DATA\]/g;
const sourcesRegex = /\[SOURCES\]\s*({[\s\S]*?})\s*\[\/SOURCES\]/g;
const scenarioRegex = /\[INVESTMENT_SCENARIO\]\s*({[\s\S]*?})\s*\[\/INVESTMENT_SCENARIO\]/g;
const signalRegex = /\[TRADE_SIGNAL\]\s*({[\s\S]*?})\s*\[\/TRADE_SIGNAL\]/g;
const moodRegex = /\[MARKET_MOOD\]\s*({[\s\S]*?})\s*\[\/MARKET_MOOD\]/g;
const fraudRegex = /\[FRAUD_DETECTION\]\s*({[\s\S]*?})\s*\[\/FRAUD_DETECTION\]/g;
const strategyRegex = /\[PORTFOLIO_STRATEGY\]\s*({[\s\S]*?})\s*\[\/PORTFOLIO_STRATEGY\]/g;
const simulationRegex = /\[MARKET_SIMULATION\]\s*({[\s\S]*?})\s*\[\/MARKET_SIMULATION\]/g;

// Function to parse special blocks from AI content
const parseSpecialBlocks = (content, isStreaming) => {
    if (!content) return { cleanContent: "", charts: [], sources: [], scenario: null, tradeSignal: null, marketMood: null, fraudDetection: null, portfolioStrategy: null, marketSimulation: null };

    const charts = [];
    const sources = [];
    let scenario = null;
    let tradeSignal = null;
    let marketMood = null;
    let fraudDetection = null;
    let portfolioStrategy = null;
    let marketSimulation = null;
    let cleanContent = content;
    let match;

    // Generic function to extract blocks (streaming-friendly)
    const extractBlock = (tagName, isJson = false) => {
        const startTag = `[${tagName}]`;
        const endTag = `[/${tagName}]`;
        
        const sIdx = cleanContent.indexOf(startTag);
        if (sIdx === -1) return null;

        const eIdx = cleanContent.indexOf(endTag, sIdx + startTag.length);
        
        if (eIdx !== -1) {
            // Found complete block
            const blockContent = cleanContent.substring(sIdx + startTag.length, eIdx).trim();
            const fullBlockWithTags = cleanContent.substring(sIdx, eIdx + endTag.length);
            
            // Remove from cleanContent using the exact range found
            cleanContent = cleanContent.substring(0, sIdx) + cleanContent.substring(eIdx + endTag.length);
            
            if (isJson) {
                // Aggressively find the JSON object within the block
                let sanitized = blockContent.replace(/```json|```/g, '').trim();
                
                // Remove JS-style comments (Gemini sometimes adds these)
                sanitized = sanitized.replace(/\/\/.*/g, '');
                
                const firstBrace = sanitized.indexOf('{');
                const lastBrace = sanitized.lastIndexOf('}');
                
                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    sanitized = sanitized.substring(firstBrace, lastBrace + 1);
                }

                try { 
                    return JSON.parse(sanitized); 
                } catch (e) { 
                    // Attempt to fix common JSON errors (missing trailing characters)
                    try {
                        let fixed = sanitized;
                        // Find the last complete object structure
                        const lastValidBrace = sanitized.lastIndexOf('}');
                        if (lastValidBrace !== -1) {
                            fixed = sanitized.substring(0, lastValidBrace + 1);
                            return JSON.parse(fixed);
                        }
                        throw new Error("No valid brace found");
                    } catch (e2) {
                        return { error: "Simulation data malformed", raw: sanitized, isStreaming: false }; 
                    }
                }
            }
            return blockContent;
        } else if (isStreaming) {
            // Block is still being streamed
            const blockContent = cleanContent.substring(sIdx + startTag.length).trim();
            cleanContent = cleanContent.substring(0, sIdx);
            
            if (isJson) {
                return { isStreaming: true, partialContent: blockContent };
            }
            return blockContent;
        } else {
            // Message finished but no end tag - clean up start tag anyway
            const blockContent = cleanContent.substring(sIdx + startTag.length).trim();
            cleanContent = cleanContent.substring(0, sIdx);
            
            if (isJson) {
                let sanitized = blockContent.replace(/```json|```/g, '').trim();
                sanitized = sanitized.replace(/\/\/.*/g, '');
                
                const firstBrace = sanitized.indexOf('{');
                const lastBrace = sanitized.lastIndexOf('}');
                
                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    sanitized = sanitized.substring(firstBrace, lastBrace + 1);
                } else if (firstBrace !== -1) {
                    sanitized = sanitized.substring(firstBrace);
                }

                const repairJson = (jsonStr) => {
                    let text = jsonStr.trim();
                    // Attempt simple fixes first
                    try { return JSON.parse(text); } catch (e) {}

                    // Remove trailing commas before closing
                    text = text.replace(/,(\s*[\]}])/g, '$1');
                    
                    // Count braces and brackets
                    let openBraces = (text.match(/\{/g) || []).length;
                    let closeBraces = (text.match(/\}/g) || []).length;
                    let openBrackets = (text.match(/\[/g) || []).length;
                    let closeBrackets = (text.match(/\]/g) || []).length;

                    // Close open structures
                    while (openBrackets > closeBrackets) { text += ']'; closeBrackets++; }
                    while (openBraces > closeBraces) { text += '}'; closeBraces++; }

                    try { return JSON.parse(text); } catch (e) {
                        // If it still fails, try to find the last complete object in the scenarios array
                        if (text.includes('"scenarios"')) {
                            const scenarioStart = text.indexOf('"scenarios"');
                            const lastObjectEnd = text.lastIndexOf('}');
                            if (lastObjectEnd > scenarioStart) {
                                let truncated = text.substring(0, lastObjectEnd + 1) + ']}';
                                try { return JSON.parse(truncated); } catch (e2) {
                                    // Final attempt: double close
                                    try { return JSON.parse(truncated + '}'); } catch (e3) { return null; }
                                }
                            }
                        }
                        return null;
                    }
                };

                const parsed = repairJson(sanitized);
                if (parsed) return parsed;
                return { error: "Incomplete simulation data", raw: sanitized, isStreaming: false };
            }
            return blockContent;
        }
    };


    
    // For arrays like charts and sources, we still use regex for simplicity if they are multiple,
    // but for singletons we use extractBlock
    const parseJsonBlock = (tag) => {
        return extractBlock(tag, true);
    };

    tradeSignal = parseJsonBlock('TRADE_SIGNAL');
    marketMood = parseJsonBlock('MARKET_MOOD');
    fraudDetection = parseJsonBlock('FRAUD_DETECTION');
    portfolioStrategy = parseJsonBlock('PORTFOLIO_STRATEGY');
    marketSimulation = parseJsonBlock('MARKET_SIMULATION');
    scenario = parseJsonBlock('INVESTMENT_SCENARIO');

    // Last resort: If no simulation tag but we see JSON with 'scenarios'
    if (!marketSimulation && content.includes('"scenarios"')) {
        const firstBrace = content.indexOf('{');
        const lastBrace = content.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            try {
                const potential = JSON.parse(content.substring(firstBrace, lastBrace + 1));
                if (potential.asset && potential.scenarios) {
                    marketSimulation = potential;
                    // Try to clean content if it was a successful parse
                    cleanContent = cleanContent.replace(content.substring(firstBrace, lastBrace + 1), '');
                }
            } catch (e) {}
        }
    }

    // Charts and Sources can be multiple
    chartRegex.lastIndex = 0;
    while ((match = chartRegex.exec(content)) !== null) {
        try { charts.push(JSON.parse(match[1])); cleanContent = cleanContent.replace(match[0], ''); } catch (e) {}
    }
    sourcesRegex.lastIndex = 0;
    while ((match = sourcesRegex.exec(content)) !== null) {
        try { sources.push(JSON.parse(match[1])); cleanContent = cleanContent.replace(match[0], ''); } catch (e) {}
    }

    return { cleanContent: cleanContent.trim(), charts, sources, scenario, tradeSignal, marketMood, fraudDetection, portfolioStrategy, marketSimulation };
};

// Message bubble component
function MessageBubble({ message, isLast, onSendMessage, plan = 'free' }) {
    const isUser = message.role === 'user';
    const [isTypingComplete, setIsTypingComplete] = useState(!isLast || isUser);

    const { cleanContent, charts, sources, scenario, tradeSignal, marketMood, fraudDetection, portfolioStrategy, marketSimulation } = isUser 
        ? { cleanContent: message.content, charts: [], sources: [], scenario: null, tradeSignal: null, marketMood: null, fraudDetection: null, portfolioStrategy: null, marketSimulation: null } 
        : parseSpecialBlocks(message.content, message.isStreaming);

    return (
        <motion.div
            className={cn(
                "flex gap-3 max-w-3xl mx-auto w-full px-4 md:px-6",
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
                {isUser ? <User size={15} /> : <Bot size={15} />}
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
                    "inline-block text-[14.5px] leading-relaxed rounded-2xl px-4 py-3 max-w-full relative",
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
                                        loading="lazy"
                                    />
                                ))}
                            </div>
                        )}
                        {isUser ? (
                            <div>{cleanContent}</div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="chat-markdown overflow-x-auto break-words whitespace-pre-wrap">
                                    {isLast && !isTypingComplete ? (
                                        <TypingEffect 
                                            content={cleanContent} 
                                            onComplete={() => setIsTypingComplete(true)} 
                                        />
                                    ) : (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {cleanContent}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Rendering Intelligence Elements after typing is done (or immediately if streaming) */}
                        {(isTypingComplete || message.isStreaming) && (
                            <motion.div 
                                className="flex flex-col gap-4 mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Trade Signal Station Card - Starter+ */}
                                {tradeSignal && (plan.toLowerCase() === 'starter' || plan.toLowerCase() === 'advance') && tradeSignal.asset && (
                                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                                        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Activity size={16} className="text-primary" />
                                                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Alpha Intelligence Signal</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded text-[10px] text-primary font-bold">
                                                <Zap size={10} />
                                                <span>{tradeSignal?.timeframe}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h4 className="text-xl font-black text-white">{tradeSignal?.asset}</h4>
                                                    <p className="text-[10px] text-slate-500 font-medium">Technical Setup Analysis</p>
                                                </div>
                                                <div className={cn(
                                                    "px-4 py-2 rounded-lg font-black text-lg flex items-center gap-2",
                                                    tradeSignal?.action === 'BUY' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
                                                    tradeSignal?.action === 'SELL' ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" :
                                                    "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                )}>
                                                    {tradeSignal?.action === 'BUY' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                                    {tradeSignal?.action}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3 mb-4">
                                                <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                                                    <div className="text-[9px] uppercase text-slate-500 font-bold mb-1">Entry</div>
                                                    <div className="text-sm font-bold text-white">₹{tradeSignal?.entry}</div>
                                                </div>
                                                <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                                                    <div className="text-[9px] uppercase text-slate-500 font-bold mb-1">Stop Loss</div>
                                                    <div className="text-sm font-bold text-rose-400">₹{tradeSignal?.stoploss}</div>
                                                </div>
                                                <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                                                    <div className="text-[9px] uppercase text-slate-500 font-bold mb-1">Risk:Reward</div>
                                                    <div className="text-sm font-bold text-emerald-400">{tradeSignal?.riskReward}</div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="text-[9px] uppercase text-slate-500 font-bold mb-2 flex items-center gap-1">
                                                    <Target size={18} /> Profit Targets
                                                </div>
                                                <div className="flex gap-2">
                                                    {(tradeSignal.targets || []).map((t, i) => (
                                                        <div key={i} className="flex-1 bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-lg text-center">
                                                            <div className="text-[8px] text-emerald-500/60 font-bold uppercase">T{i+1}</div>
                                                            <div className="text-xs font-bold text-emerald-500">₹{t}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
                                                {(tradeSignal.indicators || []).map((ind, i) => (
                                                    <span key={i} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                                                        {ind}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Investment Scenario Card - Starter+ */}
                                {scenario && (plan.toLowerCase() === 'starter' || plan.toLowerCase() === 'advance') && scenario.asset && (
                                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <TrendingUp size={60} />
                                        </div>
                                        <div className="flex items-center gap-2 text-primary font-bold mb-3">
                                            <Wallet size={18} />
                                            <span>Simulated Return Potential</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <div className="text-[10px] uppercase text-primary/60 font-bold">Current Target</div>
                                                <div className="text-lg font-bold">${scenario?.predictedTarget}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase text-primary/60 font-bold">Potential ROI</div>
                                                <div className="text-lg font-bold text-emerald-500">+{scenario?.potentialGain}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-text-primary/70 bg-white/40 dark:bg-black/20 p-2 rounded-lg italic">
                                            "{scenario?.analysis}"
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary/10">
                                            <div className="flex items-center gap-1.5 text-[10px] text-primary/70">
                                                <ShieldCheck size={12} />
                                                <span>Confidence: {scenario.confidenceScore}%</span>
                                            </div>
                                            <button 
                                                onClick={() => onSendMessage?.(`Simulate ${scenario.asset}`)}
                                                className="text-[10px] font-bold text-white bg-primary px-3 py-1 rounded-full hover:bg-primary/90 transition-colors"
                                            >
                                                Simulate Investment
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Market Mood Audit - Advance Only */}
                                {marketMood && (plan === 'advance') && marketMood.narrative && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                                    <Activity className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-white">Market Sentiment Audit</h4>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Phase: Psychological Analysis</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-xl font-bold ${marketMood.score > 60 ? 'text-emerald-400' : marketMood.score < 40 ? 'text-rose-400' : 'text-amber-400'}`}>
                                                    {marketMood.score}
                                                </span>
                                                <span className="text-[10px] text-slate-500">Mood Score</span>
                                            </div>
                                        </div>

                                        <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
                                            <div 
                                                className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out bg-gradient-to-r ${marketMood.score > 60 ? 'from-emerald-600 to-emerald-400' : marketMood.score < 40 ? 'from-rose-600 to-rose-400' : 'from-amber-600 to-amber-400'}`}
                                                style={{ width: `${marketMood.score}%` }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Eye className="w-4 h-4 text-sky-400" />
                                                    <span className="text-xs font-medium text-slate-300">Narrative Focus</span>
                                                </div>
                                                <p className="text-sm text-white leading-relaxed">{marketMood?.narrative}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30">
                                                <div className="flex items-center gap-2 mb-2 text-rose-400">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="text-xs font-medium">Divergence Alert</span>
                                                </div>
                                                <p className="text-sm text-slate-300">Social vs. News: <span className="text-white font-semibold">{marketMood?.divergence}</span></p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {(marketMood.topDrivers || []).map((driver, idx) => (
                                                <span key={idx} className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
                                                    {driver}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="relative p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                                <Sparkles className="w-12 h-12 text-amber-500" />
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="w-4 h-4 text-amber-400" />
                                                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest italic">Contrarian Edge</span>
                                            </div>
                                            <p className="text-sm text-amber-50/90 font-medium leading-relaxed italic">
                                                "{marketMood?.contrarianSignal}"
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {fraudDetection && (plan === 'advance') && fraudDetection.verdict && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`mt-6 p-5 rounded-2xl border backdrop-blur-xl relative overflow-hidden ${
                                            fraudDetection?.verdict === 'Legit' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                                            fraudDetection?.verdict === 'Suspicious' ? 'bg-amber-500/5 border-amber-500/20' : 
                                            'bg-rose-500/5 border-rose-500/20'
                                        }`}
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan" />
                                        
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${
                                                    fraudDetection?.verdict === 'Legit' ? 'bg-emerald-500/10 text-emerald-500' : 
                                                    fraudDetection?.verdict === 'Suspicious' ? 'bg-amber-500/10 text-amber-500' : 
                                                    'bg-rose-500/10 text-rose-500'
                                                }`}>
                                                    {fraudDetection?.verdict === 'Legit' ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-white">Forensic Scam Analysis</h4>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Status: {fraudDetection?.regulatoryStatus}</p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                fraudDetection?.verdict === 'Legit' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                                                fraudDetection?.verdict === 'Suspicious' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 
                                                'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                            }`}>
                                                {fraudDetection?.verdict}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
                                                <div className="flex items-center gap-2 mb-2 text-rose-400 text-xs font-bold uppercase tracking-tighter">
                                                    <AlertCircle size={14} /> Intelligence Red Flags
                                                </div>
                                                <ul className="space-y-1.5">
                                                    {(fraudDetection.redFlags || []).map((flag, i) => (
                                                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                                            <span className="text-rose-500 mt-1">•</span> {flag}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
                                                <div className="flex items-center gap-2 mb-2 text-sky-400 text-xs font-bold uppercase tracking-tighter">
                                                    <SearchX size={14} /> Global Forensic Findings
                                                </div>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    {fraudDetection?.findings}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 mt-2 cursor-pointer hover:bg-white/10 transition-colors group">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-widest">
                                                <Globe size={14} className="text-sky-400 group-hover:rotate-180 transition-transform duration-500" />
                                                Run Secondary Background Check
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {portfolioStrategy && (plan.toLowerCase() === 'advance') && portfolioStrategy.allocation && portfolioStrategy.allocation.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden relative"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
                                        
                                        <div className="flex items-center gap-3 mb-6 relative z-10">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <PieChart className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-white">Strategy Sandbox Simulator</h4>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Asset Allocation Model</p>
                                            </div>
                                        </div>

                                        {/* Allocation Bars */}
                                        <div className="space-y-4 mb-8 relative z-10">
                                            {(portfolioStrategy.allocation || []).map((item, i) => (
                                                <div key={i} className="space-y-1.5">
                                                    <div className="flex justify-between text-[11px]">
                                                        <span className="text-slate-300 font-medium">{item.asset} ({item.type})</span>
                                                        <span className="text-primary font-bold">{item.weight}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${item.weight}%` }}
                                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                                            className="h-full bg-primary"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                                            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                                                <div className="text-[9px] uppercase text-emerald-500 font-bold mb-1">3Y Bull Case</div>
                                                <div className="text-lg font-black text-emerald-400">{portfolioStrategy?.forecast?.threeYear}</div>
                                            </div>
                                            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center">
                                                <div className="text-[9px] uppercase text-slate-500 font-bold mb-1">Conservative</div>
                                                <div className="text-lg font-black text-white">{portfolioStrategy?.forecast?.conservative}</div>
                                            </div>
                                        </div>

                                        {/* Stress Test */}
                                        <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 mb-6 relative z-10">
                                            <div className="flex items-center gap-2 mb-2 text-rose-400">
                                                <Layers size={14} className="animate-pulse" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Crash Stress Test</span>
                                            </div>
                                            <p className="text-xs text-rose-200/70 leading-relaxed italic">
                                                "{portfolioStrategy?.stressTest}"
                                            </p>
                                        </div>

                                        {/* Interactive Simulation Call */}
                                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 relative z-10">
                                            <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Sandbox Simulation Required</div>
                                            <p className="text-xs text-white/80 mb-4">{portfolioStrategy?.simulationInput}</p>
                                            <button 
                                                onClick={() => onSendMessage?.(portfolioStrategy?.simulationInput)}
                                                className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                            >
                                                <Zap size={14} />
                                                Launch Live Simulation
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {marketSimulation && (plan.toLowerCase() === 'starter' || plan.toLowerCase() === 'advance') && marketSimulation.scenarios && marketSimulation.scenarios.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className="mt-6 p-6 rounded-3xl bg-[#0D0D12] border border-white/10 shadow-2xl relative overflow-hidden group w-full"
                                    >
                                        {marketSimulation.isStreaming ? (
                                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                                <div className="relative">
                                                    <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                                                    <BarChart className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
                                                </div>
                                                <div className="text-center">
                                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Running Market Simulation</h4>
                                                    <p className="text-[10px] text-text-secondary mt-1 animate-pulse">Aggregating historical nodes and sentiment vectors...</p>
                                                </div>
                                            </div>
                                        ) : marketSimulation.error ? (
                                            <div className="flex flex-col items-center justify-center py-8 px-4 gap-3 bg-red-500/5 rounded-2xl border border-red-500/10">
                                                <div className="flex items-center gap-2 text-red-400">
                                                    <AlertCircle size={18} />
                                                    <span className="text-[13px] font-semibold">{marketSimulation.error}</span>
                                                </div>
                                                <p className="text-[11px] text-text-secondary/60 text-center max-w-xs leading-relaxed">
                                                    The AI provided incomplete or incorrectly formatted parameters.
                                                </p>
                                                <details className="w-full mt-2">
                                                    <summary className="cursor-pointer text-[9px] text-primary/40 hover:text-primary transition-colors uppercase tracking-widest font-bold text-center list-none">
                                                        View Raw Data Trace
                                                    </summary>
                                                    <pre className="mt-2 p-3 text-[10px] bg-black/40 rounded-lg text-rose-300/60 overflow-x-auto font-mono whitespace-pre-wrap border border-white/5">
                                                        {marketSimulation.raw}
                                                    </pre>
                                                </details>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="absolute top-0 right-0 p-6 opacity-5">
                                                    <BarChart size={120} />
                                                </div>
                                                
                                                <div className="flex items-center justify-between mb-8 relative z-10">
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
                                                                <TrendingUp className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="text-lg font-black text-white tracking-tight uppercase">
                                                                        {marketSimulation.asset}
                                                                    </h4>
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-bold uppercase tracking-widest">1M</span>
                                                                </div>
                                                                <div className="flex items-center gap-3 text-[10px] font-mono">
                                                                    <span className="text-emerald-400">O: <span className="text-white">{marketSimulation?.scenarios?.[0]?.ohlc?.o || '-'}</span></span>
                                                                    <span className="text-emerald-400">H: <span className="text-white">{marketSimulation?.scenarios?.[0]?.ohlc?.h || '-'}</span></span>
                                                                    <span className="text-rose-400">L: <span className="text-white">{marketSimulation?.scenarios?.[0]?.ohlc?.l || '-'}</span></span>
                                                                    <span className="text-emerald-400">C: <span className="text-white">{marketSimulation?.scenarios?.[0]?.ohlc?.c || '-'}</span></span>
                                                                    <div className="flex items-center gap-1 ml-2 text-primary animate-pulse">
                                                                        <div className="w-1 h-1 rounded-full bg-primary"></div>
                                                                        <span className="uppercase tracking-widest font-black text-[8px]">Live Data Grounded</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-black text-white tracking-tighter leading-none mb-1">
                                                                {marketSimulation.currentPrice > 1000 || (marketSimulation.asset && /[A-Z]+\.NS|[A-Z]+\.BO/.test(marketSimulation.asset)) ? '₹' : '$'}
                                                                {marketSimulation.currentPrice?.toLocaleString()}
                                                            </div>
                                                            <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-emerald-400">
                                                                <ArrowUpRight size={12} />
                                                                <span>+2.45%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="h-[240px] w-full mb-6">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <ComposedChart data={marketSimulation?.scenarios || []}>
                                                            <defs>
                                                                <linearGradient id="bullColor" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                                                </linearGradient>
                                                                <linearGradient id="baseColor" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#7B5CF0" stopOpacity={0.2}/>
                                                                    <stop offset="95%" stopColor="#7B5CF0" stopOpacity={0}/>
                                                                </linearGradient>
                                                                <linearGradient id="bearColor" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                                                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="0" stroke="#ffffff08" vertical={true} horizontal={true} />
                                                            <XAxis 
                                                                dataKey="month" 
                                                                axisLine={false} 
                                                                tickLine={false} 
                                                                tick={{fill: '#4B5563', fontSize: 9, fontWeight: 700}}
                                                                dy={10}
                                                            />
                                                            <YAxis 
                                                                orientation="right"
                                                                axisLine={false}
                                                                tickLine={false}
                                                                tick={{fill: '#4B5563', fontSize: 9, fontWeight: 700}}
                                                                domain={['auto', 'auto']}
                                                                mirror={false}
                                                            />
                                                            <YAxis yAxisId="volume" hide domain={[0, dataMax => dataMax * 4]} />
                                                            <Tooltip 
                                                                cursor={{ stroke: '#ffffff15', strokeWidth: 1 }}
                                                                content={({ active, payload, label }) => {
                                                                    if (active && payload && payload.length) {
                                                                        const ohlc = payload[0]?.payload?.ohlc;
                                                                        const vol = payload[0]?.payload?.volume;
                                                                        return (
                                                                            <div className="bg-[#0D0D12] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl border-l-4 border-l-primary min-w-[160px]">
                                                                                <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 border-b border-white/5 pb-1 flex justify-between items-center">
                                                                                    <span>{label}</span>
                                                                                    {vol && <span className="text-white/40 font-mono">V: {(vol/1000).toFixed(1)}K</span>}
                                                                                </div>
                                                                                {ohlc && (
                                                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                                                                                        <div className="flex flex-col"><span className="text-[8px] text-text-secondary uppercase font-bold">Open</span><span className="text-xs font-black text-white">${ohlc.o}</span></div>
                                                                                        <div className="flex flex-col"><span className="text-[8px] text-text-secondary uppercase font-bold">Close</span><span className="text-xs font-black text-white">${ohlc.c}</span></div>
                                                                                        <div className="flex flex-col"><span className="text-[8px] text-text-secondary uppercase font-bold">High</span><span className="text-xs font-black text-emerald-400">${ohlc.h}</span></div>
                                                                                        <div className="flex flex-col"><span className="text-[8px] text-text-secondary uppercase font-bold">Low</span><span className="text-xs font-black text-rose-400">${ohlc.l}</span></div>
                                                                                    </div>
                                                                                )}
                                                                                <div className="space-y-1.5 border-t border-white/5 pt-2">
                                                                                    {payload.filter(p => !p.dataKey.includes('ohlc') && p.dataKey !== 'volume').map((p, i) => (
                                                                                        <div key={i} className="flex items-center justify-between gap-4">
                                                                                            <span className="text-[9px] font-black uppercase tracking-wider opacity-60" style={{ color: p.color }}>{p.name}:</span>
                                                                                            <span className="text-xs font-black text-white">${p.value?.toLocaleString() || 0}</span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    return null;
                                                                }} 
                                                            />
                                                            <Area type="monotone" name="Bull Forecast" dataKey="bull" stroke="#22c55e" fillOpacity={1} fill="url(#bullColor)" strokeWidth={0} />
                                                            <Area type="monotone" name="Bear Forecast" dataKey="bear" stroke="#ef4444" fillOpacity={1} fill="url(#bearColor)" strokeWidth={0} />
                                                            <Area type="monotone" name="Base Trend" dataKey="base" stroke="#7B5CF0" fillOpacity={1} fill="url(#baseColor)" strokeWidth={2} />
                                                            
                                                            {/* Current Price Reference Line */}
                                                            {marketSimulation.currentPrice && (
                                                                <ReferenceLine 
                                                                    y={marketSimulation.currentPrice} 
                                                                    stroke="#ffffff20" 
                                                                    strokeDasharray="3 3"
                                                                    label={{ 
                                                                        position: 'left', 
                                                                        value: `LIVE: ${marketSimulation.currentPrice}`, 
                                                                        fill: '#ffffff40', 
                                                                        fontSize: 8,
                                                                        fontWeight: 900
                                                                    }} 
                                                                />
                                                            )}

                                                            {/* Volume Bars */}
                                                            <Bar 
                                                                yAxisId="volume"
                                                                dataKey="volume" 
                                                                fillOpacity={0.15}
                                                            >
                                                                {marketSimulation?.scenarios?.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.ohlc?.c >= entry.ohlc?.o ? '#22c55e' : '#ef4444'} />
                                                                ))}
                                                            </Bar>

                                                            {/* Candlestick Layer */}
                                                            <Bar 
                                                                dataKey="base" 
                                                                shape={(props) => {
                                                                    const { ohlc } = props.payload;
                                                                    if (!ohlc) return null;
                                                                    return <Candlestick {...props} open={ohlc.o} close={ohlc.c} high={ohlc.h} low={ohlc.l} />;
                                                                }} 
                                                            />
                                                        </ComposedChart>
                                                    </ResponsiveContainer>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                                        <div className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                                                            <Target size={12} className="text-primary" />
                                                            Key Growth Drivers
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {marketSimulation.keyDrivers && marketSimulation.keyDrivers.length > 0 ? (
                                                                marketSimulation.keyDrivers.map((driver, i) => (
                                                                    <div key={i} className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
                                                                        {driver}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <span className="text-[10px] text-text-secondary/40 italic">Calculating factors...</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                                        <div className="text-[10px] font-black text-amber-400 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                                                            <LogOut size={12} className="text-amber-400" />
                                                            Strategic Exit
                                                        </div>
                                                        {marketSimulation.exitStrategy ? (
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[10px] text-text-secondary font-medium">Profit Target</span>
                                                                    <span className="text-[11px] font-black text-emerald-400">
                                                                        {marketSimulation.currentPrice > 1000 || (marketSimulation.asset && /[A-Z]+\.NS|[A-Z]+\.BO/.test(marketSimulation.asset)) ? '₹' : '$'}
                                                                        {marketSimulation.exitStrategy.target?.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[10px] text-text-secondary font-medium">Stop Loss</span>
                                                                    <span className="text-[11px] font-black text-rose-400">
                                                                        {marketSimulation.currentPrice > 1000 || (marketSimulation.asset && /[A-Z]+\.NS|[A-Z]+\.BO/.test(marketSimulation.asset)) ? '₹' : '$'}
                                                                        {marketSimulation.exitStrategy.stopLoss?.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center pt-1 border-t border-white/5">
                                                                    <span className="text-[10px] text-text-secondary font-medium">Exit Logic</span>
                                                                    <span className="text-[10px] font-bold text-white/70">{marketSimulation.exitStrategy.timeline}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-[10px] text-text-secondary/40 italic">HODL mode active. No exit triggers defined.</p>
                                                        )}
                                                    </div>
                                                    <div className="md:col-span-2 p-5 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden group/verdict">
                                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/verdict:opacity-20 transition-opacity">
                                                            <Activity size={40} className="text-primary" />
                                                        </div>
                                                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                                            <Zap size={14} />
                                                            Institutional Verdict
                                                        </div>
                                                        <p className="text-xs text-white/90 leading-relaxed font-medium">
                                                            {marketSimulation.verdict || "No verdict available for this simulation."}
                                                        </p>
                                                        <div className="mt-4 flex items-center gap-4 border-t border-primary/10 pt-4">
                                                            <div className="flex-1">
                                                                <div className="text-[8px] text-text-secondary uppercase font-black mb-1">Recommended Strategy</div>
                                                                <div className="text-[11px] font-black text-emerald-400 uppercase tracking-wide">
                                                                    {marketSimulation.exitStrategy?.target > (marketSimulation.currentPrice || 0) ? "Aggressive Accumulation" : "Tactical De-risking"}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 text-right">
                                                                <div className="text-[8px] text-text-secondary uppercase font-black mb-1">Risk Profile</div>
                                                                <div className={`text-[11px] font-black uppercase tracking-wide ${marketSimulation.confidence > 80 ? 'text-primary' : 'text-amber-400'}`}>
                                                                    {marketSimulation.confidence > 80 ? 'Low Volatility Alpha' : 'High Variance Growth'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )}

                                {/* Source Links Icons */}
                                {sources.length > 0 && (
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span className="text-[10px] uppercase text-text-secondary/50 font-bold mr-1">Verified Sources:</span>
                                        {sources.map((src, i) => (
                                            <a 
                                                key={i} 
                                                href={src.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 bg-surface-secondary border border-border/40 px-2 py-1 rounded-md text-[11px] text-text-secondary hover:text-primary hover:border-primary/30 transition-all group"
                                            >
                                                <Globe size={11} className="group-hover:scale-110 transition-transform" />
                                                <span>{src.name}</span>
                                                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {/* Financial Charts */}
                                {charts.map((chart, idx) => (
                                    <FinancialChart 
                                        key={idx}
                                        type={chart.type}
                                        data={chart.data}
                                        title={chart.title}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Typing indicator for AI
function TypingIndicator({ mode = 'default' }) {
    return (
        <motion.div
            className="flex gap-3 max-w-3xl mx-auto w-full px-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
        >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-gradient-to-br from-primary to-violet-600 text-white shadow-lg shadow-primary/20 font-black text-[10px]">
                FM
            </div>
            <div className="text-left">
                <div className="text-[10px] font-bold mb-1 text-primary uppercase tracking-widest">FinMind Intelligence</div>
                <div className="inline-flex items-center gap-3 bg-[#12121A]/80 backdrop-blur-xl border border-white/5 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-2xl">
                    <TypingDots />
                    <span className="text-[11px] font-medium text-text-secondary/60 italic">
                        {mode === 'think' ? 'Simulating financial models...' : 
                         mode === 'search' ? 'Scanning global markets...' : 
                         'Processing request...'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export function AnimatedAIChat({ messages = [], onSendMessage, isNewChat = true, credits = 0, plan = 'free', onOpenCanvas }) {
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
    const messagesContainerRef = useRef(null);
    const prevMessagesLength = useRef(messages.length);

    const isOutOfCredits = credits < 3;

    const commandSuggestions = [
        { 
            icon: <Image className="w-4 h-4" />, 
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
        }
    ];

    // Auto-scroll logic
    useEffect(() => {
        // Scroll to bottom on new messages
        if (messages.length > prevMessagesLength.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        prevMessagesLength.current = messages.length;
    }, [messages]);

    // Continuous scroll for streaming messages
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === 'assistant' && lastMessage.isStreaming) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }
    }, [messages[messages.length - 1]?.content]);

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
        
        // LIMIT CHECK
        if (plan !== 'advance' && (attachments.length + files.length) > 3) {
            alert("Free and Starter plans are limited to 3 file/image attachments per message. Upgrade to Advance for unlimited uploads.");
            return;
        }

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

    const renderInputBox = () => (
        <>
            <PromptInputBox 
                plan={plan}
                onSend={(message, files) => {
                    if (!isOutOfCredits) {
                        // Process files if any
                        if (files && files.length > 0) {
                            const imagePromises = files
                                .filter(file => file.type.startsWith('image/'))
                                .map(file => {
                                    return new Promise((resolve) => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => resolve(reader.result);
                                        reader.readAsDataURL(file);
                                    });
                                });
                            
                            Promise.all(imagePromises).then(base64Images => {
                                onSendMessage(message, base64Images);
                            });
                        } else {
                            onSendMessage(message);
                        }
                    }
                }}
                isLoading={isWaitingReply}
                placeholder={
                    isOutOfCredits 
                        ? "Insufficient credits. Your balance resets to 20 daily." 
                        : (hasMessages ? "Continue the conversation..." : "Ask anything about finance, stocks, or markets...")
                }
            />
            
            {isOutOfCredits && (
                <div className="mt-2 text-center">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter bg-red-500/10 px-2 py-1 rounded">
                        Limit Reached — Reset Daily
                    </span>
                </div>
            )}
        </>
    );

    return (
        <div className="flex-1 flex w-full h-full bg-transparent text-white relative overflow-hidden">
            {/* Main Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-500 ease-in-out relative"
            )}>
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
                    <div 
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto relative z-10 py-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent scroll-smooth"
                    >
                        <div className="flex flex-col gap-6 max-w-4xl mx-auto px-4 md:px-6">
                            {messages.map((msg, idx) => (
                                <MessageBubble
                                    key={msg.timestamp + '-' + idx}
                                    message={msg}
                                    isLast={idx === messages.length - 1}
                                    onSendMessage={onSendMessage}
                                    plan={plan}
                                />
                            ))}
                            
                            <div ref={messagesEndRef} className="h-4" />

                            {/* Typing indicator when waiting for AI */}
                            <AnimatePresence>
                                {isWaitingReply && (
                                    <TypingIndicator />
                                )}
                            </AnimatePresence>

                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 md:px-6">
                        <motion.div 
                            className="w-full max-w-xl text-center mb-10"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white/90 mb-3 leading-tight">How can I help with your wealth strategy today?</h2>
                            <p className="text-text-secondary/60 text-xs font-bold tracking-widest uppercase font-mono bg-white/5 px-3 py-1 rounded-full inline-block border border-white/5">FinMind Intelligence Engine Active</p>
                        </motion.div>
                        
                        <div className="w-full max-w-3xl mx-auto">
                            {renderInputBox()}
                        </div>
                    </div>
                )}
                
                {/* Input area at bottom — only if has messages */}
                {hasMessages && (
                    <div className="relative z-10 p-4 md:p-6 pt-2">
                        <div className="w-full max-w-3xl mx-auto">
                            {renderInputBox()}
                        </div>
                    </div>
                )}
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
