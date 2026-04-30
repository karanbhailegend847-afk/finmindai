"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaStripe,
  FaPaypal,
  FaApplePay,
  FaGooglePay,
  FaBitcoin,
  FaEthereum,
  FaShieldAlt,
  FaChartLine,
  FaUniversity,
  FaCreditCard
} from "react-icons/fa";
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiCoinbase,
  SiBinance
} from "react-icons/si";

const iconConfigs = [
  { Icon: FaStripe, color: "#635BFF" },
  { Icon: FaPaypal, color: "#003087" },
  { Icon: FaApplePay, color: "#FFFFFF" },
  { Icon: FaGooglePay, color: "#4285F4" },
  { Icon: SiVisa, color: "#1A1F71" },
  { Icon: SiMastercard, color: "#EB001B" },
  { Icon: SiAmericanexpress, color: "#007CC3" },
  { Icon: FaBitcoin, color: "#F7931A" },
  { Icon: FaEthereum, color: "#3C3C3D" },
  { Icon: SiCoinbase, color: "#0052FF" },
  { Icon: SiBinance, color: "#F3BA2F" },
  { Icon: FaShieldAlt, color: "#10B981" },
  { Icon: FaChartLine, color: "#8B5CF6" },
  { Icon: FaUniversity, color: "#3B82F6" },
  { Icon: FaCreditCard, color: "#F59E0B" },
];

export default function FeatureSection() {
  const orbitCount = 3;
  const orbitGap = 8; // rem between orbits
  const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden bg-background">
      {/* Epic Atmospheric Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,#2d1b5e_0%,#0A0A0F_80%)] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#1a1033_0%,#0A0A0F_80%)] opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-[40rem]">
        {/* Background Aura - Enhanced purple glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Left side: Heading and Text */}
      <div className="w-full lg:w-1/2 z-10 p-12 lg:pl-20 text-center lg:text-left">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
        >
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
            Unified Connection
          </h2>
          <h1 className="text-5xl sm:text-7xl font-display font-black mb-6 text-white leading-[1.1] tracking-tight">
            Connect Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary">
              Global Capital
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-body">
            FinMind seamlessly bridges your accounts, payment processors, and crypto vaults into a single, high-fidelity intelligence stream.
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20" asChild>
              <Link to="/dashboard">Get Connected</Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 border-white/10 hover:bg-white/5 text-white font-bold transition-all" asChild>
              <Link to="/vision">Our Vision</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Right side: Orbit animation */}
      <div className="relative w-full lg:w-1/2 h-[35rem] lg:h-full flex items-center justify-center lg:justify-start overflow-hidden pointer-events-none lg:pointer-events-auto">
        <div className="relative w-[45rem] h-[45rem] lg:translate-x-[20%] flex items-center justify-center">
          {/* Center Circle - The FinMind Hub */}
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 20px rgba(123, 92, 240, 0.2)", "0 0 60px rgba(123, 92, 240, 0.4)", "0 0 20px rgba(123, 92, 240, 0.2)"],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-28 h-28 rounded-full bg-background/50 backdrop-blur-md border border-primary/30 flex items-center justify-center z-20 relative shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-inner overflow-hidden">
                <img src="/logo.png" alt="FinMind Logo" className="w-full h-full object-cover rounded-full shadow-[0_0_15px_rgba(123,92,240,0.5)]" />
            </div>
          </motion.div>

          {/* Generate Orbits */}
          {[...Array(orbitCount)].map((_, orbitIdx) => {
            const size = `${14 + orbitGap * (orbitIdx + 1)}rem`;
            const angleStep = (2 * Math.PI) / iconsPerOrbit;
            const orbitIcons = iconConfigs.slice(orbitIdx * iconsPerOrbit, (orbitIdx + 1) * iconsPerOrbit);

            return (
              <div
                key={orbitIdx}
                className="absolute rounded-full border border-white/10"
                style={{
                  width: size,
                  height: size,
                  animation: `spin ${20 + orbitIdx * 10}s linear infinite`,
                  animationDirection: orbitIdx % 2 === 0 ? 'normal' : 'reverse'
                }}
              >
                {orbitIcons.map((cfg, iconIdx) => {
                    const angle = iconIdx * angleStep;
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);

                    return (
                      <div
                        key={iconIdx}
                        className="absolute bg-[#0C0C12] border border-white/10 rounded-full p-2.5 shadow-xl flex items-center justify-center group"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <motion.div
                             animate={{ rotate: orbitIdx % 2 === 0 ? -360 : 360 }}
                             transition={{ duration: 20 + orbitIdx * 10, repeat: Infinity, ease: "linear" }}
                        >
                            <cfg.Icon className="w-6 h-6 transition-transform group-hover:scale-125" style={{ color: cfg.color }} />
                        </motion.div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
