"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createEvent, updateEvent } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { Loading } from "../common/Loading";
import { Event } from "@/app/types";

interface EventFormProps {
  initialData?: Event;
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
      location: "",
      date: "",
      time: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (initialData) {
        return updateEvent(initialData.id, data);
      }
      return createEvent(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push("/");
    },
  });

  if (isSubmitting) return <Loading />;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 bg-gray-800 p-6 rounded-lg"
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
    >
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

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Location
        </label>
        <input
          type="text"
          {...register("location", { required: "Location is required" })}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Date
          </label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Time
          </label>
          <input
            type="time"
            {...register("time", { required: "Time is required" })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
          {errors.time && (
            <p className="mt-1 text-sm text-red-500">{errors.time.message}</p>
          )}
        </div>
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
