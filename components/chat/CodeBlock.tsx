"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

export function CodeBlock({
  language,
  value,
}: {
  language: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative my-3 overflow-hidden rounded-xl border border-white/10">
      <div className="flex items-center justify-between bg-black/40 px-3 py-1.5 text-xs text-zinc-400">
        <span>{language || "text"}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/10 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={oneDark}
        customStyle={{ margin: 0, background: "#0d0d10", fontSize: "0.85rem" }}
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
