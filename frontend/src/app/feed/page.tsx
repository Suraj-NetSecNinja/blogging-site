"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import api from "@/lib/api";
import { Post } from "@/lib/types";
import Link from "next/link";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const load = async (p: number) => {
    try {
      const res = await api.get(`/feed?page=${p}&limit=10`);
      if (p === 1) setPosts(res.data.items || []);
      else setPosts(prev => [...prev, ...(res.data.items || [])]);
      setHasNext(res.data.has_next);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(1); }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl font-semibold">Your feed</h1>
          <Link href="/explore" className="text-sm text-muted hover:text-fg transition-colors link-underline">
            Explore more
          </Link>
        </div>

        {loading ? (
          <div>{[1,2,3,4].map(i => <ArticleCardSkeleton key={i} />)}</div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted mb-2">Your feed is empty.</p>
            <p className="text-sm text-muted mb-6">Follow some writers to see their stories here.</p>
            <Link href="/explore" className="bg-fg text-bg px-6 py-2.5 rounded-full text-sm hover:bg-accent transition-colors">
              Discover writers
            </Link>
          </div>
        ) : (
          <>
            {posts.map(post => <ArticleCard key={post.id} post={post} />)}
            {hasNext && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => { setPage(p => p + 1); load(page + 1); }}
                  className="border border-border px-6 py-2.5 rounded-full text-sm text-muted hover:border-fg hover:text-fg transition-colors"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
