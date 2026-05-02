import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Bot, ShieldCheck, LayoutDashboard, Zap } from 'lucide-react';
import { StaggerTestimonials } from './components/ui/stagger-testimonials';
import TestimonialsSection from './components/ui/testimonials-columns';
import FeatureSection from './components/ui/stack-feature-section';
import PageWrapper from './components/PageWrapper';

import { IdentityCardBody, RevealCardContainer } from './components/ui/animated-profile-card';
import { FeaturesScaling } from './components/ui/features-5';
import StockSimulationSection from './components/ui/stock-simulation-section';

import { LogosSlider } from './components/ui/logos-slider';

import FaqSection from './components/ui/faq-section';

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const features = [
    {
      fullName: "AI Intelligence",
      place: "Decision Core",
      about: "Powered by Gemini 2.5 Flash. Deep conversational intelligence for complex capital structures.",
      avatarUrl: "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?w=200&h=200&auto=format&fit=crop",
      avatarText: "AI",
      accent: "#f5f3ff", // Soft Purple
      textOnAccent: "#4c1d95",
      mutedOnAccent: "#7c3aed"
    },
    {
      fullName: "The Whiteboard",
      place: "Visual Strategy",
      about: "Organize your goals and financial vision on a persistent, high-fidelity glassmorphism board.",
      avatarUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501c27?w=200&h=200&auto=format&fit=crop",
      avatarText: "WB",
      accent: "#f5f3ff", // Soft Purple
      textOnAccent: "#4c1d95",
      mutedOnAccent: "#7c3aed"
    },
    {
      fullName: "Wealth Velocity",
      place: "Advanced Analytics",
      about: "Predictive modeling and deep-dive spending analysis for elite members.",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&auto=format&fit=crop",
      avatarText: "WV",
      accent: "#f5f3ff", // Soft Purple
      textOnAccent: "#4c1d95",
      mutedOnAccent: "#7c3aed"
    }
  ];

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
        <section className="min-h-[calc(85vh+80px)] -mt-[80px] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
          >
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay to keep text readable */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
          <motion.div 
            style={{ y }}
            initial="hidden" animate="visible" variants={staggerContainer}
            className="relative z-[2] max-w-5xl mx-auto flex flex-col items-center pt-10 md:pt-20"
          >
            <motion.div variants={fadeUp} className="mb-4 md:mb-8 px-4 py-1.5 rounded-pill border border-border/50 bg-surface/30 backdrop-blur-sm text-text-secondary text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 group cursor-pointer hover:border-primary/50 transition-colors">
              <span className="text-primary group-hover:animate-pulse">✦</span> Gemini 1.5 Pro Integrated
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="font-display font-black text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.2] sm:leading-[1.1] md:leading-[1] tracking-tighter mb-6 md:mb-8 drop-shadow-2xl px-4">
              Wealth tracking, <br className="hidden xs:block" />
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

            {/* --- SOCIAL PROOF --- */}
            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4">
              <div className="flex items-center -space-x-4">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop"
                ].map((url, i) => (
                  <img 
                    key={i} 
                    src={url} 
                    className="w-10 h-10 rounded-full border-2 border-background object-cover" 
                    alt="User"
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-text-secondary tracking-tight">
                Join over <span className="text-white font-bold">10,000+</span> people
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* --- DYNAMIC LOGO SLIDER --- */}
        <LogosSlider />

        {/* --- SCALING FEATURES (v5) --- */}
        <FeaturesScaling />

        {/* --- AI POWERED STOCK SIMULATION --- */}
        <StockSimulationSection />

        {/* --- TESTIMONIALS --- */}
        <TestimonialsSection />

        {/* --- GLOBAL ECOSYSTEM ORBIT --- */}
        <FeatureSection />

        {/* --- SEO FAQ SECTION --- */}
        <FaqSection />

      </main>
    </PageWrapper>
  );
};

export default LandingPage;

