"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Comment } from "@/lib/types";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const load = async () => {
    try {
      const res = await api.get(`/posts/${postId}/comments`);
      setComments(res.data.items || res.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${postId}/comments`, { body });
      setComments(prev => [...prev, res.data]);
      setBody("");
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to post comment");
    } finally { setSubmitting(false); }
  };

  const deleteComment = async (id: string) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments(prev => prev.filter(c => c.id !== id));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h3 className="font-display text-2xl font-semibold mb-6">
        Responses <span className="text-muted text-lg font-normal">({comments.length})</span>
      </h3>

      {user ? (
        <form onSubmit={submit} className="mb-8">
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-sm resize-none focus:outline-none focus:border-fg transition-colors min-h-[100px]"
            required
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !body.trim()}
              className="bg-fg text-bg px-5 py-2 text-sm rounded-full hover:bg-accent transition-colors disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post response"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-surface border border-border rounded-sm text-sm text-muted">
          <Link href="/login" className="text-fg hover:text-accent transition-colors">Sign in</Link> to leave a response.
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="flex gap-3">
              <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton w-32 h-3" />
                <div className="skeleton w-full h-3" />
                <div className="skeleton w-2/3 h-3" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted text-sm">No responses yet. Be the first to share your thoughts.</p>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <Link href={`/user/${comment.user.username}`} className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-surface border border-border overflow-hidden">
                  {comment.user.avatar_url ? (
                    <img src={comment.user.avatar_url} alt={comment.user.display_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-xs text-muted">
                      {comment.user.display_name.charAt(0)}
                    </span>
                  )}
                </div>
              </Link>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/user/${comment.user.username}`} className="text-sm font-medium hover:text-accent transition-colors">
                      {comment.user.display_name || comment.user.username}
                    </Link>
                    <span className="text-xs text-muted">{formatDate(comment.created_at)}</span>
                  </div>
                  {user?.username === comment.user.username && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-muted hover:text-accent transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-fg/80">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
