import React from "react";
import { EditorContent } from "@/lib/types";

export default function EditorRenderer({ data }: { data: EditorContent }) {
  if (!data?.blocks) return null;

  return (
    <div className="article-content">
      {data.blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={index}
                dangerouslySetInnerHTML={{ __html: block.data.text as string }}
              />
            );
          case "header": {
            const level = (block.data.level as number) || 2;
            const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
            return <Tag key={index}>{block.data.text as string}</Tag>;
          }
          case "list": {
            const Tag = block.data.style === "ordered" ? "ol" : "ul";
            return (
              <Tag key={index}>
                {(block.data.items as string[]).map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </Tag>
            );
          }
          case "quote":
            return (
              <blockquote key={index}>
                <p>{block.data.text as string}</p>
                {block.data.caption != null && <cite>{block.data.caption as string}</cite>}
              </blockquote>
            );
          case "image":
            return (
              <img
                key={index}
                src={block.data.url as string}
                alt={(block.data.caption as string) || ""}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
