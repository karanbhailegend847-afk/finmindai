"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { ArrowRight, Globe, Shield, Zap, Wallet, Landmark, CreditCard } from "lucide-react";

const integrations = [
  { name: "Stripe", url: "https://cdn.simpleicons.org/stripe/635BFF", fallback: CreditCard },
  { name: "Visa", url: "https://cdn.simpleicons.org/visa/1A1F71", fallback: CreditCard },
  { name: "Mastercard", url: "https://cdn.simpleicons.org/mastercard/EB001B", fallback: CreditCard },
  { name: "PayPal", url: "https://cdn.simpleicons.org/paypal/003087", fallback: Wallet },
  { name: "Binance", url: "https://cdn.simpleicons.org/binance/F3BA2F", fallback: Wallet },
  { name: "Ethereum", url: "https://cdn.simpleicons.org/ethereum/3C3C3D", fallback: Zap },
  { name: "Coinbase", url: "https://cdn.simpleicons.org/coinbase/0052FF", fallback: Wallet },
  { name: "Robinhood", url: "https://cdn.simpleicons.org/robinhood/21CE99", fallback: Zap },
  { name: "MetaMask", url: "https://cdn.simpleicons.org/metamask/E2761B", fallback: Wallet },
  { name: "Plaid", url: "https://cdn.simpleicons.org/plaid/000000", fallback: Landmark },
  { name: "Amex", url: "https://cdn.simpleicons.org/americanexpress/0070D1", fallback: CreditCard },
  { name: "Bitcoin", url: "https://cdn.simpleicons.org/bitcoin/F7931A", fallback: Zap },
  { name: "Ledger", url: "https://cdn.simpleicons.org/ledger/000000", fallback: Shield },
  { name: "Wise", url: "https://cdn.simpleicons.org/wise/00B9FF", fallback: Globe },
  { name: "Revolut", url: "https://cdn.simpleicons.org/revolut/000000", fallback: CreditCard },
  { name: "Monzo", url: "https://cdn.simpleicons.org/monzo/FF4F52", fallback: CreditCard },
  { name: "Apple Pay", url: "https://cdn.simpleicons.org/applepay/000000", fallback: Wallet },
  { name: "Google Pay", url: "https://cdn.simpleicons.org/googlepay/4285F4", fallback: Wallet }
];

function IntegrationIcon({ item }) {
  const [error, setError] = React.useState(false);
  const FallbackIcon = item.fallback;

  return (
    <div
      className="relative w-full aspect-square p-2 md:p-3 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-sm border border-white/10 transition-all duration-300 flex items-center justify-center cursor-pointer group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(123,92,240,0.2)]"
      style={{
        clipPath:
          "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
      }}
    >
      {!error ? (
        <img
          src={item.url}
          alt={item.name}
          onError={() => setError(true)}
          className="w-7 h-7 md:w-9 md:h-9 object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
        />
      ) : (
        <FallbackIcon className="w-7 h-7 md:w-9 md:h-9 text-white/10 group-hover:text-primary transition-colors" />
      )}
    </div>
  );
}

export default function IntegrationsSection() {
  return (
    <section className="relative w-full bg-background pt-24 pb-32 overflow-hidden border-t border-white/5">
      {/* Visual Depth Gradients */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-background via-primary/5 to-transparent z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Content (Spans 5 cols) */}
          <motion.div
             className="lg:col-span-5"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="uppercase text-[10px] font-black text-primary tracking-[0.3em]">
                Global Connectivity
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter text-white mb-8 leading-[0.95]">
              Unified <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary">
                 Ecosystem.
              </span>
            </h2>
            
            <p className="text-text-secondary text-lg md:text-xl max-w-xl mb-12 leading-relaxed">
              FinMind bridges the gap between traditional banking and the digital future. Link your accounts in seconds and experience real-time visibility.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 mb-16">
              <Button className="h-14 px-8 rounded-xl bg-gradient-to-b from-primary to-primary-dim text-white font-bold text-lg hover:scale-[1.02] shadow-[0_20px_40px_rgba(123,92,240,0.2)] border border-primary/50 transition-all duration-300">
                Get Started
              </Button>
              <Button variant="outline" className="h-14 px-8 rounded-xl border-white/10 hover:bg-white/5 text-white font-bold text-lg transition-all duration-300 flex items-center gap-2">
                Documentation <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/5">
              <div className="group">
                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter group-hover:text-primary transition-colors">50+</div>
                <div className="text-xs text-text-secondary font-bold uppercase tracking-[0.2em]">Connectors</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tighter group-hover:text-white transition-colors">0.1ms</div>
                <div className="text-xs text-text-secondary font-bold uppercase tracking-[0.2em]">Sync Speed</div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Visual Logo Grid (Spans 7 cols) */}
          <div className="lg:col-span-7 relative">
            {/* Ambient Lighting Behind Grid */}
            <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10" />
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-5">
              {integrations.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: idx % 2 === 0 ? 5 : -5 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: idx * 0.02, 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20 
                  }}
                  className="group relative"
                >
                  <IntegrationIcon item={item} />
                  {/* Glass Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-surface/80 backdrop-blur-md border border-white/10 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap translate-y-2 group-hover:translate-y-0">
                    {item.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
