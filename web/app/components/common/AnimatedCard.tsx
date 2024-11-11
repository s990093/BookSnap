"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
}

export function AnimatedCard({ children, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
    >
      {children}
    </motion.div>
  );
}
