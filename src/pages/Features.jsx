import React from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import FeaturesSection from '../components/ui/features-section';
import CustomersTableCard from '../components/ui/customers-table';

const Features = () => {
  return (
    <PageWrapper>
      <div className="bg-[#050507] min-h-screen">
        {/* Main Feature Grid Section - Replaces legacy hero */}
        <FeaturesSection />

        {/* Customers Table Section */}
        <section className="border-t border-white/5 pt-12 pb-32">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <CustomersTableCard />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-32 text-center pb-20"
            >
              <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-8 tracking-tight">
                Master the <span className="text-primary text-glow-sm">Markets</span>
              </h2>
              <p className="text-text-secondary mb-12 max-w-xl mx-auto text-lg font-medium leading-relaxed">
                Join elite traders and investors who leverage FinMind AI to stay ahead of market cycles.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(123,92,240,0.4)] uppercase tracking-widest text-sm">
                  Get Started Now
                </button>
                <button className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest text-sm">
                  View Documentation
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default Features;
