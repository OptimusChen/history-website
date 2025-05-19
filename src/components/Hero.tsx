'use client';

import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { useCallback } from "react";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export default function Hero() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <section className="relative w-full py-24 px-6 bg-[#003B71] text-white text-center overflow-hidden">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          fullScreen: false,
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 100 },
            size: { value: 3 },
            move: { enable: true, speed: 0.5 },
            opacity: { value: 0.2 },
            color: { value: "#ffffff" },
          },
        }}
      />

      {/* Text Content */}
      <div className="relative z-10">
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
      </div>
    </section>
  );
}
