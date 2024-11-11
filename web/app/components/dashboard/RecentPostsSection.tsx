"use client";

import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/app/lib/api";
import { RecentPosts } from "./RecentPosts";
import { motion } from "framer-motion";

export function RecentPostsSection() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", "recent"],
    queryFn: () => getPosts({ limit: 5 }),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <RecentPosts posts={posts} isLoading={isLoading} />
    </motion.div>
  );
}
