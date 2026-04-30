import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Newspaper, TrendingUp, Calendar, ArrowRight, ShieldCheck, Zap, BarChart3, Mail } from "lucide-react";

interface SectionWithMockupProps {
    title: string | React.ReactNode;
    description: string | React.ReactNode;
    primaryImageSrc?: string;
    secondaryImageSrc?: string;
    reverseLayout?: boolean;
}

// --- CHAR REVEAL: Ethereal blur-to-focus character animation ---
const CharReveal = ({ text, className, inView, baseDelay = 0 }: { text: string; className?: string; inView: boolean; baseDelay?: number }) => {
    const characters = text.split("");
    return (
        <span className={className}>
            {characters.map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: "blur(10px)", y: 10, letterSpacing: "0.2em" }}
                    animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0, letterSpacing: "0em" } : { opacity: 0, filter: "blur(10px)", y: 10, letterSpacing: "0.2em" }}
                    transition={{
                        duration: 0.8,
                        delay: baseDelay + i * 0.03,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
};

const SectionWithMockup: React.FC<SectionWithMockupProps> = ({
    title,
    description,
    reverseLayout = false,
}) => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
        }
    };

    const imageOrderClass = reverseLayout ? 'md:order-1' : 'md:order-2';
    const textOrderClass = reverseLayout ? 'md:order-2' : 'md:order-1';

    return (
        <section ref={sectionRef} className="py-24 md:py-40 px-6 bg-background relative overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute top-1/2 ${reverseLayout ? 'right-0' : 'left-0'} -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none`} />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {/* Text Content */}
                    <motion.div className={`${textOrderClass} flex flex-col items-start`}>
                        <div className="flex flex-col gap-4 mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest self-start">
                                ✦ Gemini Pro Delivery ✦
                            </div>
                            {/* --- CHARACTER BLUR REVEAL HEADING --- */}
                            <h2 className="text-white text-4xl md:text-[50px] font-display font-bold leading-tight md:leading-[60px] tracking-tighter text-left">
                                <CharReveal text="Intelligence," inView={isInView} baseDelay={0} />
                                <br />
                                <CharReveal text="delivered to you." inView={isInView} baseDelay={0.4} className="text-primary" />
                            </h2>
                        </div>

                        <p className="text-text-secondary text-lg leading-relaxed mt-4 text-left max-w-lg">
                            {description}
                        </p>

                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                            <div className="flex gap-4">
                                <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                    <Newspaper className="size-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Actionable Reports</h4>
                                    <p className="text-text-secondary text-xs mt-1">Directly to your inbox.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="size-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Private & Secure</h4>
                                    <p className="text-text-secondary text-xs mt-1">Encrypted delivery node.</p>
                                </div>
                            </div>
                        </div>

                        <button className="mt-12 flex items-center gap-2 text-white font-bold hover:text-primary transition-colors group">
                            Configure Delivery Master <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    {/* App mockup Content */}
                    <motion.div
                        className={`relative mt-10 md:mt-0 mx-auto ${imageOrderClass} w-full max-w-[300px] md:max-w-[500px]`}
                        variants={itemVariants}
                    >
                        {/* Decorative Background Element (Pure Code) */}
                        <motion.div
                             className={`absolute w-[300px] h-[317px] md:w-[472px] md:h-[500px] bg-[#090909] rounded-[48px] z-0 overflow-hidden border border-border/30 shadow-2xl`}
                             style={{
                                top: reverseLayout ? 'auto' : '10%',
                                bottom: reverseLayout ? '10%' : 'auto',
                                [reverseLayout ? 'right' : 'left']: '5%'
                             }}
                             initial={{ opacity: 0, scale: 0.8 }}
                             animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        />

                        {/* Newsletter Preview UI */}
                        <div className="relative z-10 bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl">
                             <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center"><Mail className="size-4 text-primary" /></div>
                                    <span className="text-xs font-bold tracking-widest uppercase opacity-40">Weekly Intelligence</span>
                                </div>
                                <div className="size-3 rounded-full bg-green-500" />
                             </div>

                             <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="h-6 w-3/4 bg-white/10 rounded" />
                                    <div className="h-4 w-full bg-white/5 rounded" />
                                    <div className="h-4 w-5/6 bg-white/5 rounded" />
                                </div>
                                
                                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h5 className="text-sm font-bold text-primary">PORTFOLIO SHIFT ALERT</h5>
                                        <TrendingUp className="size-4 text-primary" />
                                    </div>
                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        The AI model has detected a +12.4% liquidity squeeze in your Vanguard Node. Recommend reallocation to Delta-Neutral strategy B.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1 h-10 bg-primary rounded-xl" />
                                    <div className="flex-1 h-10 border border-white/10 rounded-xl" />
                                </div>
                             </div>

                             <div className="mt-8 flex justify-center">
                                <div className="px-4 py-2 bg-white/5 rounded-full flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-primary" />
                                    <span className="text-[10px] font-bold opacity-30 tracking-widest uppercase text-white">Gemini 1.5 Pro Analysis Completed</span>
                                </div>
                             </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default SectionWithMockup;
