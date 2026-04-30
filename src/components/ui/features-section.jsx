'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  ArrowUp, 
  ArrowUpRight,
  Plus, 
  Globe,
  Sparkles,
  Play,
  Target,
  CalendarCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Avatar Constants
const MESCHAC_AVATAR = 'https://avatars.githubusercontent.com/u/47919550?v=4'
const BERNARD_AVATAR = 'https://avatars.githubusercontent.com/u/31113941?v=4'
const THEO_AVATAR = 'https://avatars.githubusercontent.com/u/68236786?v=4'
const GLODIE_AVATAR = 'https://avatars.githubusercontent.com/u/99137927?v=4'

const MeetingIllustration = () => {
    return (
        <Card
            aria-hidden
            className="mt-9 aspect-video p-4 border-white/5 bg-zinc-900/50 backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="relative hidden h-fit">
                <div className="absolute -left-1.5 bottom-1.5 rounded-md border-t border-red-700 bg-red-500 px-1 py-px text-[10px] font-medium text-white shadow-md shadow-red-500/35 leading-tight uppercase">PDF</div>
                <div className="h-10 w-8 rounded-md border border-zinc-200 bg-zinc-100 dark:bg-zinc-900 shadow-sm"></div>
            </div>
            
            <div className="mb-0.5 text-sm font-semibold text-white">Market Prediction Audit</div>
            <div className="mb-4 flex gap-2 text-sm text-zinc-400">
                <span>Last Updated: 9:30 AM</span>
            </div>
            
            <div className="mb-3 flex -space-x-1.5">
                {[
                    { src: MESCHAC_AVATAR, alt: 'A1' },
                    { src: BERNARD_AVATAR, alt: 'A2' },
                    { src: THEO_AVATAR, alt: 'A3' },
                    { src: GLODIE_AVATAR, alt: 'A4' },
                ].map((avatar, index) => (
                    <div
                        key={index}
                        className="bg-zinc-950 size-7 rounded-full border border-white/10 p-0.5 shadow-sm overflow-hidden"
                    >
                        <img
                            className="aspect-square rounded-full object-cover w-full h-full"
                            src={avatar.src}
                            alt={avatar.alt}
                        />
                    </div>
                ))}
            </div>
            <div className="text-zinc-500 text-xs font-medium">Global Equity Trends</div>
        </Card>
    )
}

const CodeReviewIllustration = () => {
    return (
        <div className="mt-9 flex h-full items-end justify-center">
            <div className="bg-zinc-900/80 relative h-fit w-fit translate-y-6 rounded-xl border border-white/10 p-4 shadow-2xl transition-all duration-500 group-hover:-translate-x-12 group-hover:-rotate-12 backdrop-blur-md z-20">
                <div className="mb-3 flex items-center gap-2">
                    <div className="bg-zinc-950 size-6 rounded-full border border-white/10 p-0.5 shadow-sm overflow-hidden flex-shrink-0">
                        <img
                            className="aspect-square rounded-full object-cover"
                            src={MESCHAC_AVATAR}
                            alt="M Irung"
                        />
                    </div>
                    <span className="text-zinc-400 text-xs font-medium">Méschac Irung</span>
                    <span className="text-zinc-600 text-[10px]">2m</span>
                </div>

                <div className="ml-8 space-y-2">
                    <div className="bg-zinc-800 h-1.5 w-32 rounded-full"></div>
                    <div className="bg-zinc-800 h-1.5 w-24 rounded-full"></div>
                    <div className="bg-zinc-800 h-1.5 w-20 rounded-full"></div>
                </div>

                <ArrowUpRight className="ml-8 mt-3 size-4 text-emerald-500" />
            </div>
            
            <div className="bg-indigo-500/10 border-indigo-500/20 absolute bottom-0 right-10 flex aspect-3/5 w-2/5 translate-x-4 translate-y-8 rounded-xl border p-2 transition-transform duration-500 ease-in-out group-hover:rotate-6 backdrop-blur-xl z-10">
                <div className="bg-indigo-500/20 m-auto flex size-10 rounded-full border border-indigo-500/30">
                    <Play className="fill-indigo-400 stroke-indigo-400 m-auto size-4 translate-x-0.5" />
                </div>
            </div>
        </div>
    )
}

const AIAssistantIllustration = () => {
    return (
        <Card
            aria-hidden
            className="mt-6 aspect-video translate-y-4 border-white/10 bg-zinc-900/50 p-4 pb-6 transition-all duration-500 group-hover:translate-y-0 shadow-2xl backdrop-blur-sm"
        >
            <div className="w-fit">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950 mb-3 border border-orange-500/10">
                    <Sparkles className="size-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-sm font-medium text-white">Financial AI Assistant</div>
            </div>
            
            <div className="bg-white/5 -mx-3 -mb-3 mt-3 space-y-3 rounded-lg p-3 border border-white/5">
                <p className="line-clamp-2 text-sm text-zinc-300">
                    Analyze the current tech sector volatility and suggest a hedging strategy for my portfolio.
                </p>

                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="size-8 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-center">
                            <Plus className="size-4 text-zinc-500" />
                        </div>
                        <div className="size-8 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-center">
                            <Globe className="size-4 text-zinc-500" />
                        </div>
                    </div>

                    <div className="size-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <ArrowUp className="size-4 text-white" strokeWidth={3} />
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default function FeaturesSection({ className }) {
    return (
        <section className={cn("relative overflow-hidden dark", className)}>
            <div className="py-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div className="mb-16">
                        <h2 className="text-white max-w-2xl text-balance text-4xl font-semibold tracking-tight">
                            Advanced Intelligence for Financial Markets
                        </h2>
                    </div>
                </div>
                
                <div className="mx-auto mt-16 w-full max-w-5xl px-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Market Prediction Card */}
                        <Card
                            variant="soft"
                            className="group flex flex-col justify-between overflow-hidden p-0 h-full border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all duration-300 shadow-xl">
                            <div className="p-6">
                                <Target className="size-6 text-zinc-400 mb-4" />
                                <h3 className="text-lg font-semibold text-white">Predictive Market Intelligence</h3>
                                <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                                    Leverage advanced AI models to forecast stock trends and market movements with precision.
                                </p>
                            </div>
                            <div className="flex h-full flex-col justify-end overflow-hidden pb-6 pl-6 pr-6">
                                <MeetingIllustration />
                            </div>
                        </Card>

                        {/* Portfolio Audit Card */}
                        <Card
                            variant="soft"
                            className="group flex flex-col justify-between overflow-hidden p-0 h-full border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all duration-300 shadow-xl">
                            <div className="p-6">
                                <CalendarCheck className="size-6 text-zinc-400 mb-4" />
                                <h3 className="text-lg font-semibold text-white">Real-time Portfolio Audit</h3>
                                <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                                    Automatically scan your assets for risk exposure and hidden opportunities in the share market.
                                </p>
                            </div>
                            <div className="flex h-full flex-col justify-end overflow-hidden pb-6 pl-6 pr-6">
                                <CodeReviewIllustration />
                            </div>
                        </Card>

                        {/* AI Strategist Card */}
                        <Card
                            variant="soft"
                            className="group flex flex-col justify-between overflow-hidden p-0 h-full border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all duration-300 shadow-xl">
                            <div className="p-6 pb-0">
                                <Sparkles className="size-6 text-zinc-400 mb-4" />
                                <h3 className="text-lg font-semibold text-white">Contextual AI Strategist</h3>
                                <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                                    Get instant help and context-aware market insights from our finance-trained AI.
                                </p>
                            </div>
                            <div className="flex h-full flex-col justify-end overflow-hidden [mask-image:linear-gradient(to_bottom,white_60%,transparent)] px-6 pt-6">
                                <AIAssistantIllustration />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
