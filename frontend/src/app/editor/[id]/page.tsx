"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { Post, EditorContent } from "@/lib/types";
import toast from "react-hot-toast";
import { Eye, EyeOff, Save, Trash2 } from "lucide-react";

const EditorComponent = dynamic(() => import("@/components/EditorComponent"), { ssr: false });

export default function EditArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [content, setContent] = useState<EditorContent>({ blocks: [] });
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get(`/posts/${id}`).then(res => {
      const p = res.data;
      setPost(p);
      setTitle(p.title);
      setSubtitle(p.subtitle || "");
      setCoverImageUrl(p.cover_image_url || "");
      setContent(p.content || { blocks: [] });
      setPublished(p.published);
    }).catch(() => router.push("/editor"))
    .finally(() => setLoading(false));
  }, [id, router]);

  const save = async (publish: boolean) => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const res = await api.patch(`/posts/${id}`, { title, subtitle, content, cover_image_url: coverImageUrl, published: publish });
      setPublished(publish);
      toast.success(publish ? "Article published!" : "Draft saved!");
      if (publish) router.push(`/blog/${res.data.slug}`);
    } catch {
      toast.error("Failed to save");
    } finally { setSaving(false); }
  };

  const deletePost = async () => {
    if (!confirm("Delete this article?")) return;
    try {
      await api.delete(`/posts/${id}`);
      toast.success("Article deleted");
      router.push("/feed");
    } catch { toast.error("Failed to delete"); }
  };

  if (loading) return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="skeleton h-10 w-2/3 mb-4" />
        <div className="skeleton h-6 w-1/2 mb-8" />
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-4 w-full" />)}
        </div>
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <span className="text-sm text-muted">Editing draft</span>
          <div className="flex items-center gap-3">
            <button onClick={deletePost} className="text-sm text-muted hover:text-accent transition-colors">
              <Trash2 size={14} />
            </button>
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors border border-border px-4 py-1.5 rounded-full disabled:opacity-60"
            >
              <Save size={13} />
              Save draft
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="flex items-center gap-1.5 bg-fg text-bg px-4 py-1.5 rounded-full text-sm hover:bg-accent transition-colors disabled:opacity-60"
            >
              <Eye size={13} />
              {published ? "Update" : "Publish"}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="url"
            value={coverImageUrl}
            onChange={e => setCoverImageUrl(e.target.value)}
            placeholder="Cover image URL (optional)"
            className="w-full bg-transparent text-sm text-muted border-0 focus:outline-none"
          />
        </div>

        {coverImageUrl && (
          <div className="aspect-[16/8] overflow-hidden rounded-sm mb-6 bg-surface">
            <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
          </div>
        )}

        <textarea
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent font-display text-4xl md:text-5xl font-semibold text-fg placeholder:text-fg/20 border-0 resize-none focus:outline-none mb-3 leading-tight"
          rows={2}
        />

        <input
          type="text"
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
          placeholder="Add a subtitle..."
          className="w-full bg-transparent text-xl text-muted placeholder:text-muted/40 border-0 focus:outline-none mb-8 pb-4 border-b border-border"
        />

        {!loading && (
          <EditorComponent
            key={id}
            data={content.blocks.length > 0 ? content : undefined}
            onChange={setContent}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
