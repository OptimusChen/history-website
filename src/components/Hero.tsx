'use client';

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="w-full py-24 px-6 bg-[#003B71] text-white text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl sm:text-5xl font-bold mb-4"
      >
        Mr. Vacca&apos;s Advanced History Assignments
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="text-lg sm:text-xl max-w-2xl mx-auto"
      >
        Explore in-depth research on global conflicts of the 20th century.
      </motion.p>
    </section>
  );
}
