"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-6"
    >
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
        this page doesn&apos;t exist lol
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-[#003B71] text-white rounded hover:bg-blue-800 transition"
      >
        ⬅ Home
      </button>
    </motion.div>
  );
}
