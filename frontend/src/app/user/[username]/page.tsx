"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import FollowButton from "@/components/FollowButton";
import { Post } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { Settings } from "lucide-react";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"published" | "drafts">("published");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get(`/users/${username}`);
        setProfile(profileRes.data);
      } catch {
        setProfile(null);
      }
      try {
        const postsRes = await api.get(`/posts?author=${username}&limit=20`);
        setPosts(postsRes.data.items || []);
      } catch {
        setPosts([]);
      }
      // Fetch drafts if viewing own profile
      if (currentUser?.username === username) {
        try {
          const draftsRes = await api.get("/drafts?limit=20");
          setDrafts(draftsRes.data.items || []);
        } catch {
          setDrafts([]);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [username, currentUser]);

  if (loading) return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-start gap-4 mb-8">
        <div className="skeleton w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-6 w-40" />
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-4 w-full" />
        </div>
      </div>
      {[1,2,3].map(i => <ArticleCardSkeleton key={i} />)}
    </div>
  );

  if (!profile) return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <p className="text-muted">User not found.</p>
    </div>
  );

  const name = (profile.display_name as string) || (profile.username as string);
  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Profile header */}
      <div className="flex items-start justify-between gap-4 mb-8 pb-8 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-surface border border-border overflow-hidden flex-shrink-0">
            {(profile.avatar_url as string) ? (
              <img src={profile.avatar_url as string} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-2xl font-display text-muted">
                {name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">{name}</h1>
            <p className="text-sm text-muted mb-2">@{profile.username as string}</p>
            {(profile.bio as string) && (
              <p className="text-sm text-muted/80 max-w-md leading-relaxed">{profile.bio as string}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted">
              <span><strong className="text-fg">{(profile.post_count as number) || 0}</strong> stories</span>
              <span><strong className="text-fg">{(profile.follower_count as number) || 0}</strong> followers</span>
              <span><strong className="text-fg">{(profile.following_count as number) || 0}</strong> following</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOwnProfile ? (
            <Link href="/settings" className="flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors border border-border px-3 py-1.5 rounded-full">
              <Settings size={13} /> Edit profile
            </Link>
          ) : (
            <FollowButton userId={profile.id as string} initialFollowing={false} />
          )}
        </div>
      </div>

      {isOwnProfile ? (
        <div className="flex items-center gap-6 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("published")}
            className={`pb-3 text-sm font-medium transition-colors ${activeTab === "published" ? "text-fg border-b-2 border-fg" : "text-muted hover:text-fg"}`}
          >
            Published ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("drafts")}
            className={`pb-3 text-sm font-medium transition-colors ${activeTab === "drafts" ? "text-fg border-b-2 border-fg" : "text-muted hover:text-fg"}`}
          >
            Drafts ({drafts.length})
          </button>
        </div>
      ) : (
        <h2 className="font-display text-2xl font-semibold mb-6">Stories</h2>
      )}

      {activeTab === "published" ? (
        posts.length === 0 ? (
          <p className="text-muted text-sm">No published stories yet.</p>
        ) : (
          posts.map(post => <ArticleCard key={post.id} post={post} />)
        )
      ) : (
        drafts.length === 0 ? (
          <p className="text-muted text-sm">No drafts.</p>
        ) : (
          drafts.map(post => (
            <div key={post.id} onClick={() => router.push(`/editor/${post.id}`)} className="cursor-pointer">
              <ArticleCard post={post} />
            </div>
          ))
        )
      )}
    </div>
  );
}
