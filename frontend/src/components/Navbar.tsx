"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { PenLine, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isEditor = pathname?.startsWith("/editor");

  return (
    <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="font-display text-2xl font-semibold tracking-tight text-fg">
            Prose
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
          <Link href="/explore" className="text-sm text-muted hover:text-fg transition-colors link-underline">
            Explore
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/feed" className="text-sm text-muted hover:text-fg transition-colors link-underline">
                    Feed
                  </Link>
                  <Link
                    href="/editor"
                    className="flex items-center gap-1.5 text-sm text-fg hover:text-accent transition-colors"
                  >
                    <PenLine size={15} />
                    Write
                  </Link>
                  <Link
                    href={`/user/${user.username}`}
                    className="w-8 h-8 rounded-full bg-surface border border-border overflow-hidden flex items-center justify-center hover:border-accent transition-colors"
                  >
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-medium text-muted">
                        {(user.display_name || user.username).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm text-muted hover:text-fg transition-colors link-underline"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-muted hover:text-fg transition-colors link-underline">
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm bg-fg text-bg px-4 py-1.5 rounded-full hover:bg-accent transition-colors"
                  >
                    Get started
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-muted hover:text-fg"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-bg border-b border-border px-6 py-4 flex flex-col gap-4">
          <Link href="/explore" className="text-sm" onClick={() => setMenuOpen(false)}>Explore</Link>
          {user ? (
            <>
              <Link href="/feed" className="text-sm" onClick={() => setMenuOpen(false)}>Feed</Link>
              <Link href="/editor" className="text-sm" onClick={() => setMenuOpen(false)}>Write</Link>
              <Link href={`/user/${user.username}`} className="text-sm" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button className="text-sm text-left text-muted" onClick={() => { logout(); setMenuOpen(false); }}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link href="/signup" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Get started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
