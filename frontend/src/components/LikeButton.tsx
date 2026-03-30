"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
}

export default function LikeButton({ postId, initialCount, initialLiked }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const toggle = async () => {
    if (!user) { router.push("/login"); return; }
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post(`/posts/${postId}/like`);
      setLiked(res.data.liked);
      setCount(res.data.like_count);
    } catch {
      toast.error("Failed to update like");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm ${
        liked
          ? "bg-accent border-accent text-bg"
          : "border-border text-muted hover:border-accent hover:text-accent"
      }`}
    >
      <Heart size={15} fill={liked ? "currentColor" : "none"} />
      <span>{count}</span>
    </button>
  );
}
