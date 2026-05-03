import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, Zap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SubscriptionExpiryModal = () => {
  const { showExpirationModal, setShowExpirationModal, expiredPlanName } = useAuth();
  const navigate = useNavigate();

  if (!showExpirationModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowExpirationModal(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#0D0D12] border border-white/10 shadow-2xl"
        >
          {/* Accent Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
          
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <button 
                onClick={() => setShowExpirationModal(false)}
                className="p-2 rounded-full hover:bg-white/5 text-text-secondary/60 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">
              Plan Expired
            </h2>
            <p className="text-text-secondary leading-relaxed mb-8">
              Your <span className="text-white font-semibold capitalize">{expiredPlanName || 'Pro'}</span> subscription has come to an end. We've moved you back to the free tier for now.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                  <Zap className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">Limited Credits</div>
                  <div className="text-[13px] text-text-secondary/70">Daily credits reset to 20. Pro models are now locked.</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowExpirationModal(false)}
                className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowExpirationModal(false);
                  navigate('/pricing');
                }}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Renew Now
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="bg-white/[0.02] border-t border-white/5 p-4 text-center">
            <p className="text-[11px] text-text-secondary/40 font-medium tracking-wide uppercase">
              Secure payments powered by Razorpay
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionExpiryModal;
