"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqData = [
  {
    question: "What is the share market?",
    answer: "The share market is a place where investors buy and sell shares of publicly listed companies. In India, major stock exchanges include NSE and BSE. It helps companies raise funds and gives investors an opportunity to grow wealth."
  },
  {
    question: "How does the share market work in India?",
    answer: "The share market works through stock exchanges like NSE and BSE where buyers and sellers trade shares through brokers. Prices move based on demand, supply, company performance, and market news."
  },
  {
    question: "How to invest in the share market for beginners?",
    answer: "To invest in the share market, open a Demat and trading account with a SEBI-registered broker, complete KYC, add funds, research stocks, and start with small investments."
  },
  {
    question: "How to buy shares in the Indian stock market?",
    answer: "You can buy shares using a broker app like Zerodha, Upstox, Groww, or Angel One. Search the stock, enter quantity, and place a buy order during market hours."
  },
  {
    question: "Which share market app is best in India?",
    answer: "Popular share market apps in India include Zerodha Kite, Groww, Upstox, Angel One, and ICICI Direct. The best app depends on brokerage charges, ease of use, and features."
  },
  {
    question: "What are Demat and trading accounts?",
    answer: "A Demat account stores your shares electronically, while a trading account is used to buy and sell shares in the stock market."
  },
  {
    question: "What time does the share market open in India?",
    answer: "The Indian stock market opens at 9:15 AM and closes at 3:30 PM on weekdays. Pre-open session starts at 9:00 AM."
  },
  {
    question: "Will the share market go up tomorrow?",
    answer: "No one can predict with certainty whether the share market will go up tomorrow. Market movement depends on global news, earnings, inflation, interest rates, and investor sentiment."
  },
  {
    question: "Why does the share market fall?",
    answer: "The share market may fall due to weak earnings, economic slowdown, inflation, war, interest rate hikes, or panic selling by investors."
  },
  {
    question: "Can the share market crash in 2026?",
    answer: "Any market can face corrections or crashes if economic risks rise. Investors should diversify and invest for the long term instead of timing crashes."
  },
  {
    question: "Is share market investment safe?",
    answer: "Share market investing carries risk, but long-term investing in quality companies and diversified portfolios is generally safer than speculation."
  },
  {
    question: "How much money do I need to start investing?",
    answer: "You can start investing in the Indian share market with as little as ₹100 to ₹500 depending on stock prices or by investing in mutual funds."
  },
  {
    question: "Which stocks should beginners buy?",
    answer: "Beginners often prefer fundamentally strong, large-cap companies with stable earnings and market leadership. Always research before investing."
  },
  {
    question: "What are brokerage charges in India?",
    answer: "Brokerage charges vary by broker. Many discount brokers charge low fees per order, while full-service brokers may charge more for advisory services."
  },
  {
    question: "How can I learn share market trading?",
    answer: "You can learn share market trading through books, demo accounts, courses, YouTube education channels, and by practicing risk management."
  },
  {
    question: "Is intraday trading profitable?",
    answer: "Intraday trading can be profitable but is risky and requires skill, discipline, and experience. Most beginners should start cautiously."
  },
  {
    question: "What is the difference between NSE and BSE?",
    answer: "NSE and BSE are India’s two major stock exchanges. NSE has higher trading volumes, while BSE is one of the oldest exchanges in Asia."
  },
  {
    question: "How to choose the best stock broker in India?",
    answer: "Choose a broker based on low charges, fast app performance, research tools, customer support, and trustworthiness."
  }
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-border/50 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left hover:bg-white/5 px-4 transition-colors duration-200"
      >
        <span className="text-lg md:text-xl font-medium text-white/90 tracking-tight">
          {question}
        </span>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <Minus className="w-5 h-5 text-primary" />
          ) : (
            <Plus className="w-5 h-5 text-text-secondary" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-4 pb-6 text-text-secondary leading-relaxed max-w-4xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  // Generate FAQ Schema Markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden bg-background">
      {/* Epic Atmospheric Gradient Background - Resolves to pure black at edges for footer matching */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,#2d1b5e_0%,#0A0A0F_60%)] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#1a1033_0%,#0A0A0F_70%)] opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <header className="mb-16 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-primary font-bold uppercase tracking-widest text-xs"
          >
            Wealth Knowledge Base
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white mb-6"
          >
            Indian Share Market <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              Essential Guide (FAQ)
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-lg max-w-2xl leading-relaxed"
          >
            Master the fundamentals of the Indian stock market with our expert insights and beginner-friendly answers.
          </motion.p>
        </header>

        <div className="space-y-2">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <FAQItem
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
        >
          <p className="text-text-secondary text-sm mb-4">
            Looking to start your investment journey with AI?
          </p>
          <button className="text-primary font-bold hover:underline">
            Explore our Platform Features →
          </button>
        </motion.div>
      </div>

      {/* JSON-LD Schema Script Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
    </section>
  );
}
