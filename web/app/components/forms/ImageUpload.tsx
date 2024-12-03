import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { XMarkIcon,PlusIcon } from "@heroicons/react/24/solid";

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  maxFiles?: number;
  existingImages?: Array<{ id: number; image_url: string }>;
}

export function ImageUpload({
  onImagesSelected,
  maxFiles = 5,
  existingImages = [],
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [Uploaded, setUploaded] = useState<boolean>(false);
  const [Ismax, setIsmax] = useState<boolean>(false)
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const totalImages = previews.length + acceptedFiles.length;
      if (totalImages == maxFiles) {
        setIsmax(true);
      }
      if (totalImages > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }
      setUploaded(true);
      setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews((prev) => [...prev, ...newPreviews]);
      onImagesSelected(acceptedFiles);
    },
    [maxFiles, onImagesSelected, previews.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles,
  });

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    onImagesSelected(selectedFiles.filter((_, i) => i !== index));
    if (index==0) {
      setUploaded((prev)=>!prev)
    }
  };
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${Uploaded ? 'hidden' : 'visible'}
          ${
            isDragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-600 hover:border-gray-500"
          }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-300">
          {isDragActive
            ? "Drop the files here..."
            : "Drag 'n' drop images here, or click to select"}
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Maximum {maxFiles} files allowed
        </p>
      </div>

      <AnimatePresence>
        {(previews.length > 0 || existingImages.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {existingImages.map((image, index) => (
              <motion.div
                key={`existing-${image.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-square group"
              >
                <Image
                  src={image.image_url}
                  alt={`Existing image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full 
                    opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <XMarkIcon className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
            {previews.map((preview, index) => (
              <motion.div
                key={preview}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (existingImages.length + index) * 0.1 }}
                className="relative aspect-square group"
              >
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full 
                    opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <XMarkIcon className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
        {( Ismax ||
          <div {...getRootProps()} className={`flex outline rounded-lg justify-center ${Uploaded ?  "" : "hidden"}`}>
                          <PlusIcon className="h-10">
                            <input {...getInputProps()} />
                          </PlusIcon>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}