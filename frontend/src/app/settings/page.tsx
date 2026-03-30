"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ display_name: "", bio: "", avatar_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ display_name: user.display_name || "", bio: user.bio || "", avatar_url: user.avatar_url || "" });
  }, [user]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/users/me", form);
      await refreshUser();
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally { setSaving(false); }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-lg mx-auto px-6 py-10">
        <h1 className="font-display text-4xl font-semibold mb-8">Settings</h1>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Display name</label>
            <input
              type="text"
              value={form.display_name}
              onChange={set("display_name")}
              className="w-full bg-surface border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-fg transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={set("bio")}
              rows={4}
              className="w-full bg-surface border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-fg transition-colors resize-none"
              placeholder="Tell the world about yourself..."
            />
          </div>
          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Avatar URL</label>
            <input
              type="url"
              value={form.avatar_url}
              onChange={set("avatar_url")}
              className="w-full bg-surface border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-fg transition-colors"
              placeholder="https://..."
            />
          </div>
          {form.avatar_url && (
            <div className="w-16 h-16 rounded-full overflow-hidden border border-border">
              <img src={form.avatar_url} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-fg text-bg px-6 py-2.5 rounded-full text-sm hover:bg-accent transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted">
            Username: <span className="text-fg">@{user?.username}</span> · Cannot be changed.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
