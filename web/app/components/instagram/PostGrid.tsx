import React from "react";
import Image from "next/image";
import { Post } from "@/app/types/post";
import { motion } from "framer-motion";

interface PostGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export function PostGrid({ posts, onPostClick }: PostGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => onPostClick(post)}
        >
          <div className="relative h-48">
            <Image
              src={post.images[0]?.image_url || "/placeholder.jpg"}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white mb-2">
              {post.title}
            </h2>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">{post.type.name}</span>
              <span className="text-sm text-gray-400">{post.author.name}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
