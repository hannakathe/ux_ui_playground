"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, ChevronUp, ChevronDown, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CodeOutput } from "@/lib/code-generators";

interface CodeBlockProps {
  outputs: CodeOutput[];
  defaultExpanded?: boolean;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md bg-zinc-800/80 hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
      title="Copy code"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function CodeBlock({ outputs, defaultExpanded = false }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [maximized, setMaximized] = useState(false);

  if (outputs.length === 0) return null;

  const current = outputs[activeTab];

  return (
    <div
      className={cn(
        "border-t border-[var(--border)] bg-[var(--surface)] flex flex-col transition-all",
        maximized ? "fixed inset-0 z-50" : "",
        expanded ? (maximized ? "h-full" : "h-80") : "h-10"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-10 shrink-0 border-b border-[var(--border)]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--fg)] transition-colors mr-1"
          >
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
          {outputs.map((o, i) => (
            <button
              key={o.language}
              onClick={() => {
                setActiveTab(i);
                if (!expanded) setExpanded(true);
              }}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
                i === activeTab
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-[var(--muted)] hover:text-[var(--fg)]"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <CopyButton text={current.code} />
          <button
            onClick={() => setMaximized(!maximized)}
            className="p-1.5 rounded-md text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          >
            {maximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code */}
      {expanded && (
        <div className="flex-1 overflow-auto p-3">
          <SyntaxHighlighter
            language={current.syntaxLang}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: "8px",
              fontSize: "12px",
              background: "transparent",
              padding: "12px",
            }}
            wrapLongLines
          >
            {current.code}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}
