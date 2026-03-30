import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditorRenderer from "@/components/EditorRenderer";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";
import { Clock } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchPost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/posts/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.subtitle || post.title,
    openGraph: {
      title: post.title,
      description: post.subtitle,
      images: post.cover_image_url ? [post.cover_image_url] : [],
      type: "article",
      authors: [post.author?.display_name || post.author?.username],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.subtitle,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`;
  const authorName = post.author?.display_name || post.author?.username;
  const publishDate = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Cover image */}
      {post.cover_image_url && (
        <div className="aspect-[16/8] overflow-hidden rounded-sm mb-8">
          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="font-display text-5xl md:text-6xl font-semibold leading-tight text-fg mb-3">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-xl text-muted leading-relaxed mb-6">{post.subtitle}</p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y border-border">
          <div className="flex items-center gap-3">
            <Link href={`/user/${post.author?.username}`} className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-surface border border-border overflow-hidden">
                {post.author?.avatar_url ? (
                  <img src={post.author.avatar_url} alt={authorName} className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-sm text-muted">
                    {authorName?.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm font-medium group-hover:text-accent transition-colors">{authorName}</div>
                <div className="text-xs text-muted">{publishDate}</div>
              </div>
            </Link>
            {post.author?.id && (
              <FollowButton userId={post.author.id} initialFollowing={false} />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Clock size={12} />
            <span>{post.reading_time_minutes} min read</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <EditorRenderer data={post.content} />

      {/* Actions */}
      <div className="flex items-center gap-3 mt-10 pt-6 border-t border-border">
        <LikeButton postId={post.id} initialCount={post.like_count} initialLiked={post.liked_by_me} />
        <ShareButton url={postUrl} title={post.title} />
      </div>

      {/* Author bio */}
      <div className="mt-10 p-6 bg-surface border border-border rounded-sm">
        <Link href={`/user/${post.author?.username}`} className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-bg border border-border overflow-hidden">
            {post.author?.avatar_url ? (
              <img src={post.author.avatar_url} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-base text-muted">
                {authorName?.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium hover:text-accent transition-colors">{authorName}</div>
            <div className="text-xs text-muted">@{post.author?.username}</div>
          </div>
        </Link>
        {post.author?.bio && <p className="text-sm text-muted leading-relaxed">{post.author.bio}</p>}
      </div>

      {/* Comments */}
      <CommentSection postId={post.id} />
    </div>
  );
}
