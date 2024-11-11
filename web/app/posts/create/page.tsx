"use client";

import { Suspense } from "react";
import { Loading } from "@/app/components/common/Loading";
import PostForm from "@/app/components/forms/PostForm";
import PostHistory from "@/app/components/posts/PostHistory";

export default function CreatePostPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <div className="flex gap-6">
        {/* Main content area (80%) */}
        <div className="w-4/5">
          <Suspense fallback={<Loading />}>
            <PostForm />
          </Suspense>
        </div>

        {/* Sidebar history (20%) */}
        <div className="w-1/5">
          <Suspense fallback={<Loading />}>
            <PostHistory />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
