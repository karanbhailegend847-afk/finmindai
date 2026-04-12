import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, LineChart, Target, Layers, Activity } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const Features = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const featureCards = [
    { icon: <Activity className="text-primary" />, title: "Velocity Analytics", desc: "Track how fast your capital moves. Real-time burn rate detection and spending momentum charts." },
    { icon: <ShieldCheck className="text-emerald-400" />, title: "Ironclad Security", desc: "Financial data is isolation-guarded and encrypted with top-tier Firebase security protocols." },
    { icon: <LineChart className="text-sky-400" />, title: "Predictive Forecasting", desc: "Machine learning models anticipate upcoming subscription renewals and hidden costs." },
    { icon: <Target className="text-amber-400" />, title: "Contextual Budgeting", desc: "Budgets that learn. FinMind adjusts your targets based on spending quality, not just quantity." },
    { icon: <Layers className="text-violet-400" />, title: "Multi-layered Tracking", desc: "Granular categorization from high-level capital structure down to individual tax-deductibles." },
    { icon: <Zap className="text-white" />, title: "Zero Latency UI", desc: "Built for speed. Instant search, fluid animations, and high-velocity data retrieval." }
  ];

  return (
    <PageWrapper>
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeUp}
            className="font-display font-black text-6xl md:text-8xl mb-6 tracking-tighter"
          >
            Power <br /><span className="text-primary">Features.</span>
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-xl text-text-secondary max-w-2xl mx-auto"
          >
            A high-performance toolkit designed for elite financial management. Zero clutter—just precision.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-[2rem] bg-surface/30 border border-border/50 hover:border-primary/40 transition-colors group cursor-default"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
              <p className="text-text-secondary leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
};

export default Features;
