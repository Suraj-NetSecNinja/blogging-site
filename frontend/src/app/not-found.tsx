import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 text-center">
      <div>
        <p className="font-display text-8xl font-semibold text-border mb-4">404</p>
        <h1 className="font-display text-3xl font-semibold mb-2">Page not found</h1>
        <p className="text-muted text-sm mb-8">This story doesn&apos;t seem to exist.</p>
        <Link href="/" className="bg-fg text-bg px-6 py-2.5 rounded-full text-sm hover:bg-accent transition-colors">
          Back to home
        </Link>
      </div>
    </div>
  );
}
