"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/feed");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-semibold mb-2">Welcome back</h1>
          <p className="text-muted text-sm">Sign in to continue your journey</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-fg transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-muted uppercase tracking-wide mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-fg transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-fg text-bg py-2.5 rounded-full text-sm hover:bg-accent transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          New to Prose?{" "}
          <Link href="/signup" className="text-fg hover:text-accent transition-colors link-underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
