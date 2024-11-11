"use client";

import { LazyLoadImage as BaseLazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion } from "framer-motion";

interface LazyLoadImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  effect?: "blur" | "opacity" | "black-and-white";
}

export function LazyLoadImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  effect = "blur",
}: LazyLoadImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={wrapperClassName}
    >
      <BaseLazyLoadImage
        src={src}
        alt={alt}
        effect={effect}
        className={className}
        wrapperClassName="w-full h-full"
        threshold={100}
      />
    </motion.div>
  );
}
