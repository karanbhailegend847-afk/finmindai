import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Sparkles, LayoutDashboard, MessageSquare, Terminal } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const Platform = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <PageWrapper>
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <img src="/logo.png" className="w-4 h-4 object-contain" /> The Engine of Finance
          </motion.div>
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeUp}
            className="font-display font-black text-5xl md:text-7xl mb-8 tracking-tighter"
          >
            Intelligence.<br />
            <span className="text-primary">Engineered.</span>
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            FinMind AI isn't just a tracker. It's an autonomous nervous system for your capital, powered by Gemini 1.5 Pro.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Conversational Intelligence</h3>
                <p className="text-text-secondary">Talk to your money. Ask about burn rates, investment velocity, or budget leakage in natural language.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-400 shrink-0">
                <Terminal size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Immutable Ledger</h3>
                <p className="text-text-secondary">Every cent is accounted for in a cryptographically inspired, high-performance ledger stored on Firestore.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Instant Refills</h3>
                <p className="text-text-secondary">Premium users receive automated credit refills every 24 hours, ensuring continuous AI access.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-surface to-background border border-border/60 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <LayoutDashboard size={120} />
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary" />
              <div className="bg-elevated p-3 rounded-2xl rounded-tl-sm text-sm border border-border max-w-[80%]">
                 You spent $1,200 on cloud services this month. That's 20% higher than your 3-month average. Would you like me to analyze the invoices?
              </div>
            </div>
            <div className="bg-background/50 border border-white/5 rounded-xl p-4 font-mono text-xs text-primary/70">
              {">"} Analysing spending velocity...<br />
              {">"} Detection high burn rate in "Infrastructure"<br />
              {">"} Optimization strategy ready.
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Platform;
