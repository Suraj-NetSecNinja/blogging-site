"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Post } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import { ArrowRight, Feather } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user) router.push("/feed");
  }, [user, loading, router]);

  useEffect(() => {
    api.get("/posts?limit=8").then(res => {
      setPosts(res.data.items || []);
    }).catch(() => {}).finally(() => setPostsLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-fg border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-widest mb-6 fade-in-up">
              <Feather size={12} />
              <span>A place for ideas</span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl font-semibold leading-none tracking-tight text-fg mb-6 fade-in-up fade-in-up-delay-1">
              Where stories<br />
              <em className="text-accent not-italic">come alive.</em>
            </h1>
            <p className="text-lg text-muted leading-relaxed max-w-xl mb-8 fade-in-up fade-in-up-delay-2">
              Read and write ideas that matter. Follow the thinkers, makers, and storytellers
              who shape the way we see the world.
            </p>
            <div className="flex items-center gap-4 fade-in-up fade-in-up-delay-3">
              <Link
                href="/signup"
                className="bg-fg text-bg px-6 py-2.5 rounded-full text-sm hover:bg-accent transition-colors flex items-center gap-2"
              >
                Start writing <ArrowRight size={14} />
              </Link>
              <Link href="/explore" className="text-sm text-muted hover:text-fg transition-colors link-underline">
                Browse stories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-semibold">Latest stories</h2>
          <Link href="/explore" className="text-sm text-muted hover:text-fg transition-colors link-underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {postsLoading ? (
          <div>
            <div className="py-10 border-b border-border">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="skeleton aspect-[16/10] rounded-sm" />
                <div className="space-y-4 flex flex-col justify-center">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-8 w-full" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-2/3" />
                </div>
              </div>
            </div>
            {[1,2,3].map(i => <ArticleCardSkeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted mb-4">No stories yet.</p>
            <Link href="/signup" className="text-sm text-accent hover:underline">Be the first to write one →</Link>
          </div>
        ) : (
          <>
            {featured && <ArticleCard post={featured} featured />}
            {rest.map(post => <ArticleCard key={post.id} post={post} />)}
          </>
        )}
      </section>
    </div>
  );
}
