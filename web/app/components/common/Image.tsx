"use client";

import NextImage from "next/image";
import { useState } from "react";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Image({
  src,
  alt,
  className,
  width,
  height,
  priority,
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // 處理圖片路徑
  const imageUrl = src.startsWith("http")
    ? src
    : `${process.env.NEXT_PUBLIC_MEDIA_URL}${src}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <NextImage
        src={imageUrl}
        alt={alt}
        width={width || 500}
        height={height || 300}
        priority={priority}
        className={`
          duration-700 ease-in-out
          ${
            isLoading
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          }
        `}
        onLoadingComplete={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}
    </div>
  );
}
