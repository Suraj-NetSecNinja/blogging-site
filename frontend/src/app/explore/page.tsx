"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Post } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import { Search } from "lucide-react";

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const load = useCallback(async (q: string, p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "10" });
      if (q) params.set("search", q);
      const res = await api.get(`/posts?${params}`);
      if (p === 1) setPosts(res.data.items || []);
      else setPosts(prev => [...prev, ...(res.data.items || [])]);
      setHasNext(res.data.has_next);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(search, 1); setPage(1); }, [search, load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(query);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold mb-4">Explore</h1>
        <form onSubmit={handleSearch} className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search stories, topics, writers..."
            className="w-full bg-surface border border-border rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-fg transition-colors"
          />
        </form>
      </div>

      {search && (
        <p className="text-sm text-muted mb-4">
          Results for <span className="text-fg">&ldquo;{search}&rdquo;</span>
          <button onClick={() => { setSearch(""); setQuery(""); }} className="ml-2 text-accent hover:underline">clear</button>
        </p>
      )}

      {loading && page === 1 ? (
        <div>{[1,2,3,4].map(i => <ArticleCardSkeleton key={i} />)}</div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted">No stories found{search ? ` for "${search}"` : ""}.</p>
        </div>
      ) : (
        <>
          {posts.map(post => <ArticleCard key={post.id} post={post} />)}
          {hasNext && (
            <div className="mt-8 text-center">
              <button
                onClick={() => { const next = page + 1; setPage(next); load(search, next); }}
                className="border border-border px-6 py-2.5 rounded-full text-sm text-muted hover:border-fg hover:text-fg transition-colors"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
