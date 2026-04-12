import React from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRight, Sparkles, CircuitBoard } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const Vision = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <PageWrapper>
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8">
              <span className="animate-pulse">●</span> The Vision
            </div>
            <h1 className="font-display font-black text-6xl md:text-8xl mb-10 tracking-tighter leading-[0.9]">
              Future of <br /><span className="text-primary">Capital.</span>
            </h1>
            <p className="text-2xl text-text-secondary mb-12 leading-relaxed">
              We believe financial tracking shouldn't be a chore—it should be a masterpiece of design and intelligence. 
            </p>
            <div className="space-y-8">
              <div className="p-8 rounded-[2rem] bg-surface/30 border border-border/50">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <CircuitBoard className="text-primary" /> Autonomous Finance
                </h3>
                <p className="text-text-secondary">Our goal is to create an ecosystem where capital manages itself, optimized by AI, and governed by precision rules set by you.</p>
              </div>
            </div>
          </motion.div>

          <div className="relative">
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="aspect-square rounded-full border border-primary/20 flex items-center justify-center p-10 relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-primary/5 blur-[100px] animate-pulse" />
                <div className="text-center z-10">
                   <Target size={120} className="mx-auto text-primary mb-6" />
                   <h2 className="text-4xl font-black mb-2">$1B</h2>
                   <p className="text-text-secondary uppercase tracking-widest font-bold text-xs">AUM Managed by AI by 2030</p>
                </div>
             </motion.div>
          </div>
        </div>

        <div className="mt-40 text-center border-t border-border/30 pt-40 pb-20">
            <h2 className="font-display font-bold text-5xl md:text-7xl mb-10 tracking-tight">"Capital is no longer just money. It is code."</h2>
            <button className="px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-3 mx-auto">
                Join the Vanguard <ArrowRight size={20} />
            </button>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Vision;
