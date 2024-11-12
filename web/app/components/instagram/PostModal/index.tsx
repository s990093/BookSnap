import { Post, TemplateImage } from "@/app/types";
import { motion, AnimatePresence } from "framer-motion";
import { ImageSlideshow } from "./ImageSlideshow";
import { TemplateSection } from "./TemplateSection";
import { CaptionSection } from "./CaptionSection";

interface PostModalProps {
  post: Post;
  templates: TemplateImage[];
  selectedTemplates: TemplateImage[];
  currentImageIndex: number;
  onClose: () => void;
  onDownload: (imageUrl: string) => void;
  onBatchDownload: () => void;
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
  onBatchDownload,
  onTemplateToggle,
  onImageIndexChange,
}: PostModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        {/* Modal Header */}
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-purple-400">{post.title}</h2>
            <span className="text-sm text-gray-400">Type: {post.type}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            Close
          </button>
        </div>

        <CaptionSection content={post.content} />

        <ImageSlideshow
          images={post.images}
          currentIndex={currentImageIndex}
          onIndexChange={onImageIndexChange}
          onDownload={onDownload}
          onNext={() => onImageIndexChange(currentImageIndex + 1)}
          onPrev={() => onImageIndexChange(currentImageIndex - 1)}
        />

        <TemplateSection
          templates={templates}
          selectedTemplates={selectedTemplates}
          onTemplateToggle={onTemplateToggle}
        />

        {/* Batch Download Button */}
        {selectedTemplates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex justify-center"
          >
            <button
              onClick={onBatchDownload}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Download All ({selectedTemplates.length + 1} images)</span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
