"use client";

import { motion } from "framer-motion";
import React from "react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500 text-white p-4 rounded-md shadow-lg"
    >
      {message}
    </motion.div>
  );
}
