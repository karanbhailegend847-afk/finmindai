import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NavHeader from './ui/nav-header';
import FooterSection from './ui/footer';

const PageWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        className="fixed top-0 w-full h-[70px] md:h-[80px] backdrop-blur-2xl border-b border-border/50 z-50 flex items-center justify-between px-4 md:px-12"
      >
        <div 
          onClick={() => navigate('/')}
          className="font-display font-bold text-xl md:text-2xl tracking-tighter flex items-center gap-2 cursor-pointer group"
        >
          <img src="/logo.png" alt="FinMind Logo" className="w-7 h-7 md:w-8 md:h-8 object-contain rounded-lg shadow-[0_0_15px_rgba(123,92,240,0.4)] group-hover:scale-110 transition-transform" />
          <span className="hidden xs:block">FinMind</span>
        </div>
        
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
          <NavHeader />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex gap-2">
            {!user ? (
              <button 
                onClick={() => navigate('/auth')}
                className="hidden sm:block px-4 py-2 rounded-btn border border-border text-text-secondary font-medium hover:border-primary hover:text-white transition-all duration-300 text-xs md:text-sm"
              >
                Sign In
              </button>
            ) : null}
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-3 md:px-6 py-2 md:py-2.5 rounded-btn bg-white text-black font-semibold hover:bg-primary hover:text-white hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(123,92,240,0.4)] transition-all duration-300 flex items-center gap-1.5 md:gap-2 text-[10px] xs:text-xs md:text-sm whitespace-nowrap"
            >
              {user ? <LayoutDashboard size={14} className="md:w-4 md:h-4" /> : null}
              {user ? (window.innerWidth < 400 ? 'Dashboard' : 'Dashboard') : 'Launch'}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 text-white/70 hover:text-white transition-colors border border-white/5"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[280px] bg-[#0D0D12] border-l border-white/5 z-[70] lg:hidden flex flex-col"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                  <span className="font-display font-bold text-xl tracking-tighter">FinMind<span className="text-primary">AI</span></span>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 text-text-secondary"><X size={20} /></button>
                </div>

                <div className="flex flex-col gap-6 flex-1">
                  {[
                    { label: 'Platform', path: '/platform' },
                    { label: 'Features', path: '/features' },
                    { label: 'Vision', path: '/vision' },
                    { label: 'Pricing', path: '/pricing' },
                  ].map((link) => (
                    <button
                      key={link.path}
                      onClick={() => {
                        navigate(link.path);
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-lg font-bold text-text-secondary hover:text-white transition-colors flex items-center justify-between group"
                    >
                      {link.label}
                      <Sparkles size={16} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                    </button>
                  ))}
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-white/5">
                  {!user ? (
                    <button 
                      onClick={() => {
                        navigate('/auth');
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-4 rounded-2xl border border-white/5 bg-white/5 text-white font-bold"
                    >
                      Sign In
                    </button>
                  ) : null}
                  <button 
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-4 rounded-2xl bg-primary text-white font-bold shadow-[0_0_30px_rgba(123,92,240,0.3)]"
                  >
                    {user ? 'Go to Dashboard' : 'Launch Web App'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-[80px] min-h-[calc(100vh-80px)]">
        {children}
      </main>

      <FooterSection />
    </div>
  );
};

export default PageWrapper;
