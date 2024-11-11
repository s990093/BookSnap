"use client";

import { Suspense } from "react";
import { Loading } from "@/app/components/common/Loading";
import PostTypeHistory from "@/app/components/post-types/PostTypeHistory";
import PostTypeForm from "@/app/components/forms/PostTypeForm";

export default function CreatePostTypePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add Post Type</h1>
      <div className="flex gap-6">
        <div className="w-4/5">
          <Suspense fallback={<Loading />}>
            <PostTypeForm />
          </Suspense>
        </div>
        <div className="w-1/5">
          <Suspense fallback={<Loading />}>
            <PostTypeHistory />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
