import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Crown, ArrowLeft, LogOut, ExternalLink, CreditCard, Clock } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const AccountPage = () => {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Background Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 px-6 py-6 border-b border-border/50 backdrop-blur-md sticky top-0 bg-background/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Dashboard</span>
          </button>
          <h1 className="font-display font-bold text-lg">Account Settings</h1>
          <div className="w-[100px]" /> {/* Spacer */}
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar Info */}
          <div className="md:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[2.5rem] bg-surface/30 border border-border/50 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center p-1 mb-4 shadow-xl shadow-primary/20">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>
              <h2 className="font-bold text-xl truncate w-full">{user.displayName || 'FinMind User'}</h2>
              <p className="text-text-secondary text-xs truncate w-full mb-6">{user.email}</p>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </motion.div>

            <div className="p-6 rounded-[2rem] bg-surface/20 border border-border/30">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Security</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                        <Shield size={16} className="text-emerald-400" />
                        <span>Account Verified</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Subscription Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 rounded-[2.5rem] bg-gradient-to-br from-surface to-background border border-primary/20 relative overflow-hidden"
            >
              {userData?.isPremium && (
                <div className="absolute top-6 right-6">
                  <Crown className="text-amber-500 animate-pulse" size={32} />
                </div>
              )}

              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 font-display">Plan Details</h3>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-black">{userData?.isPremium ? 'FinMind Premium' : 'FinMind Free'}</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${userData?.isPremium ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                    Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Billing Cycle</span>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-primary" />
                    <span className="text-sm font-bold">{userData?.isPremium ? 'Monthly' : 'N/A'}</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Next Bill</span>
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-primary" />
                    <span className="text-sm font-bold">
                        {userData?.premiumUntil 
                            ? new Date(userData.premiumUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : (userData?.isPremium ? 'Processing...' : 'N/A')
                        }
                    </span>
                  </div>
                </div>
              </div>

              {!userData?.isPremium ? (
                <button 
                  onClick={() => navigate('/premium')}
                  className="w-full py-4 rounded-2xl bg-primary hover:bg-violet-600 text-white font-bold transition-all shadow-lg shadow-primary/20"
                >
                  Upgrade to Premium
                </button>
              ) : (
                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold cursor-not-allowed opacity-50">
                  Manage via Razorpay
                </button>
              )}
            </motion.div>

            {/* Profile Settings */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="p-8 rounded-[2.5rem] bg-surface/30 border border-border/50"
            >
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-6">Profile Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-text-secondary block mb-2 px-1">Full Name</label>
                  <div className="px-4 py-3 rounded-xl bg-background border border-border/50 text-sm flex items-center gap-3">
                    <User size={16} className="text-text-secondary" />
                    <span>{user.displayName || 'Not provided'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-text-secondary block mb-2 px-1">Email Address</label>
                  <div className="px-4 py-3 rounded-xl bg-background border border-border/50 text-sm flex items-center gap-3">
                    <Mail size={16} className="text-text-secondary" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span>Joined FinMind on {new Date(user.metadata.creationTime).toLocaleDateString()}</span>
                </div>
                <button className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                    Edit Profile <ExternalLink size={12} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
