import { Post } from "@/app/types";
import { motion } from "framer-motion";
import { LazyLoadImage } from "../common/LazyLoadImage";

interface PostGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export function PostGrid({ posts, onPostClick }: PostGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {posts?.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-xl transition-all"
          onClick={() => onPostClick(post)}
        >
          <div className="relative h-48 mb-4 overflow-hidden rounded">
            <LazyLoadImage
              src={post.images[0]?.image || ""}
              alt={post.title}
              effect="blur"
              className="object-cover w-full h-full"
              wrapperClassName="w-full h-full"
            />
          </div>
          <h2 className="font-semibold mb-2">{post.title}</h2>
          <p className="text-sm text-gray-400">{post.type}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
