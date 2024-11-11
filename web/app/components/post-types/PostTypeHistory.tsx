"use client";

import { useQuery } from "@tanstack/react-query";
import { getPostTypes } from "@/app/lib/api";
import { PostType } from "@/app/types";
import { AnimatedCard } from "@/app/components/common/AnimatedCard";
import { Loading } from "@/app/components/common/Loading";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function PostTypeHistory() {
  const { data: postTypes, isLoading } = useQuery<PostType[]>({
    queryKey: ["postTypes"],
    queryFn: getPostTypes,
  });

  const handleDelete = (e: React.MouseEvent, typeId: number) => {
    e.preventDefault();
    console.log("Delete post type:", typeId);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Post Types</h2>
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {postTypes?.map((type, index) => (
          <Link href={`/post-types/${type.id}`} key={type.id}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <AnimatedCard delay={index * 0.1}>
                <div className="space-y-2 relative">
                  <div className="absolute top-0 right-0">
                    <button
                      onClick={(e) => handleDelete(e, type.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </div>
                  <h3 className="font-semibold truncate">{type.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {type.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(type.created_at).toLocaleDateString()}
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
