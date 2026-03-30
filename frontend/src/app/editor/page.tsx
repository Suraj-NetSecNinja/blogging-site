"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { EditorContent } from "@/lib/types";
import toast from "react-hot-toast";
import { Eye, EyeOff, Save } from "lucide-react";

const EditorComponent = dynamic(() => import("@/components/EditorComponent"), { ssr: false });

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [content, setContent] = useState<EditorContent>({ blocks: [] });
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const save = async (publish: boolean) => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const res = await api.post("/posts", {
        title, subtitle, content,
        cover_image_url: coverImageUrl,
        published: publish,
      });
      toast.success(publish ? "Article published!" : "Draft saved!");
      router.push(publish ? `/blog/${res.data.slug}` : `/editor/${res.data.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to save";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <span className="text-sm text-muted">New story</span>
          <div className="flex items-center gap-3">
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
              Publish
            </button>
          </div>
        </div>

        {/* Cover image URL */}
        <div className="mb-4">
          <input
            type="url"
            value={coverImageUrl}
            onChange={e => setCoverImageUrl(e.target.value)}
            placeholder="Cover image URL (optional)"
            className="w-full bg-transparent text-sm text-muted border-0 focus:outline-none placeholder:text-muted/50"
          />
        </div>

        {coverImageUrl && (
          <div className="aspect-[16/8] overflow-hidden rounded-sm mb-6 bg-surface">
            <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Title */}
        <textarea
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent font-display text-4xl md:text-5xl font-semibold text-fg placeholder:text-fg/20 border-0 resize-none focus:outline-none mb-3 leading-tight"
          rows={2}
          style={{ minHeight: "auto", overflow: "hidden" }}
          onInput={e => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
        />

        {/* Subtitle */}
        <input
          type="text"
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
          placeholder="Add a subtitle..."
          className="w-full bg-transparent text-xl text-muted placeholder:text-muted/40 border-0 focus:outline-none mb-8 pb-4 border-b border-border"
        />

        {/* Body editor */}
        <EditorComponent
          data={content.blocks.length > 0 ? content : undefined}
          onChange={setContent}
          placeholder="Tell your story..."
        />
      </div>
    </ProtectedRoute>
  );
}
