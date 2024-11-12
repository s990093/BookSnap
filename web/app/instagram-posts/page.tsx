"use client";

import { useState } from "react";
import { Post, PostType, TemplateImage } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { getPosts, getTemplates } from "@/app/lib/api/index";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import { PostGrid } from "../components/instagram/PostGrid";
import { PostModal } from "../components/instagram/PostModal";
import { customSelectStyles } from "../styles/selectStyles";

export default function InstagramPostsPage() {
  const [selectedType, setSelectedType] = useState<PostType | "ALL">("ALL");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<TemplateImage[]>(
    []
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  const { data: templates = [] } = useQuery<TemplateImage[]>({
    queryKey: ["templates"],
    queryFn: () => getTemplates(),
  });

  const filteredPosts = posts?.filter((post) =>
    selectedType === "ALL" ? true : post.type === selectedType
  );

  const handleDownload = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "instagram-post.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleBatchDownload = async () => {
    if (!selectedPost) return;
    await handleDownload(selectedPost.images[currentImageIndex].image);
    for (const template of selectedTemplates) {
      await handleDownload(template.image_url);
    }
  };

  const handleTemplateToggle = (template: TemplateImage) => {
    setSelectedTemplates((prev) =>
      prev.some((t) => t.id === template.id)
        ? prev.filter((t) => t.id !== template.id)
        : [...prev, template]
    );
  };

  const typeOptions = [
    { value: "ALL", label: "All Posts" },
    ...Object.values(PostType).map((type) => ({
      value: type,
      label: type,
    })),
  ];

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

        <div className="mb-6 w-full max-w-xs">
          <Select
            instanceId="post-type-select"
            value={typeOptions.find((option) => option.value === selectedType)}
            onChange={(option) =>
              setSelectedType(option?.value as PostType | "ALL")
            }
            options={typeOptions}
            styles={customSelectStyles}
            className="text-sm"
            placeholder="Select post type..."
            isSearchable={false}
          />
        </div>

        <PostGrid posts={filteredPosts || []} onPostClick={setSelectedPost} />

        <AnimatePresence>
          {selectedPost && templates && (
            <PostModal
              post={selectedPost}
              templates={templates}
              selectedTemplates={selectedTemplates}
              currentImageIndex={currentImageIndex}
              onClose={() => setSelectedPost(null)}
              onDownload={handleDownload}
              onBatchDownload={handleBatchDownload}
              onTemplateToggle={handleTemplateToggle}
              onImageIndexChange={setCurrentImageIndex}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
