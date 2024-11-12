"use client";

import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/app/lib/api";
import { Post } from "@/app/types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { Loading } from "@/app/components/common/Loading";
import { LazyLoadImage } from "@/app/components/common/LazyLoadImage";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PostHistory() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["posts", "history"],
    queryFn: () => getPosts({ limit: 20 }),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {posts?.map((post, index) => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-2"
            >
              <AnimatedCard delay={index * 0.1}>
                <div className="space-y-2">
                  {/* 主圖片 */}
                  {post.images?.[0] && (
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <LazyLoadImage
                        src={post.images[0].image_url}
                        alt={post.images[0].alt_text || post.title}
                        className="object-cover w-full h-full"
                        effect="blur"
                      />
                    </div>
                  )}

                  {/* 標題和內容預覽 */}
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {post.content}
                  </p>

                  {/* 標籤 */}
                  {post.tag && (
                    <div className="flex flex-wrap gap-1">
                      {post.tag.split(",").map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-700 rounded-full text-xs"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 時間戳 */}
                  <div className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
