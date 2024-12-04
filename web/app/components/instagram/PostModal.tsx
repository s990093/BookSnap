import React from "react";
import Image from "next/image";
import { Post, TemplateImage } from "@/app/types/post";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface PostModalProps {
  post: Post;
  templates: TemplateImage[];
  selectedTemplates: TemplateImage[];
  currentImageIndex: number;
  onClose: () => void;
  onDownload: (imageUrl: string, filename: string) => Promise<void>;
  onTemplateToggle: (template: TemplateImage) => void;
  onImageIndexChange: (index: number) => void;
}

export function PostModal({
  post,
  templates,
  selectedTemplates,
  currentImageIndex,
  onClose,
  onDownload,
  onTemplateToggle,
  onImageIndexChange,
}: PostModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{post.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Image Gallery */}
          <div className="relative h-96 mb-6">
            <Image
              src={
                post.images[currentImageIndex]?.image_url || "/placeholder.jpg"
              }
              alt={post.title}
              fill
              className="object-contain rounded-lg"
            />
            {post.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                {post.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onImageIndexChange(index)}
                    className={`px-4 py-2 rounded-md transition-all ${
                      index === currentImageIndex
                        ? "bg-white text-gray-800 font-medium"
                        : "bg-gray-500/50 text-white hover:bg-gray-400/50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Post Details */}
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <div>
                  <p>
                    <span className="font-medium">Author:</span>{" "}
                    {post.author.name}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span> {post.type.name}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Country:</span>{" "}
                    {post.country.name}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Content</h3>
              <div
                className="bg-gray-700 p-4 rounded-lg text-gray-200 cursor-pointer"
                onClick={(e) => {
                  const text = post.content;
                  navigator.clipboard.writeText(text);
                  alert("Content copied to clipboard!");
                }}
              >
                {post.content}
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Templates</h3>
            <div className="grid grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => onTemplateToggle(template)}
                  className={`relative h-32 rounded-lg cursor-pointer overflow-hidden ${
                    selectedTemplates.some((t) => t.id === template.id)
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <Image
                    src={template.image_url}
                    alt={template.description}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Download Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() =>
                onDownload(
                  post.images[currentImageIndex].image_url,
                  `${post.title}.jpg`
                )
              }
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Download All Image
            </button>
            {/* {selectedTemplates.length > 0 && (
              <button
                onClick={() => {
                  selectedTemplates.forEach((template) => {
                    onDownload(
                      template.image_url,
                      `template-${template.id}.jpg`
                    );
                  });
                }}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Download Selected Templates ({selectedTemplates.length})
              </button>
            )} */}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
