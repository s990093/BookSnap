"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { postsApi } from "@/app/lib/api";
import { ImageUpload } from "./ImageUpload";
import { Post } from "@/app/types";
import { useRouter } from "next/navigation";
import { Loading } from "../common/Loading";

interface PostFormProps {
  initialData?: Post;
  postType?: number;
}

export default function PostForm({ initialData, postType }: PostFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData || {
      title: "",
      content: "",
      tag: "",
      type: postType || 1,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      images.forEach((image) => {
        formData.append("images", image);
      });

      if (initialData) {
        return postsApi.update(initialData.id, formData);
      }
      return postsApi.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/");
    },
  });

  const handleImageSelect = (files: File[]) => {
    setImages(files);
  };

  if (isSubmitting) return <Loading />;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 bg-gray-800 p-6 rounded-lg"
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
    >
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Images
        </label>
        <ImageUpload
          onImagesSelected={handleImageSelect}
          existingImages={initialData?.images}
          maxFiles={5}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Title</label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Content
        </label>
        <textarea
          {...register("content", { required: "Content is required" })}
          rows={6}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Tags</label>
        <input
          type="text"
          {...register("tag")}
          placeholder="Separate tags with commas"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {mutation.isPending ? "Saving..." : initialData ? "Update" : "Create"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>

      {mutation.isError && (
        <div className="text-red-500 text-sm mt-2">
          {(mutation.error as Error).message || "Something went wrong"}
        </div>
      )}
    </motion.form>
  );
}
