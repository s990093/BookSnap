import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "@/app/components/common/LazyLoadImage";
import { PostImage } from "@/app/types";

interface ImageSlideshowProps {
  images: PostImage[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onIndexChange: (index: number) => void;
  onDownload?: (imageUrl: string) => void;
}

export function ImageSlideshow({
  images,
  currentIndex,
  onNext,
  onPrev,
  onIndexChange,
  onDownload,
}: ImageSlideshowProps) {
  return (
    <div className="mt-6">
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <LazyLoadImage
              src={images[currentIndex].image}
              alt={images[currentIndex].altText || ""}
              className="object-cover w-full h-full"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={() => {
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            onIndexChange(newIndex);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            const newIndex = (currentIndex + 1) % images.length;
            onIndexChange(newIndex);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Download Button */}
        {onDownload && (
          <button
            onClick={() => onDownload(images[currentIndex].image)}
            className="absolute top-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnail Navigation */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => onIndexChange(index)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
              currentIndex === index
                ? "border-purple-500"
                : "border-transparent"
            }`}
          >
            <LazyLoadImage
              src={image.image}
              alt={image.altText || ""}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
