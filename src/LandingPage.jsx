import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Wallet, Activity, Bot, ShieldCheck, Target, Zap, LayoutDashboard, Sparkles, LineChart, CircuitBoard } from 'lucide-react';
import { StaggerTestimonials } from './components/ui/stagger-testimonials';
import FooterSection from './components/ui/footer';
import NavHeader from './components/ui/nav-header';
import AppIcons from './components/ui/boxy-app-icons';

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
    <div className="min-h-screen bg-background text-text-primary overflow-hidden selection:bg-primary/30 selection:text-white">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none opacity-60 mix-blend-screen">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[1000px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar Minimal */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 w-full h-[80px] backdrop-blur-2xl border-b border-border z-50 flex items-center justify-between px-6 md:px-12"
      >
        <div className="font-display font-bold text-2xl tracking-tighter flex items-center gap-1.5 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shadow-[0_0_15px_rgba(123,92,240,0.5)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          FinMind
        </div>
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
          <NavHeader />
        </div>
        <div className="flex gap-4">
          <button className="hidden md:block px-6 py-2.5 rounded-btn border border-border text-text-secondary font-medium hover:border-primary hover:text-white transition-all duration-300">
            Sign In
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 rounded-btn bg-white text-black font-semibold hover:bg-primary hover:text-white hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(123,92,240,0.4)] transition-all duration-300"
          >
            Launch Web App
          </button>
        </div>
      </motion.nav>

      <main className="relative z-10 pt-[80px]">
        {/* --- HERO SECTION --- */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative">
          <motion.div 
            style={{ y }}
            initial="hidden" animate="visible" variants={staggerContainer}
            className="max-w-5xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="mb-8 px-4 py-1.5 rounded-pill border border-border/50 bg-surface/30 backdrop-blur-sm text-text-secondary text-xs font-bold uppercase tracking-widest flex items-center gap-2 group cursor-pointer hover:border-primary/50 transition-colors">
              <span className="text-primary group-hover:animate-pulse">✦</span> Gemini 1.5 Pro Integrated
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="font-display font-black text-5xl md:text-7xl leading-[1.1] tracking-tight mb-8 drop-shadow-2xl">
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
              <button className="px-10 py-5 rounded-xl bg-surface/50 backdrop-blur-md border border-border text-white font-semibold text-lg hover:bg-elevated transition-all duration-300 flex items-center justify-center gap-2">
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
            {/* Duplicated for smooth infinite scroll */}
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="flex items-center gap-4"><Sparkles className="w-6 h-6 text-primary/40"/> Expense Tracking</span>
                <span className="flex items-center gap-4"><Sparkles className="w-6 h-6 text-primary/40"/> AI Assistant</span>
                <span className="flex items-center gap-4"><Sparkles className="w-6 h-6 text-primary/40"/> Goal Planning</span>
                <span className="flex items-center gap-4"><Sparkles className="w-6 h-6 text-primary/40"/> Visual Reports</span>
                <span className="flex items-center gap-4"><Sparkles className="w-6 h-6 text-primary/40"/> Deep Insights</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* --- PREMIUM BENTO GRID --- */}
        <section id="bento" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="mb-20 text-center"
            >
              <h2 className="font-display font-bold text-5xl mb-6">Designed for Dominance</h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                A dark-mode architectural space engineered for total financial control. 
                Vast negative space. Precision data.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[800px]"
            >
              {/* Box 1: Large AI Focus */}
              <motion.div variants={fadeUp} className="md:col-span-2 bg-gradient-to-br from-surface to-background border border-border/60 rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/15 transition-colors duration-700" />
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 border border-primary/20 backdrop-blur-md">
                  <Bot size={32} />
                </div>
                <div className="relative z-10">
                  <h3 className="font-display font-bold text-4xl mb-4">Generative AI Intelligence</h3>
                  <p className="text-text-secondary text-lg max-w-md mb-8">
                    Query your finances in plain English. "How much did I spend on food this month?" Gemini analyzes the context and responds instantly.
                  </p>
                </div>
                {/* Mock UI snippet inside card */}
                <div className="relative z-10 w-full max-w-lg bg-background border border-border rounded-xl p-5 shadow-2xl mt-auto">
                  <div className="flex gap-4 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0" />
                    <div className="bg-elevated p-3 rounded-2xl rounded-tl-sm text-sm border border-border">
                      <p>You spent $450 on food this week, which is 15% under your budget target. Great job scaling back on dining out.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Box 2: Secure Ledger */}
              <motion.div variants={fadeUp} className="bg-surface/50 border border-border/60 rounded-3xl p-10 flex flex-col relative overflow-hidden group hover:border-primary/40 transition-colors">
                 <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-8 border border-white/10">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-4">Ironclad Ledger</h3>
                <p className="text-text-secondary flex-1">
                  Categorized transactions locked in an immutable store view. Complete clarity on every outgoing cent.
                </p>
                
                {/* Abstract visual */}
                <div className="w-full h-32 mt-8 flex flex-col gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="h-4 w-full bg-elevated rounded-full overflow-hidden flex">
                    <div className="h-full bg-success w-[40%]" />
                    <div className="h-full bg-primary w-[30%]" />
                    <div className="h-full bg-danger w-[15%]" />
                  </div>
                  <div className="h-12 w-full border border-border rounded-lg bg-background flex items-center px-4 justify-between">
                     <div className="w-1/2 h-2 bg-elevated rounded-full" />
                     <div className="w-1/4 h-2 bg-success rounded-full" />
                  </div>
                </div>
              </motion.div>

              {/* Box 3: Dashboard Layout */}
              <motion.div variants={fadeUp} className="bg-surface/50 border border-border/60 rounded-3xl p-10 flex flex-col justify-center items-center text-center group hover:border-primary/40 transition-colors">
                <LayoutDashboard size={48} className="text-primary/50 mb-6 group-hover:text-primary transition-colors" />
                <h3 className="font-display font-bold text-2xl mb-4">Precision Dashboard</h3>
                <p className="text-text-secondary">
                  Dark-mode UI engineered for high-visibility. 16px border-radius, intent-driven typography, and zero clutter. 
                </p>
              </motion.div>

              {/* Box 4: Velocity & Analytics */}
              <motion.div variants={fadeUp} className="md:col-span-2 bg-gradient-to-tr from-surface via-background to-surface border border-border/60 rounded-3xl p-10 relative overflow-hidden group hover:border-primary/40 transition-colors">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                  <div className="flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-8 border border-white/10">
                      <Zap size={28} />
                    </div>
                    <h3 className="font-display font-bold text-3xl mb-4">Velocity Analytics</h3>
                    <p className="text-text-secondary text-lg">
                      Track spending velocity over time with stunning Recharts visualizers. Identify burn rates before you hit maximum limits.
                    </p>
                  </div>
                  <div className="flex-1 w-full bg-elevated/40 border border-border/50 rounded-2xl p-6 h-[200px] flex items-end gap-2 relative">
                    <div className="absolute top-4 left-6 font-mono text-xl font-bold text-white">$14,200.00</div>
                    {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`flex-1 rounded-t-sm ${i === 6 ? 'bg-primary' : 'bg-primary/20'}`} 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- PREMIUM REVIEWS --- */}
        <section className="py-32 px-6 border-t border-border/30 bg-gradient-to-b from-background to-surface/20 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="mb-20 text-center"
            >
              <h2 className="font-display font-bold text-5xl mb-6">Trusted by Vanguard Builders</h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Discover why executives, founders, and engineers are migrating their capital structures to FinMind AI.
              </p>
            </motion.div>

            <StaggerTestimonials />
          </div>
        </section>

        {/* --- SOCIAL INTEGRATION --- */}
        <section className="py-32 px-6 bg-background relative overflow-hidden">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="mb-20 text-center"
            >
              <h2 className="font-display font-bold text-5xl mb-6">Connect Your Ecosystem</h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Seamlessly interact with your data across our entire social network.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="flex justify-center w-full"
            >
              <AppIcons />
            </motion.div>
          </div>
        </section>

        {/* --- CLOSING TAGLINE --- */}
        <section className="py-48 px-6 relative flex justify-center items-center overflow-hidden border-t border-border/20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-[100%] blur-[120px] pointer-events-none" />
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { duration: 1.5, ease: "easeOut" } }
            }}
            className="text-center relative z-10 w-full"
          >
            <h2 className="font-display font-black text-6xl md:text-9xl tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-text-secondary/50 to-background opacity-80 leading-[0.85] pb-4">
              Capital.<br />
              <span className="text-primary/70">Engineered.</span>
            </h2>
          </motion.div>
        </section>

        {/* --- LUXURY FOOTER --- */}
        <FooterSection />
      </main>
    </div>
  );
};

export default LandingPage;
