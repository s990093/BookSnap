"use client";

import React, { useState } from "react";
import { Post, TemplateImage } from "@/app/types/post";
import { useQuery } from "@tanstack/react-query";
import { postsApi } from "@/app/lib/api/index";
import { motion, AnimatePresence } from "framer-motion";
import { PostGrid } from "../components/instagram/PostGrid";
import { PostModal } from "../components/instagram/PostModal";
import { getTemplates } from "../lib/api/templates";

export default function InstagramPostsPage() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<TemplateImage[]>(
    []
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => postsApi.getAll(),
  });

  const { data: templates } = useQuery<TemplateImage[]>({
    queryKey: ["templates"],
    queryFn: () => getTemplates(),
  });

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDownloadAll = async () => {
    try {
      // 下載貼文的所有圖片
      if (selectedPost) {
        const images = Array.isArray(selectedPost.images)
          ? selectedPost.images
          : [selectedPost.images];

        for (let i = 0; i < images.length; i++) {
          const postFilename = `1-${i + 1}-post-${selectedPost.id}.jpg`;
          await handleDownload(images[i].image, postFilename);
        }
      }

      // 下載所選模板圖片
      for (let i = 0; i < selectedTemplates.length; i++) {
        const template = selectedTemplates[i];
        const templateFilename = `2-${i + 1}-template-${template.id}.jpg`;
        await handleDownload(template.image, templateFilename);
      }
    } catch (error) {
      console.error("批量下載失敗:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6 text-purple-400"
        >
          Instagram Posts
        </motion.h1>

        {posts && <PostGrid posts={posts} onPostClick={setSelectedPost} />}

        <AnimatePresence>
          {selectedPost && templates && (
            <PostModal
              post={selectedPost}
              templates={templates}
              selectedTemplates={selectedTemplates}
              currentImageIndex={currentImageIndex}
              onClose={() => setSelectedPost(null)}
              onDownload={handleDownloadAll}
              onTemplateToggle={(template) => {
                setSelectedTemplates((prev: TemplateImage[]) =>
                  prev.some((t) => t.id === template.id)
                    ? prev.filter((t) => t.id !== template.id)
                    : [...prev, template]
                );
              }}
              onImageIndexChange={setCurrentImageIndex}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
