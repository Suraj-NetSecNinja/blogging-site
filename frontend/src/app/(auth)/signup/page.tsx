"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", display_name: "" });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      await signup(form.username, form.email, form.password, form.display_name);
      toast.success("Account created!");
      router.push("/feed");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Signup failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-semibold mb-2">Join Prose</h1>
          <p className="text-muted text-sm">Share your voice with the world</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {[
            { key: "display_name", label: "Display name", type: "text", placeholder: "Jane Doe" },
            { key: "username", label: "Username", type: "text", placeholder: "janedoe" },
            { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            { key: "password", label: "Password", type: "password", placeholder: "Min. 8 characters" },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key as keyof typeof form]}
                onChange={set(field.key)}
                className="w-full bg-surface border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-fg transition-colors"
                placeholder={field.placeholder}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-fg text-bg py-2.5 rounded-full text-sm hover:bg-accent transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-fg hover:text-accent transition-colors link-underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
