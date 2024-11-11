"use client";

import { Loading } from "@/app/components/common/Loading";
import { ErrorMessage } from "@/app/components/common/ErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/app/lib/api";
import PostForm from "@/app/components/forms/PostForm";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", params.id],
    queryFn: () => getPost(parseInt(params.id)),
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <PostForm initialData={post} />
    </main>
  );
}
