import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Sparkles, LayoutDashboard, MessageSquare, Terminal } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import IntegrationsSection from '../components/ui/integrations-section';

const Platform = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <PageWrapper>
      <main className="relative min-h-[80vh]">
        {/* --- GLOBAL CONNECTIVITY HUB --- */}
        <IntegrationsSection />
        
        {/* Bottom Page Glow for Footer Transition */}
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-full h-96 bg-primary/20 blur-[150px] -z-10 rounded-full opacity-50" />
      </main>
    </PageWrapper>
  );
};

export default Platform;
