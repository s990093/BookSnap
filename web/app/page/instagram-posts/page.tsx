"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as api from "@/app/lib/api";

interface InstagramPost {
  id: number;
  // 根據你的 Django 模型添加其他欄位
}

export default function InstagramPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated" && session?.token) {
      fetchPosts();
    }
  }, [status, session]);

  const fetchPosts = async () => {
    try {
      const data = await api.fetchInstagramPosts(session!.token!);
      setPosts(data);
    } catch (error) {
      setError("無法載入貼文");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Instagram 貼文</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4">
            {/* 根據你的貼文資料結構顯示內容 */}
            <p>Post ID: {post.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
