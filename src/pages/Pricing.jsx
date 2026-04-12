import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, Shield, Star, MessageSquare } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "0",
      desc: "For personal tracking",
      features: ["20 Monthly AI Credits", "Standard Ledger", "Basic Analytics", "Community Support"],
      btn: "Get Started",
      premium: false
    },
    {
      name: "Premium",
      price: "200",
      desc: "For elite intelligence",
      features: ["50 Daily Credit Refills", "Velocity Analytics", "Gemini 1.5 Pro Access", "Priority Support", "Exclusive Crown Badge", "Early Feature Access"],
      btn: "Upgrade Now",
      premium: true
    }
  ];

  return (
    <PageWrapper>
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Crown size={14} /> Transparent Value
          </motion.div>
          <h1 className="font-display font-black text-6xl md:text-8xl mb-8 tracking-tighter">
            Choose your <br /><span className="text-primary">Velocity.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-10 rounded-[2.5rem] border ${plan.premium ? 'bg-gradient-to-br from-surface to-background border-primary shadow-[0_0_50px_rgba(123,92,240,0.15)]' : 'bg-surface/30 border-border/50'} relative overflow-hidden`}
            >
              {plan.premium && (
                <div className="absolute top-8 right-8 text-primary">
                  <Crown size={32} />
                </div>
              )}
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black text-white">₹{plan.price}</span>
                <span className="text-text-secondary font-medium">{plan.premium ? '/ month' : '/ forever'}</span>
              </div>
              <p className="text-text-secondary mb-10">{plan.desc}</p>
              
              <div className="space-y-4 mb-12">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-primary" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => navigate(plan.premium ? '/premium' : '/auth')}
                className={`w-full py-5 rounded-2xl font-bold transition-all ${plan.premium ? 'bg-primary hover:bg-violet-600 text-white shadow-lg shadow-primary/20' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
              >
                {plan.btn}
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
};

export default Pricing;
