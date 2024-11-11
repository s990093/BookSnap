"use client";

import { Post } from "@/app/types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { Loading } from "@/app/components/common/Loading";
import { LazyLoadImage } from "@/app/components/common/LazyLoadImage";

interface RecentPostsProps {
  posts?: Post[];
  isLoading?: boolean;
}

export function RecentPosts({ posts = [], isLoading }: RecentPostsProps) {
  if (isLoading) return <Loading />;

  if (!posts?.length) {
    return (
      <div className="text-gray-400 text-center p-8">No posts available</div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post, index) => (
          <AnimatedCard key={post.id} delay={index * 0.1}>
            <div className="flex flex-col h-full">
              {/* 圖片區域 */}
              {post.images && post.images.length > 0 && (
                <div className="w-full">
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <LazyLoadImage
                      src={post.images[0].image_url}
                      alt={post.images[0].alt_text || post.title}
                      className="object-cover w-full h-full"
                      effect="blur"
                    />
                  </div>
                  {post.images.length > 1 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto">
                      {post.images.slice(1).map((image) => (
                        <div
                          key={image.id}
                          className="w-16 h-16 flex-shrink-0 relative rounded-md overflow-hidden"
                        >
                          <LazyLoadImage
                            src={image.image_url}
                            alt={image.alt_text || "Additional image"}
                            className="object-cover w-full h-full"
                            effect="blur"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 文字內容區域 */}
              <div className="flex-1 mt-4">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-gray-400 mt-2 line-clamp-3">
                  {post.content}
                </p>
                {post.tag && (
                  <div className="mt-2 flex flex-wrap gap-2">
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
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
