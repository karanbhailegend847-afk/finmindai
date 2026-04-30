'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

// Avatars from the original example
const MESCHAC_AVATAR = 'https://avatars.githubusercontent.com/u/47919550?v=4'
const BERNARD_AVATAR = 'https://avatars.githubusercontent.com/u/31113941?v=4'
const THEO_AVATAR = 'https://avatars.githubusercontent.com/u/68236786?v=4'
const GLODIE_AVATAR = 'https://avatars.githubusercontent.com/u/99137927?v=4'

const DATA = [
    {
        portfolio: 'Tech Growth Alpha',
        owner: 'Méschac Irung',
        avatar: MESCHAC_AVATAR,
        trend: 'bullish',
        growth: '+24.5%',
        aum: '$1.2M',
    },
    {
        portfolio: 'S&P 500 Hedge',
        owner: 'Bernard Ng',
        avatar: BERNARD_AVATAR,
        trend: 'stable',
        growth: '+2.1%',
        aum: '$840K',
    },
    {
        portfolio: 'Crypto Momentum',
        owner: 'Théo Balick',
        avatar: THEO_AVATAR,
        trend: 'bullish',
        growth: '+142.8%',
        aum: '$2.4M',
    },
    {
        portfolio: 'Dividend King',
        owner: 'Glodie Liyolo',
        avatar: GLODIE_AVATAR,
        trend: 'bearish',
        growth: '-4.2%',
        aum: '$510K',
    },
]

export default function CustomersTableCard() {
    return (
        <Card className="overflow-hidden border-white/5 bg-zinc-900/50 shadow-2xl backdrop-blur-sm dark">
            <div className="flex items-center justify-between p-6 pb-2">
                <h2 className="text-xl font-semibold text-white tracking-tight">Top Portfolios</h2>
                <button className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors">
                    View Market Analysis
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/5 text-zinc-500 uppercase text-[10px] tracking-widest font-bold">
                            <th className="px-6 py-4 font-medium">Portfolio / Strategy</th>
                            <th className="px-6 py-4 font-medium">Market Trend</th>
                            <th className="px-6 py-4 font-medium">Performance (YTD)</th>
                            <th className="px-6 py-4 font-medium">AUM</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {DATA.map((item, i) => (
                            <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full border border-white/10 p-0.5 overflow-hidden flex-shrink-0">
                                            <img
                                                className="aspect-square rounded-full object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all"
                                                src={item.avatar}
                                                alt={item.owner}
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{item.portfolio}</div>
                                            <div className="text-xs text-zinc-500">{item.owner}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {item.trend === 'bullish' ? (
                                        <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 w-fit px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                            <ArrowUpRight className="size-3" /> Bullish
                                        </div>
                                    ) : item.trend === 'bearish' ? (
                                        <div className="flex items-center gap-1.5 text-red-500 bg-red-500/10 w-fit px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                            <ArrowDownRight className="size-3" /> Bearish
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-zinc-500 bg-zinc-500/10 w-fit px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                            <Minus className="size-3" /> Stable
                                        </div>
                                    )}
                                </td>
                                <td className={cn(
                                    "px-6 py-4 font-mono font-medium",
                                    item.growth.startsWith('+') ? "text-emerald-400" : "text-red-400"
                                )}>
                                    {item.growth}
                                </td>
                                <td className="px-6 py-4 text-zinc-300 font-medium">
                                    {item.aum}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}
