"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/area-chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Activity, BarChart3, Binary } from "lucide-react";

// Mock Data for "Asset Growth Simulation"
const growthData = [
  { month: "Jan", predicted: 100, actual: 100 },
  { month: "Feb", predicted: 120, actual: 115 },
  { month: "Mar", predicted: 150, actual: 140 },
  { month: "Apr", predicted: 140, actual: 135 },
  { month: "May", predicted: 180, actual: 160 },
  { month: "Jun", predicted: 220, actual: 190 },
  { month: "Jul", predicted: 250, actual: 210 },
];

// Mock Data for "Model Confidence"
const confidenceData = [
  { step: "Feb", confidence: 85 },
  { step: "Mar", confidence: 88 },
  { step: "Apr", confidence: 92 },
  { step: "May", confidence: 90 },
  { step: "Jun", confidence: 94 },
  { step: "Jul", confidence: 97 },
];

// Mock Data for "Sector Performance Simulation"
const sectorData = [
  { month: "Jan", tech: 400, energy: 240 },
  { month: "Feb", tech: 300, energy: 139 },
  { month: "Mar", tech: 500, energy: 380 },
  { month: "Apr", tech: 800, energy: 430 },
  { month: "May", tech: 700, energy: 300 },
  { month: "Jun", tech: 950, energy: 500 },
];

const chartConfig = {
  predicted: { label: "AI Predicted", color: "var(--chart-1)" },
  actual: { label: "Market Baseline", color: "var(--chart-2)" },
  confidence: { label: "Confidence", color: "var(--chart-3)" },
  tech: { label: "Tech", color: "var(--chart-4)" },
  energy: { label: "Energy", color: "var(--chart-5)" },
} satisfies ChartConfig;

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};

export default function StockSimulationSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-black/50">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="space-y-12"
        >
          <div className="text-center space-y-4 mb-16">
            <motion.div variants={cardVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Activity className="w-3 h-3" />
              Capital Simulation Environment
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white text-center">
              Autonomous Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Intelligence.</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto font-body text-center">
              Our AI simulates millions of market permutations every second to identify exponential growth opportunities with real-time data integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Chart 1: Growth Forecast */}
            <motion.div variants={cardVariants}>
              <Card className="bg-surface/40 border-border/50 backdrop-blur-xl overflow-hidden min-h-[420px] flex flex-col">
                <CardHeader className="pb-2">
                   <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Growth Forecast
                    </CardTitle>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-none px-3 py-1">
                        +24.8%
                    </Badge>
                   </div>
                  <CardDescription className="text-text-secondary">AI Simulated vs. Market Baseline</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 flex-1 flex flex-col justify-end">
                  <ChartContainer config={chartConfig} className="w-full h-[240px]">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="fillPredicted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-predicted)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="var(--color-predicted)" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-actual)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="var(--color-actual)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tickMargin={10}
                        tick={{ fill: "rgba(144, 144, 168, 0.6)", fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="natural"
                        dataKey="predicted"
                        stroke="var(--color-predicted)"
                        fill="url(#fillPredicted)"
                        strokeWidth={2.5}
                        animationDuration={2000}
                      />
                      <Area
                        type="natural"
                        dataKey="actual"
                        stroke="var(--color-actual)"
                        fill="url(#fillActual)"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Chart 2: Model Confidence */}
            <motion.div variants={cardVariants}>
              <Card className="bg-surface/40 border-border/50 backdrop-blur-xl overflow-hidden min-h-[420px] flex flex-col">
                <CardHeader className="pb-2">
                   <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
                        <Binary className="w-5 h-5 text-primary" />
                        AI Confidence
                    </CardTitle>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-none px-3 py-1">
                        97.2%
                    </Badge>
                   </div>
                  <CardDescription className="text-text-secondary">Model simulation certainty factor</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 flex-1 flex flex-col justify-end">
                  <ChartContainer config={chartConfig} className="w-full h-[240px]">
                    <AreaChart data={confidenceData}>
                      <defs>
                        <linearGradient id="fillConfidence" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-confidence)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="var(--color-confidence)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        dataKey="step" 
                        axisLine={false} 
                        tickLine={false} 
                        tickMargin={10}
                        tick={{ fill: "rgba(144, 144, 168, 0.6)", fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="confidence"
                        stroke="var(--color-confidence)"
                        fill="url(#fillConfidence)"
                        strokeWidth={4}
                        animationDuration={2500}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Chart 3: Sector Dominance */}
            <motion.div variants={cardVariants}>
              <Card className="bg-surface/40 border-border/50 backdrop-blur-xl overflow-hidden min-h-[420px] flex flex-col">
                <CardHeader className="pb-2">
                   <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        Sector Analysis
                    </CardTitle>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-none px-3 py-1">
                        Tech Dominant
                    </Badge>
                   </div>
                  <CardDescription className="text-text-secondary">Simulated vertical capital velocity</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 flex-1 flex flex-col justify-end">
                  <ChartContainer config={chartConfig} className="w-full h-[240px]">
                    <AreaChart data={sectorData}>
                      <defs>
                        <linearGradient id="fillTech" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-tech)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="var(--color-tech)" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="fillEnergy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-energy)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="var(--color-energy)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tickMargin={10}
                        tick={{ fill: "rgba(144, 144, 168, 0.6)", fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        stackId="1"
                        type="natural"
                        dataKey="tech"
                        stroke="var(--color-tech)"
                        fill="url(#fillTech)"
                        strokeWidth={2.5}
                        animationDuration={3000}
                      />
                      <Area
                        stackId="1"
                        type="natural"
                        dataKey="energy"
                        stroke="var(--color-energy)"
                        fill="url(#fillEnergy)"
                        strokeWidth={2}
                        animationDuration={3000}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[160px] rounded-full pointer-events-none -z-10" />
    </section>
  );
}
