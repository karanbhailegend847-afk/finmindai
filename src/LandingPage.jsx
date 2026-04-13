import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Bot, ShieldCheck, LayoutDashboard, Zap } from 'lucide-react';
import { StaggerTestimonials } from './components/ui/stagger-testimonials';
import AppIcons from './components/ui/boxy-app-icons';
import PageWrapper from './components/PageWrapper';

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <PageWrapper>
      <main className="relative z-10 pt-10">
        {/* --- HERO SECTION --- */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 relative">
          <motion.div 
            style={{ y }}
            initial="hidden" animate="visible" variants={staggerContainer}
            className="max-w-5xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="mb-8 px-4 py-1.5 rounded-pill border border-border/50 bg-surface/30 backdrop-blur-sm text-text-secondary text-xs font-bold uppercase tracking-widest flex items-center gap-2 group cursor-pointer hover:border-primary/50 transition-colors">
              <span className="text-primary group-hover:animate-pulse">✦</span> Gemini 1.5 Pro Integrated
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="font-display font-black text-5xl md:text-8xl leading-[1] tracking-tighter mb-8 drop-shadow-2xl">
              Wealth tracking, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-primary-dim">reimagined.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="font-body text-xl md:text-2xl text-text-secondary max-w-3xl mb-12 leading-relaxed">
              Experience the pinnacle of personal finance. FinMind organizes your capital structure and provides conversational AI intelligence instantly.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-10 py-5 rounded-xl bg-gradient-to-b from-primary to-primary-dim text-white font-bold text-lg hover:scale-[1.02] shadow-[0_0_40px_rgba(123,92,240,0.3)] border border-primary/50 hover:shadow-[0_0_60px_rgba(123,92,240,0.5)] transition-all duration-300"
              >
                Access Dashboard
              </button>
              <button 
                onClick={() => navigate('/platform')}
                className="px-10 py-5 rounded-xl bg-surface/50 backdrop-blur-md border border-border text-white font-semibold text-lg hover:bg-elevated transition-all duration-300 flex items-center justify-center gap-2"
              >
                Explore Platform <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* --- INFINITE TICKER --- */}
        <div className="w-full border-y border-border/50 bg-background/50 backdrop-blur-sm py-6 overflow-hidden flex relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            className="flex whitespace-nowrap gap-16 font-display font-bold text-2xl text-text-secondary/30 uppercase tracking-wider"
          >
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="flex items-center gap-4"><img src="/logo.png" className="w-6 h-6 object-contain rounded-md opacity-50 grayscale hover:grayscale-0 transition-all"/> Expense Tracking</span>
                <span className="flex items-center gap-4"><img src="/logo.png" className="w-6 h-6 object-contain rounded-md opacity-50 grayscale hover:grayscale-0 transition-all"/> AI Assistant</span>
                <span className="flex items-center gap-4"><img src="/logo.png" className="w-6 h-6 object-contain rounded-md opacity-50 grayscale hover:grayscale-0 transition-all"/> Goal Planning</span>
                <span className="flex items-center gap-4"><img src="/logo.png" className="w-6 h-6 object-contain rounded-md opacity-50 grayscale hover:grayscale-0 transition-all"/> Visual Reports</span>
                <span className="flex items-center gap-4"><img src="/logo.png" className="w-6 h-6 object-contain rounded-md opacity-50 grayscale hover:grayscale-0 transition-all"/> Deep Insights</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* --- PREMIUM BENTO GRID --- */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="mb-20 text-center"
            >
              <h2 className="font-display font-bold text-5xl mb-6">Designed for Dominance</h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                A dark-mode architectural space engineered for total financial control. 
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6"
            >
              <motion.div variants={fadeUp} className="md:col-span-2 bg-gradient-to-br from-surface to-background border border-border/60 rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/platform')}>
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 border border-primary/20 backdrop-blur-md">
                  <Bot size={32} />
                </div>
                <div className="relative z-10">
                  <h3 className="font-display font-bold text-4xl mb-4">Generative AI Intelligence</h3>
                  <p className="text-text-secondary text-lg max-w-md mb-8">
                    Query your finances in plain English. Gemini analyzes the context and responds instantly.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-surface/50 border border-border/60 rounded-3xl p-10 flex flex-col relative overflow-hidden group hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/features')}>
                 <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-8 border border-white/10">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-4">Ironclad Ledger</h3>
                <p className="text-text-secondary">Complete clarity on every outgoing cent with categorised transactions.</p>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-surface/50 border border-border/60 rounded-3xl p-10 flex flex-col justify-center items-center text-center group hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>
                <LayoutDashboard size={48} className="text-primary/50 mb-6 group-hover:text-primary transition-colors" />
                <h3 className="font-display font-bold text-2xl mb-4">Precision Dashboard</h3>
              </motion.div>

              <motion.div variants={fadeUp} className="md:col-span-2 bg-gradient-to-tr from-surface via-background to-surface border border-border/60 rounded-3xl p-10 relative overflow-hidden group hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/features')}>
                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                  <div className="flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-8 border border-white/10">
                      <Zap size={28} />
                    </div>
                    <h3 className="font-display font-bold text-3xl mb-4">Velocity Analytics</h3>
                    <p className="text-text-secondary text-lg">Track spending velocity over time with stunning Recharts visualizers.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- PREMIUM REVIEWS --- */}
        <section className="py-32 px-6 border-t border-border/30 bg-gradient-to-b from-background to-surface/20 relative">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display font-bold text-5xl mb-12 text-center">Trusted by Vanguard Builders</h2>
            <StaggerTestimonials />
          </div>
        </section>

        {/* --- SOCIAL INTEGRATION --- */}
        <section className="py-32 px-6 bg-background relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h2 className="font-display font-bold text-5xl mb-12">Connect Your Ecosystem</h2>
            <div className="flex justify-center w-full">
              <AppIcons />
            </div>
          </div>
        </section>

        {/* --- CLOSING TAGLINE --- */}
        <section className="py-48 px-6 relative flex justify-center items-center overflow-hidden border-t border-border/20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-[100%] blur-[120px] pointer-events-none" />
          <motion.div className="text-center relative z-10 w-full">
            <h2 className="font-display font-black text-6xl md:text-9xl tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-text-secondary/50 to-background opacity-80 leading-[0.85] pb-4">
              Capital.<br />
              <span className="text-primary/70">Engineered.</span>
            </h2>
          </motion.div>
        </section>
      </main>
    </PageWrapper>
  );
};

export default LandingPage;

