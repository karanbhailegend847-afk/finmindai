import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export function SignInCard({ 
  isLogin, 
  setIsLogin, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  onSubmit, 
  onGoogleLogin, 
  loading, 
  error 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  // For 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center font-sans">
      {/* Background gradient effect - adapted to FinMind primary purple */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/40 to-black" />
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Top radial glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-primary/20 blur-[80px]" />
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-primary/10 blur-[60px]"
        animate={{ 
          opacity: [0.15, 0.3, 0.15],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10 p-4"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative group">
            {/* Traveling light beam effect */}
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none z-20">
                <motion.div 
                  className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                  animate={{ left: ["-50%", "100%"] }}
                  transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                />
                <motion.div 
                  className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                  animate={{ top: ["-50%", "100%"] }}
                  transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 0.6 }}
                />
            </div>

            {/* Glass card background */}
            <div className="relative bg-black/60 backdrop-blur-3xl rounded-2xl p-8 border border-white/[0.08] shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="text-center space-y-1 mb-8">
                  <motion.h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 tracking-tight">
                    {isLogin ? 'Access FinMind' : 'Join the Protocol'}
                  </motion.h1>
                  <p className="text-white/40 text-xs font-medium uppercase tracking-widest mt-2">
                    {isLogin ? 'Institutional Intelligence' : 'Begin Wealth Tracking'}
                  </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-3">
                    {/* Email input */}
                    <div className="relative">
                      <Mail className={cn(
                        "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                        focusedInput === "email" ? 'text-primary' : 'text-white/30'
                      )} />
                      <Input
                        type="email"
                        placeholder="Institutional Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/[0.03] border-white/10 focus:border-primary/50 text-white placeholder:text-white/20 h-11 pl-11 rounded-xl transition-all"
                      />
                    </div>

                    {/* Password input */}
                    <div className="relative">
                      <Lock className={cn(
                        "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                        focusedInput === "password" ? 'text-primary' : 'text-white/30'
                      )} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Security Passphrase"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/[0.03] border-white/10 focus:border-primary/50 text-white placeholder:text-white/20 h-11 pl-11 pr-11 rounded-xl transition-all"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                        <input
                          id="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                          className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-primary focus:ring-0 transition-all cursor-pointer"
                        />
                      <label htmlFor="remember-me" className="text-[10px] uppercase font-bold tracking-wider text-white/40 cursor-pointer hover:text-white/60 transition-colors">
                        Secure Session
                      </label>
                    </div>
                    {isLogin && (
                        <Link to="/forgot-password" size="sm" className="text-[10px] uppercase font-bold tracking-wider text-primary/70 hover:text-primary transition-colors">
                            Recover Key
                        </Link>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className="w-full relative group/button mt-6 h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(123,92,240,0.3)] hover:shadow-[0_0_30px_rgba(123,92,240,0.5)] transition-all overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        />
                      ) : (
                        <motion.div
                          key="text"
                          className="flex items-center gap-2"
                        >
                          <span>{isLogin ? 'Establish Connection' : 'Register Protocol'}</span>
                          <ArrowRight size={16} className="group-hover/button:translate-x-1 transition-transform" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <div className="relative py-4 flex items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="mx-3 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">External</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  <button
                    type="button"
                    onClick={onGoogleLogin}
                    className="w-full h-11 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-3 group"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Google Authorization</span>
                  </button>

                <p className="text-center text-[11px] text-white/40 mt-6 font-medium">
                  {isLogin ? "New to the engine?" : "Already registered?"}{' '}
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:text-primary-dim transition-colors font-bold uppercase tracking-wider ml-1"
                  >
                    {isLogin ? 'Create Account' : 'Sign In'}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
