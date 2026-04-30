import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export function Features() {
    const headingRef = useRef(null);
    const isHeadingInView = useInView(headingRef, { once: true, amount: 0.1 });

    return (
        <section className="py-24 md:py-32 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -ml-64 pointer-events-none" />
            
            <div className="mx-auto max-w-6xl px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mb-16">
                    <div ref={headingRef}>
                        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white leading-tight">
                            <ScrambleText text="Autonomous Capital" inView={isHeadingInView} delay={0.2} />
                            {' '}<br />
                            <span className="relative inline-block mt-2">
                                <WordReveal text="Intelligence." className="text-primary relative z-10" inView={isHeadingInView} delay={0.8} />
                                <motion.div 
                                    className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={isHeadingInView ? { scale: 1.2, opacity: 1 } : { scale: 0, opacity: 0 }}
                                    transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
                                />
                            </span>
                        </h2>
                    </div>
                    <div>
                        <motion.p 
                            className="max-w-sm md:ml-auto text-text-secondary text-lg leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Say goodbye to static dashboards. FinMind AI proactively monitors your capital velocity and provides conversational deep-dives into your wealth.
                        </motion.p>
                    </div>
                </div>

                {/* Dashboard Mockup (Full width) */}
                <motion.div 
                    className="relative"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 1, delay: 0.6 }}
                >
                    <div className="rounded-[2.5rem] border-[12px] border-[#16161C] overflow-hidden bg-[#0D0D12] shadow-2xl relative">
                        <MockDashboard />
                    </div>
                    {/* Decorative glow */}
                    <div className="absolute -bottom-10 -left-10 size-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                </motion.div>
            </div>
        </section>
    );
}

function ScrambleText({ text, delay = 0, inView }: { text: string; delay?: number; inView: boolean }) {
    const [display, setDisplay] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&*";
    
    useEffect(() => {
        if (!inView) return;
        
        let iteration = 0;
        let interval: any = null;
        
        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                setDisplay(prev => 
                    text.split("").map((char, index) => {
                        if (index < iteration) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join("")
                );
                
                if (iteration >= text.length) clearInterval(interval);
                iteration += 1 / 3;
            }, 30);
        }, delay * 1000);
        
        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, [inView, text, delay]);

    return <span className="font-mono tracking-tighter opacity-90">{display}</span>;
}

function WordReveal({ text, className, inView, delay = 0 }: { text: string; className?: string; inView: boolean; delay?: number }) {
    const words = text.split(' ')
    return (
        <>
            {words.map((word, i) => (
                <span key={i} className="inline-block relative">
                    <motion.span
                        className={cn('inline-block py-1', className)}
                        initial={{ opacity: 0, y: 20, rotate: 5, scale: 0.9 }}
                        animate={inView ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : { opacity: 0, y: 20, rotate: 5, scale: 0.9 }}
                        transition={{
                            duration: 0.8,
                            delay: delay + i * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        {word}{i < words.length - 1 ? '\u00A0' : ''}
                    </motion.span>
                </span>
            ))}
        </>
    )
}

function MockDashboard() {
    return (
        <div className="bg-[#050505] min-h-[500px] p-6 md:p-10 flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                    <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--color-primary),0.3)]">
                        <span className="text-white font-black text-xl">✦</span>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white">AI Intelligence Node</h4>
                        <p className="text-text-secondary text-sm">Cluster ID: VX-7001-ALPHA</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-primary animate-pulse">● LIVE SYNC</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex-1 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                            <svg className="size-32" viewBox="0 0 100 100" fill="none">
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" />
                            </svg>
                        </div>
                        <h5 className="text-sm font-bold text-text-secondary mb-4 tracking-widest uppercase">Conversational Prompt</h5>
                        <p className="text-2xl md:text-3xl font-display font-medium leading-normal text-white max-w-lg">
                            "Analyze my portfolio exposure to the AI sector and suggest hedging strategies based on current volatility." 
                        </p>
                        <div className="mt-8 flex gap-4">
                            <div className="px-4 py-2 bg-primary/20 text-primary text-xs font-bold rounded-lg border border-primary/30">Hedge Profile: LOW</div>
                            <div className="px-4 py-2 bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10">Sector: TECH/AI</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex-1 divide-y divide-white/5">
                        <div className="pb-4">
                            <h5 className="text-xs font-bold text-text-secondary mb-1">CAPITAL VELOCITY</h5>
                            <div className="text-3xl font-bold text-green-400">+12.4%</div>
                        </div>
                        <div className="py-4">
                            <h5 className="text-xs font-bold text-text-secondary mb-1">RISK EXPOSURE</h5>
                            <div className="text-3xl font-bold text-primary">SECURE</div>
                        </div>
                        <div className="pt-4">
                            <h5 className="text-xs font-bold text-text-secondary mb-1">ACTIVE STRATEGIES</h5>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <div className="size-6 rounded-md bg-primary/40" />
                                <div className="size-6 rounded-md bg-white/20" />
                                <div className="size-6 rounded-md bg-white/10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl">
                <div className="size-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">✦</div>
                <div className="text-sm text-text-secondary italic">"Based on your current assets, the platform suggests moving 4.5% to Liquid Staking for optimized yield..."</div>
            </div>
        </div>
    );
}
