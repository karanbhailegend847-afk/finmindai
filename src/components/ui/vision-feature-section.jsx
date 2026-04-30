"use client"

import { cn } from "@/lib/utils"
import { CardContent } from "@/components/ui/card";
import { TbHeartPlus } from "react-icons/tb";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Highlight = ({
  children,
  className,
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-primary/10 text-primary px-1 py-0.5 rounded",
        className
      )}
    >
      {children}
    </span>
  );
};


const CARDS = [
  {
    id: 0,
    name: "Sarah Chen",
    designation: "Hedge Fund Manager",
    content: (
      <p>
        <Highlight>FinMind AI</Highlight> has completely transformed our market analysis. The predictive models are accurate and{" "}
        <Highlight>seamlessly integrate</Highlight> into our trading terminal.
      </p>
    ),
  },
  {
    id: 1,
    name: "Alex Rodriguez",
    designation: "Quantitative Analyst",
    content: (
      <p>
        The <Highlight>risk management</Highlight> system behind FinMind is elegant. From backtesting to live execution, every detail is built with{" "}
        <Highlight>precision and speed</Highlight> in mind.
      </p>
    ),
  },
  {
    id: 2,
    name: "David Kim",
    designation: "Venture Capitalist",
    content: (
      <p>
        After adopting <Highlight>FinMind AI</Highlight>, our portfolio performance increased by 40%. The rich data insights and{" "}
        <Highlight>real-time alerts</Highlight> are essential tools for modern finance.
      </p>
    ),
  },
];


const integrations = [
  {
    name: "TradingView",
    desc: "Advanced charting and real-time market data integration",
    icon: "📈",
  },
  {
    name: "Bloomberg",
    desc: "Seamless terminal data synchronization and analysis",
    icon: "🏛️",
  }
];


export default function VisionSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 dark">
      <div className="grid grid-cols-1 lg:grid-cols-2 relative gap-8 lg:gap-0">
        {/* Left Block */}
        <div className="flex flex-col items-start justify-center border border-white/5 bg-zinc-900/10 p-4 sm:p-6 lg:p-8 rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl">
          {/* Card */}
          <div className="relative w-full mb-8 sm:mb-12">
            <div className="absolute inset-x-0 -bottom-2 h-16 sm:h-20 lg:h-24 bg-gradient-to-t from-[#050507] to-transparent z-10"></div>
            <CardStack items={CARDS} />
          </div>

          {/* Content */}
          <h3 className="text-lg sm:text-xl lg:text-2xl font-normal text-white leading-relaxed">
            Revolutionizing Market Intelligence <span className="text-primary font-bold">FinMind AI</span>{" "}
            <span className="text-zinc-500 text-sm sm:text-base lg:text-lg block mt-4"> 
                Our vision is to democratize institutional-grade financial intelligence through beautifully designed tools that provide actionable market insights.
            </span>
          </h3>
        </div>

        {/* Right Block */}
        <div className="flex flex-col items-center justify-start border border-white/5 bg-zinc-900/10 p-4 sm:p-6 lg:p-8 rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl">
          {/* Content */}
          <h3 className="text-lg sm:text-xl lg:text-2xl font-normal text-white mb-8 leading-relaxed text-center lg:text-left w-full">
            The Global Financial Ecosystem <span className="text-primary font-bold">Integrated</span>{" "}
            <span className="text-zinc-500 text-sm sm:text-base lg:text-lg block mt-4"> 
                Connect effortlessly with your existing brokerage and terminal tools using our smart API-ready architecture and eliminate data silos.
            </span>
          </h3>
          <div
            className={cn(
              "group relative mt-auto w-full inline-flex animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-zinc-900/50 px-4 sm:px-6 lg:px-8 py-2 font-medium text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",

              // before styles
              "before:absolute before:bottom-[8%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]",
            )}
          >
            {/* Integration List */}
            <CardContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 bg-zinc-950 border border-white/5 rounded-2xl sm:rounded-3xl z-10 w-full shadow-2xl">
              {integrations.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 sm:p-4 border border-white/5 rounded-xl sm:rounded-2xl hover:bg-white/5 transition group/item"
                >
                  <div className="flex items-center gap-2 sm:gap-4 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-sm sm:text-xl flex-shrink-0 group-hover/item:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-white truncate">{item.name}</p>
                      <p className="text-xs text-zinc-500 line-clamp-1 sm:line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                  <button className="rounded-full border border-white/10 p-2 text-zinc-500 hover:text-red-500 hover:border-red-500/50 transition-colors flex-shrink-0 ml-2">
                    <TbHeartPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </div>
        </div>
      </div>
      
      {/* Stats and Testimonial Section */}
      <div className="mt-20 sm:mt-24 lg:mt-32 grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24 items-center">
        <div className="flex justify-center items-center p-4">
          <div className="grid grid-cols-3 gap-8 sm:gap-12 w-full text-center sm:text-left">
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">$12B+</div>
              <p className="text-sm sm:text-base text-zinc-500 font-medium">Assets Analyzed</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">2.4M</div>
              <p className="text-sm sm:text-base text-zinc-500 font-medium">Active Traders</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">99.9%</div>
              <p className="text-sm sm:text-base text-zinc-500 font-medium">Uptime SLA</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <blockquote className="border-l-4 border-primary pl-6 sm:pl-8 lg:pl-10 text-zinc-400">
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed italic">
              "FinMind AI isn't just a tool; it's the future of how we interact with global markets. It fuses deep learning with intuitive design to unlock true alpha."
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="space-y-1">
                <cite className="block font-bold text-base sm:text-lg text-white not-italic text-primary">Krishna Kamble, CEO</cite>
                <div className="text-sm text-zinc-500">Visionary in Financial AI</div>
              </div>
            </div>
          </blockquote>
        </div>
      </div>
    </section>
  )
}

let interval;

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState(items);

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards) => {
        const newArray = [...prevCards]; 
        newArray.unshift(newArray.pop()); 
        return newArray;
      });
    }, 5000);
  };

  return (
    <div className="relative mx-auto h-52 w-full md:w-[420px] my-4">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute bg-zinc-950 h-52 w-full md:w-[420px] rounded-3xl p-6 shadow-2xl border border-white/10 flex flex-col justify-between backdrop-blur-xl"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, 
              zIndex: cards.length - index, 
            }}
          >
            <div className="font-normal text-zinc-300 text-sm sm:text-base leading-relaxed">
              {card.content}
            </div>
            <div className="flex items-center gap-3 mt-4">
               <div className="size-10 rounded-full border border-white/10 bg-zinc-900 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${card.name}`} alt={card.name} />
               </div>
               <div>
                  <p className="text-white font-bold text-sm">
                    {card.name}
                  </p>
                  <p className="text-zinc-500 font-medium text-xs">
                    {card.designation}
                  </p>
               </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
