import Link from "next/link";
import { Heart, Clock, MessageCircle } from "lucide-react";
import { Post } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface Props {
  post: Post;
  featured?: boolean;
}

export default function ArticleCard({ post, featured = false }: Props) {
  if (featured) {
    return (
      <article className="group grid md:grid-cols-2 gap-8 py-10 border-b border-border">
        {post.cover_image_url && (
          <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-sm aspect-[16/10] bg-surface">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        )}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <Link href={`/user/${post.author.username}`} className="flex items-center gap-2 group/author">
              <div className="w-7 h-7 rounded-full bg-surface border border-border overflow-hidden flex-shrink-0">
                {post.author.avatar_url ? (
                  <img src={post.author.avatar_url} alt={post.author.display_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-xs text-muted">
                    {post.author.display_name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="text-sm text-muted group-hover/author:text-fg transition-colors">
                {post.author.display_name || post.author.username}
              </span>
            </Link>
            <span className="text-muted text-xs">·</span>
            <span className="text-xs text-muted">{formatDate(post.created_at)}</span>
          </div>
          <Link href={`/blog/${post.slug}`}>
            <h2 className="font-display text-3xl font-semibold text-fg leading-tight mb-2 group-hover:text-accent transition-colors">
              {post.title}
            </h2>
          </Link>
          {post.subtitle && (
            <p className="text-muted text-base leading-relaxed mb-4 line-clamp-3">{post.subtitle}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1"><Clock size={12} />{post.reading_time_minutes} min</span>
            <span className="flex items-center gap-1"><Heart size={12} />{post.like_count}</span>
            <span className="flex items-center gap-1"><MessageCircle size={12} />{post.comment_count}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group py-6 border-b border-border flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/user/${post.author.username}`} className="flex items-center gap-1.5 group/author">
            <div className="w-5 h-5 rounded-full bg-surface border border-border overflow-hidden flex-shrink-0">
              {post.author.avatar_url ? (
                <img src={post.author.avatar_url} alt={post.author.display_name} className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-[9px] text-muted">
                  {post.author.display_name.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-xs text-muted group-hover/author:text-fg transition-colors">
              {post.author.display_name || post.author.username}
            </span>
          </Link>
          <span className="text-muted text-xs">·</span>
          <span className="text-xs text-muted">{formatDate(post.created_at)}</span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-display text-xl font-semibold text-fg leading-snug mb-1 group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        {post.subtitle && (
          <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-3">{post.subtitle}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1"><Clock size={11} />{post.reading_time_minutes} min</span>
          <span className="flex items-center gap-1"><Heart size={11} />{post.like_count}</span>
          <span className="flex items-center gap-1"><MessageCircle size={11} />{post.comment_count}</span>
        </div>
      </div>
      {post.cover_image_url && (
        <Link href={`/blog/${post.slug}`} className="flex-shrink-0 w-24 h-20 md:w-32 md:h-24 overflow-hidden rounded-sm bg-surface">
          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
      )}
    </article>
  );
}
