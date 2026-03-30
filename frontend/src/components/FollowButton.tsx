"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  initialFollowing: boolean;
  onToggle?: (following: boolean) => void;
}

export default function FollowButton({ userId, initialFollowing, onToggle }: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const toggle = async () => {
    if (!user) { router.push("/login"); return; }
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post(`/users/${userId}/follow`);
      setFollowing(res.data.following);
      onToggle?.(res.data.following);
    } catch {
      toast.error("Failed to update follow");
    } finally {
      setLoading(false);
    }
  };

  if (user?.id === userId) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-sm px-5 py-1.5 rounded-full border transition-all ${
        following
          ? "border-fg text-fg hover:border-accent hover:text-accent"
          : "bg-fg text-bg hover:bg-accent border-fg hover:border-accent"
      }`}
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}
