"use client";
import { useState, useRef, useEffect } from "react";
import { Share2, Link2, Check, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  url: string;
  title: string;
}

export default function ShareButton({ url, title }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-muted hover:border-accent hover:text-accent transition-all text-sm"
      >
        <Share2 size={15} />
        Share
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-bg border border-border rounded-md shadow-lg py-1 min-w-44 z-10">
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-fg hover:bg-surface transition-colors"
            onClick={() => setOpen(false)}>
            <ExternalLink size={14} /> Twitter / X
          </a>
          <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-fg hover:bg-surface transition-colors"
            onClick={() => setOpen(false)}>
            <ExternalLink size={14} /> LinkedIn
          </a>
          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-fg hover:bg-surface transition-colors"
            onClick={() => setOpen(false)}>
            <ExternalLink size={14} /> Facebook
          </a>
          <hr className="border-border my-1" />
          <button onClick={copyLink}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-fg hover:bg-surface transition-colors w-full">
            {copied ? <Check size={14} /> : <Link2 size={14} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
