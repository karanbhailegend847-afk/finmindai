'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Code, CheckCircle, Bot, Zap, Shield, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  {
    title: 'Precision Portfolio Tracking',
    description: 'Unified view of all assets with real-time valuation updates and dividend tracking across 50+ institutional connections.',
    icon: Code,
    color: 'from-blue-500 to-cyan-400',
    delay: 0.1,
  },
  {
    title: 'Intelligent Risk Analysis',
    description: 'Advanced risk modeling and stress-testing for your portfolio, identifying vulnerabilities before they impact your targets.',
    icon: CheckCircle,
    color: 'from-purple-500 to-indigo-400',
    delay: 0.2,
  },
  {
    title: 'Autonomous Wealth Advisor',
    description: 'AI-driven rebalancing and tax-loss harvesting suggestions tailored to your unique financial goals and risk profile.',
    icon: Bot,
    color: 'from-emerald-500 to-teal-400',
    delay: 0.3,
  },
]

const FeatureCard = ({ title, description, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative h-full rounded-[2rem] border border-white/5 bg-[#050507] p-8 transition-all duration-300 hover:border-primary/30"
  >
    {/* Animated background glow */}
    <div className={cn(
      "absolute -inset-1 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-10 bg-gradient-to-br",
      color
    )} />

    <div className="relative z-10 flex flex-col h-full">
      <div className={cn(
        "mb-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(123,92,240,0.3)]",
        color
      )}>
        <Icon className="size-7 text-white" />
      </div>

      <h3 className="mb-4 text-xl font-display font-bold text-white tracking-tight group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="flex-grow text-text-secondary text-sm font-medium leading-relaxed">
        {description}
      </p>

      <div className="mt-8 flex items-center gap-2 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-2 text-[10px] font-bold uppercase tracking-widest text-[#7B5CF0]">
        <div className="flex -space-x-1 shrink-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="size-4 rounded-full border border-black bg-white/10" />
          ))}
        </div>
        <span className="truncate">Active deployment</span>
      </div>
    </div>
  </motion.div>
)

export default function FeaturesShowcase({ className }) {
  return (
    <section className={cn("relative py-24", className)}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
