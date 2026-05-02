import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
    Activity, ChevronDown, Zap, ShieldCheck, BrainCircuit, 
    Search, MoreHorizontal, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Shared animation variants
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}
const fadeLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

export function FeaturesScaling() {
    const headingRef = useRef(null);
    const isHeadingInView = useInView(headingRef, { once: true, amount: 0.2 });

    return (
        <section className="py-24 md:py-32 bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            
            <div className="mx-auto md:max-w-6xl px-6 relative z-10">
                <motion.div 
                    className="grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:grid-cols-5 lg:gap-24"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={stagger}
                >
                    {/* Left Column */}
                    <motion.div className="lg:col-span-2" variants={fadeLeft}>
                        <div className="md:pr-6 lg:pr-0">
                            <motion.div 
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6"
                                variants={fadeUp}
                            >
                                <Activity className="size-3" /> Vanguard Infrastructure
                            </motion.div>
                            
                            <h2 ref={headingRef} className="text-4xl font-display font-bold lg:text-6xl text-white leading-[1.1] mb-6">
                                <WordReveal text="Engineered for" inView={isHeadingInView} delay={0} />
                                <br />
                                <WordReveal 
                                    text="Exponential Wealth." 
                                    inView={isHeadingInView} 
                                    delay={0.3}
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_auto] animate-shimmer" 
                                    underline
                                />
                            </h2>

                            <motion.p 
                                className="mt-8 text-text-secondary text-lg leading-relaxed"
                                variants={fadeUp}
                            >
                                FinMind AI provides the architectural oversight needed for institutional-grade capital automation, ensuring your wealth scaling logic remains robust, secure, and purely under your control.
                            </motion.p>

                            <motion.div className="mt-10 flex flex-wrap gap-4" variants={fadeUp}>
                                <button className="px-6 py-3 bg-primary text-background rounded-full font-bold hover:scale-105 transition-transform">
                                    Launch Scaling Node
                                </button>
                                <button className="px-6 py-3 border border-border/50 text-white rounded-full font-medium hover:bg-white/5 transition-colors">
                                    Technical Specs
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Column (Vault Activity Table) */}
                    <motion.div className="lg:col-span-3 relative" variants={fadeUp}>
                        <div className="relative z-10">
                            <div className="rounded-[2rem] border-[10px] border-[#16161C] overflow-hidden bg-[#0A0A0F] relative shadow-inner h-[620px]">
                                <MockTableDashboard />
                            </div>
                        </div>
                        <div className="absolute -bottom-20 -right-20 size-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

function WordReveal({ text, className, inView, delay = 0, underline = false }: { text: string; className?: string; inView: boolean; delay?: number; underline?: boolean }) {
    const words = text.split(' ')
    return (
        <>
            {words.map((word, i) => (
                <span key={i} className="inline-block relative mr-[0.25em]">
                    <motion.span
                        className={cn('inline-block py-1', className)}
                        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(8px)' }}
                        transition={{
                            duration: 0.8,
                            delay: delay + i * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        {word}
                    </motion.span>
                    {underline && (
                        <motion.div 
                            className="absolute bottom-0 left-0 h-[2px] bg-primary/40"
                            initial={{ width: 0 }}
                            animate={inView ? { width: '100%' } : { width: 0 }}
                            transition={{ duration: 1, delay: delay + 0.6, ease: "circOut" }}
                        />
                    )}
                </span>
            ))}
        </>
    )
}

function MockTableDashboard() {
    return (
        <div className="p-8 h-full flex flex-col bg-[#050505] text-white font-sans">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-3xl font-display font-medium tracking-tight">Vault Activity</h3>
                    <p className="text-text-secondary text-sm">Manage your capital indexing.</p>
                </div>
                <div className="flex gap-3">
                    <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <MoreHorizontal className="size-5 text-text-secondary" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 gap-3">
                    <Search className="size-4 text-text-secondary" />
                    <span className="text-text-secondary/50 text-sm">Filter sources...</span>
                </div>
                <div className="h-12 px-5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-sm font-medium">
                    Columns <ChevronDown className="size-4" />
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-3 sm:grid-cols-4 pb-4 border-b border-white/5 text-[10px] sm:text-xs uppercase tracking-widest text-text-secondary/50 font-bold">
                    <div>Status</div>
                    <div>Source</div>
                    <div className="text-right sm:text-right">Amount</div>
                    <div className="hidden sm:block text-right pr-4">Node</div>
                </div>
                
                <div className="divide-y divide-white/5">
                    {[
                        { status: 'Success', source: 'vault_alpha_main@finmind.ai', amount: '+$1,240', color: 'bg-green-500' },
                        { status: 'Success', source: 'inst_node_b@capital.vanguard', amount: '+$2,842', color: 'bg-green-500' },
                        { status: 'Processing', source: 'gemini_stream_idx@indexing.ai', amount: '+$1.8k', color: 'bg-primary' },
                        { status: 'Success', source: 'liquidity_pool_c@uniswap.v3', amount: '+$631.45', color: 'bg-green-500' },
                        { status: 'Failed', source: 'legacy_sync@old_vault.com', amount: '--', color: 'bg-red-500' },
                    ].map((row, i) => (
                        <motion.div 
                            key={i} 
                            className="grid grid-cols-3 sm:grid-cols-4 py-4 sm:py-6 items-center hover:bg-white/[0.02] transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`size-1.5 sm:size-2 rounded-full ${row.color}`} />
                                <span className="text-[11px] sm:text-sm font-medium">{row.status}</span>
                            </div>
                            <div className="text-[11px] sm:text-sm text-text-secondary font-mono truncate">{row.source}</div>
                            <div className={`text-right text-[11px] sm:text-sm font-bold ${row.amount.includes('+') ? 'text-green-400' : 'text-text-secondary'}`}>{row.amount}</div>
                            <div className="hidden sm:flex justify-end pr-4">
                                <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                    <ChevronRight className="size-4 text-text-secondary" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                <div className="flex gap-2">
                    <div className="size-8 rounded-lg border border-white/10 flex items-center justify-center opacity-50"><ChevronLeft className="size-4" /></div>
                    <div className="size-8 rounded-lg border border-white/10 flex items-center justify-center bg-white/5"><ChevronRight className="size-4" /></div>
                </div>
                <div className="text-xs text-text-secondary/50 uppercase tracking-tighter">Page 1 of 12 — Global Cluster</div>
            </div>
        </div>
    )
}
