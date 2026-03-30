"use client";
import { useEffect, useRef } from "react";
import type { OutputData } from "@editorjs/editorjs";

interface Props {
  data?: OutputData;
  onChange: (data: OutputData) => void;
  placeholder?: string;
}

export default function EditorComponent({ data, onChange, placeholder }: Props) {
  const editorRef = useRef<unknown>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initEditor = async () => {
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const Quote = (await import("@editorjs/quote")).default;

      const editor = new EditorJS({
        holder: holderRef.current!,
        data: data || undefined,
        placeholder: placeholder || "Tell your story...",
        tools: {
          header: {
            // @ts-ignore
            class: Header,
            config: { levels: [2, 3, 4], defaultLevel: 2 },
          },
          // @ts-ignore
          list: { class: List, inlineToolbar: true },
          // @ts-ignore
          quote: { class: Quote, inlineToolbar: true },
        },
        onChange: async () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const saved = await (editor as any).save();
          onChange(saved);
        },
      });
      editorRef.current = editor;
    };

    initEditor();

    return () => {
      if (editorRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (editorRef.current as any).destroy?.();
        editorRef.current = null;
        initialized.current = false;
      }
    };
  }, []);

  return (
    <div
      ref={holderRef}
      className="min-h-[400px] focus-within:outline-none"
    />
  );
}
