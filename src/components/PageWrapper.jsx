import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NavHeader from './ui/nav-header';
import FooterSection from './ui/footer';

const PageWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden selection:bg-primary/30 selection:text-white">
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
        className="fixed top-0 w-full h-[80px] backdrop-blur-2xl border-b border-border/50 z-50 flex items-center justify-between px-6 md:px-12"
      >
        <div 
          onClick={() => navigate('/')}
          className="font-display font-bold text-2xl tracking-tighter flex items-center gap-1.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shadow-[0_0_15px_rgba(123,92,240,0.5)] group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          FinMind
        </div>
        
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
          <NavHeader />
        </div>

        <div className="flex gap-4">
          {!user ? (
            <button 
              onClick={() => navigate('/auth')}
              className="px-5 py-2.5 rounded-btn border border-border text-text-secondary font-medium hover:border-primary hover:text-white transition-all duration-300"
            >
              Sign In
            </button>
          ) : null}
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 rounded-btn bg-white text-black font-semibold hover:bg-primary hover:text-white hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(123,92,240,0.4)] transition-all duration-300 flex items-center gap-2"
          >
            {user ? <LayoutDashboard size={18} /> : null}
            {user ? 'Go to Dashboard' : 'Launch Web App'}
          </button>
        </div>
      </motion.nav>

      <main className="relative z-10 pt-[80px] min-h-[calc(100vh-80px)]">
        {children}
      </main>

      <FooterSection />
    </div>
  );
};

export default PageWrapper;
