"use client";
import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "FinMind completely changed how I track my investments. The Gemini AI integration feels like having a private analyst available 24/7.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Aryan Mehta",
    role: "Startup Founder",
  },
  {
    text: "The vault activity dashboard is insanely good. I can see capital flow in real-time and get AI-driven suggestions instantly.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Sophia Chen",
    role: "Portfolio Manager",
  },
  {
    text: "I replaced three finance apps with FinMind. The intelligence briefing every Monday is genuinely better than any newsletter I've subscribed to.",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    name: "James Okafor",
    role: "Angel Investor",
  },
  {
    text: "The UI alone is worth it — nothing in fintech looks this premium. But the AI analysis is what keeps me coming back every day.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Priya Nair",
    role: "Wealth Advisor",
  },
  {
    text: "Net worth tracking used to take me hours every week. Now FinMind's autonomous agents handle everything and alert me to anything unusual.",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    name: "Lucas Müller",
    role: "Day Trader",
  },
  {
    text: "The predictive analytics actually caught a risk in my portfolio before I even noticed it. That feature alone paid for the subscription many times over.",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    name: "Fatima Al-Hassan",
    role: "CFO, TechCo",
  },
  {
    text: "I've been using FinMind for 3 months and my savings rate improved by 18%. The spending velocity alerts are a game changer.",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    name: "Carlos Rivera",
    role: "Software Engineer",
  },
  {
    text: "The tax optimization suggestions alone saved me thousands. FinMind AI genuinely thinks like a financial strategist.",
    image: "https://randomuser.me/api/portraits/women/38.jpg",
    name: "Amara Osei",
    role: "Business Analyst",
  },
  {
    text: "Finally a finance tool built for people who actually care about building wealth. Not just budgeting — real wealth architecture.",
    image: "https://randomuser.me/api/portraits/men/91.jpg",
    name: "Ravi Kumar",
    role: "VC Associate",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const TestimonialsColumn = ({
  className,
  testimonials: items,
  duration = 10,
}: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {items.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl border border-border/50 shadow-lg shadow-primary/5 bg-surface/30 backdrop-blur-sm max-w-xs w-full hover:border-primary/30 transition-all duration-300"
              >
                <p className="text-text-secondary text-sm leading-relaxed">"{text}"</p>
                <div className="flex items-center gap-3 mt-6">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div className="flex flex-col">
                    <div className="font-semibold text-white text-sm leading-5">{name}</div>
                    <div className="text-xs text-text-secondary leading-5 opacity-80">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="bg-background py-24 relative border-t border-border/30 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-primary/5 rounded-[100%] blur-[100px] pointer-events-none" />

      <div className="container z-10 mx-auto relative px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
            ✦ Trusted by Builders
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-white text-center leading-tight">
            What our users say
          </h2>
          <p className="text-center mt-5 text-text-secondary text-lg leading-relaxed">
            Join 10,000+ wealth builders who trust FinMind to manage and grow their capital.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
