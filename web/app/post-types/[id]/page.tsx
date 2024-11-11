"use client";

import { Suspense } from "react";
import { Loading } from "@/app/components/common/Loading";
import { ErrorMessage } from "@/app/components/common/ErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { getPostType } from "@/app/lib/api";
import PostTypeForm from "@/app/components/forms/PostTypeForm";

export default function EditPostTypePage({
  params,
}: {
  params: { id: string };
}) {
  const {
    data: postType,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["postType", params.id],
    queryFn: () => getPostType(parseInt(params.id)),
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Post Type</h1>
      <div className="flex gap-6">
        <div className="w-4/5">
          <Suspense fallback={<Loading />}>
            <PostTypeForm initialData={postType} />
          </Suspense>
        </div>
        <div className="w-1/5">
          <Suspense fallback={<Loading />}>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Usage Statistics</h2>
              <p className="text-gray-400">
                Posts using this type: {postType?.posts_count || 0}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Created: {new Date(postType?.created_at).toLocaleDateString()}
              </p>
            </div>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
