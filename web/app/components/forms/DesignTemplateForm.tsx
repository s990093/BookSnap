"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createTemplate, updateTemplate } from "@/app/lib/api";
import { ImageUpload } from "./ImageUpload";
import { TemplateImage } from "@/app/types";
import { useRouter } from "next/navigation";
import { Loading } from "../common/Loading";
import { LazyLoadImage } from "@/app/components/common/LazyLoadImage";

interface DesignTemplateFormProps {
  initialData?: TemplateImage;
}

export default function DesignTemplateForm({
  initialData,
}: DesignTemplateFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData || {
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append("description", data.description);
      if (image) {
        formData.append("image", image);
      }

      if (initialData) {
        return updateTemplate(initialData.id, formData);
      }
      return createTemplate(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      router.push("/");
    },
  });

  const handleImageSelect = (files: File[]) => {
    if (files.length > 0) {
      setImage(files[0]);
    }
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
          Template Image
        </label>
        <ImageUpload
          onImagesSelected={handleImageSelect}
          maxFiles={1}
          existingImages={
            initialData
              ? [{ id: initialData.id, image_url: initialData.image_url }]
              : []
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Description
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={4}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={mutation.isPending || (!image && !initialData)}
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
