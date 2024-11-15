"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const actions = [
  { title: "Create Post", path: "/posts/create", icon: "📝" },
  { title: "New Event", path: "/events/create", icon: "📅" },
  { title: "Design Templates", path: "/design-templates/create", icon: "🎨" },
  { title: "Add Post Type", path: "/post-types/create", icon: "🏷️" },
];

export function QuickActionsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 gap-4"
    >
      <h2 className="text-xl font-bold mb-2 select-none">Quick Actions</h2>
      {actions.map((action) => (
        <Link key={action.path} href={action.path}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            <span className="text-2xl select-none">{action.icon}</span>
            <span className="select-none">{action.title}</span>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  );
}
