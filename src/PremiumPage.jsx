import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Shield, Zap, Star, ArrowLeft, Crown, Sparkles, Coins, BarChart3, MessageSquare } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const PremiumPage = () => {
  const { user, userData, buyPremium } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Configuration - Plan details
  const PLAN_PRICE = 200; // Amount in INR
  const RAZORPAY_KEY_ID = "rzp_live_Satm4gnMnwdY91";

  const handlePayment = async () => {
    if (!user) {
        alert("Please login to continue.");
        return;
    }
    
    setLoading(true);

    try {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: PLAN_PRICE * 100, // Razorpay expects paise (INR * 100)
        currency: "INR",
        name: "FinMind AI",
        description: "Premium Monthly Subscription",
        image: "/logo.png",
        handler: async function (response) {
          console.log("Payment Successful:", response.razorpay_payment_id);
          
          // Call the upgrade function in Firestore
          const success = await buyPremium();
          if (success) {
            alert("Welcome to Premium! Your account has been upgraded.");
            navigate('/dashboard');
          } else {
            alert("Something went wrong during the upgrade. Please contact support.");
          }
        },
        prefill: {
          name: user.displayName || "User",
          email: user.email || "",
          contact: ""
        },
        theme: {
          color: "#7b5cf0"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initialize payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Zap className="text-amber-400" />, title: "Daily Credits Refill", desc: "Get 50 credits every 24 hours automatically." },
    { icon: <MessageSquare className="text-primary" />, title: "CFO-Level Intelligence", desc: "Access the full power of Gemini 2.5 Flash for deep financial advice." },
    { icon: <BarChart3 className="text-emerald-400" />, title: "Advanced Analytics", desc: "Unlock deep-dive reports and spending velocity charts." },
    { icon: <Shield className="text-sky-400" />, title: "Priority Processing", desc: "Your queries are handled by dedicated high-speed AI clusters." },
    { icon: <Crown className="text-amber-500" />, title: "Exclusive Badge", desc: "Show your status with a premium crown icon on your profile." },
    { icon: <Star className="text-violet-400" />, title: "Early Access", desc: "Be the first to test new AI models and financial tools." }
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary/30">
      {/* Background Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />
      </div>

      <nav className="relative z-10 px-6 py-6 border-b border-border/50 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
            FinMind <span className="text-primary font-black uppercase text-xs tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Premium</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <img src="/logo.png" className="w-4 h-4 object-contain" /> The Future of Financial Intelligence
          </motion.div>
          <h1 className="font-display font-black text-5xl md:text-7xl mb-6 tracking-tight">
            Level up your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">Wealth Strategy.</span>
          </h1>
          <p className="text-text-secondary text-xl max-w-2xl mx-auto">
            Upgrade to FinMind Premium for superior AI insights, daily credit refills, and advanced financial engineering tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-surface/30 border border-border/50 hover:border-primary/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Pricing Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md bg-gradient-to-b from-surface to-background border border-primary/30 rounded-[2.5rem] p-1 shadow-[0_0_50px_rgba(123,92,240,0.15)] relative">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                
                <div className="bg-surface/80 backdrop-blur-2xl rounded-[2.3rem] p-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <Crown size={120} />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">Monthly Access</h2>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-black text-white">₹{PLAN_PRICE}</span>
                            <span className="text-text-secondary font-medium">/ month</span>
                        </div>

                        <div className="space-y-4 mb-10">
                            <div className="flex items-center gap-3 text-sm">
                                <Check size={18} className="text-primary shrink-0" />
                                <span>No monthly subscriptions, pay once.</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Check size={18} className="text-primary shrink-0" />
                                <span>Includes all future AI model updates.</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-text-secondary">
                                <Check size={18} className="text-primary shrink-0" />
                                <span>Secure payments via Razorpay.</span>
                            </div>
                        </div>

                        <button 
                            onClick={handlePayment}
                            disabled={loading || userData?.isPremium}
                            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3
                                ${userData?.isPremium 
                                    ? 'bg-success/10 text-success border border-success/20 cursor-default'
                                    : 'bg-primary hover:bg-violet-600 text-white shadow-[0_0_30px_rgba(123,92,240,0.4)] hover:shadow-[0_0_40px_rgba(123,92,240,0.6)] active:scale-95'
                                }`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : userData?.isPremium ? (
                                <>
                                    <Crown size={20} />
                                    <span>Already Premium</span>
                                </>
                            ) : (
                                <>
                                    <span>Upgrade Now</span>
                                    <Zap size={20} />
                                </>
                            )}
                        </button>

                        <p className="text-center mt-6 text-[10px] text-text-secondary/50 uppercase tracking-widest font-bold">
                            Secured by 256-bit encryption
                        </p>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>

        {/* Brand Banner */}
        <div className="mt-32 p-12 rounded-[3rem] bg-gradient-to-r from-primary/5 via-violet-600/5 to-primary/5 border border-border/40 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Growth Focused</span>
                <h3 className="text-3xl font-bold">Join 50,000+ elite users.</h3>
            </div>
            <div className="flex -space-x-4">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-surface flex items-center justify-center font-bold text-xs">
                        {String.fromCharCode(64 + i)}
                    </div>
                ))}
                <div className="w-12 h-12 rounded-full border-2 border-background bg-primary flex items-center justify-center font-bold text-xs text-white">
                    +49k
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default PremiumPage;
