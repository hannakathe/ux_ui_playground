"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ElementStyles } from "@/hooks/use-playground-store";

interface CodePanelProps {
  styles: ElementStyles;
}

function generateReactCode(styles: ElementStyles): string {
  return `<div
  style={{
    width: ${styles.width},
    height: ${styles.height},
    padding: ${styles.padding},
    margin: ${styles.margin},
    borderRadius: ${styles.borderRadius},
    backgroundColor: "${styles.backgroundColor}",
    color: "${styles.textColor}",
    fontSize: ${styles.fontSize},
    fontWeight: ${styles.fontWeight},
    display: "${styles.display}",${
    styles.display === "flex"
      ? `
    flexDirection: "${styles.flexDirection}",
    justifyContent: "${styles.justifyContent}",
    alignItems: "${styles.alignItems}",
    gap: ${styles.gap},`
      : ""
  }${
    styles.borderWidth > 0
      ? `
    border: "${styles.borderWidth}px solid ${styles.borderColor}",`
      : ""
  }${
    styles.shadow !== "none"
      ? `
    boxShadow: "${styles.shadow}",`
      : ""
  }
    opacity: ${styles.opacity / 100},
  }}
>
  Content
</div>`;
}

function generateCssCode(styles: ElementStyles): string {
  let css = `.element {
  width: ${styles.width}px;
  height: ${styles.height}px;
  padding: ${styles.padding}px;
  margin: ${styles.margin}px;
  border-radius: ${styles.borderRadius}px;
  background-color: ${styles.backgroundColor};
  color: ${styles.textColor};
  font-size: ${styles.fontSize}px;
  font-weight: ${styles.fontWeight};
  display: ${styles.display};`;

  if (styles.display === "flex") {
    css += `
  flex-direction: ${styles.flexDirection};
  justify-content: ${styles.justifyContent};
  align-items: ${styles.alignItems};
  gap: ${styles.gap}px;`;
  }

  if (styles.borderWidth > 0) {
    css += `
  border: ${styles.borderWidth}px solid ${styles.borderColor};`;
  }

  if (styles.shadow !== "none") {
    css += `
  box-shadow: ${styles.shadow};`;
  }

  css += `
  opacity: ${styles.opacity / 100};
}`;

  return css;
}

function generateTailwindCode(styles: ElementStyles): string {
  const classes: string[] = [];
  classes.push(`w-[${styles.width}px]`);
  classes.push(`h-[${styles.height}px]`);
  classes.push(`p-[${styles.padding}px]`);
  if (styles.margin > 0) classes.push(`m-[${styles.margin}px]`);
  classes.push(`rounded-[${styles.borderRadius}px]`);
  classes.push(`bg-[${styles.backgroundColor}]`);
  classes.push(`text-[${styles.textColor}]`);
  classes.push(`text-[${styles.fontSize}px]`);
  if (styles.fontWeight >= 700) classes.push("font-bold");
  else if (styles.fontWeight >= 600) classes.push("font-semibold");
  else if (styles.fontWeight >= 500) classes.push("font-medium");
  classes.push(styles.display);
  if (styles.display === "flex") {
    if (styles.flexDirection === "column") classes.push("flex-col");
    const justifyMap: Record<string, string> = {
      "flex-start": "justify-start",
      center: "justify-center",
      "flex-end": "justify-end",
      "space-between": "justify-between",
      "space-around": "justify-around",
      "space-evenly": "justify-evenly",
    };
    classes.push(justifyMap[styles.justifyContent] || "justify-start");
    const alignMap: Record<string, string> = {
      "flex-start": "items-start",
      center: "items-center",
      "flex-end": "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    };
    classes.push(alignMap[styles.alignItems] || "items-start");
    classes.push(`gap-[${styles.gap}px]`);
  }
  if (styles.borderWidth > 0) {
    classes.push(`border-[${styles.borderWidth}px]`);
    classes.push(`border-[${styles.borderColor}]`);
  }
  if (styles.opacity < 100) classes.push(`opacity-[${styles.opacity / 100}]`);

  return `<div className="${classes.join(" ")}">\n  Content\n</div>`;
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
      className="absolute top-2 right-2 p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function CodePanel({ styles }: CodePanelProps) {
  const reactCode = generateReactCode(styles);
  const cssCode = generateCssCode(styles);
  const tailwindCode = generateTailwindCode(styles);

  return (
    <div className="h-full bg-zinc-950 border-t border-zinc-800">
      <Tabs defaultValue="react" className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 pt-2">
          <TabsList>
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="react" className="flex-1 overflow-auto px-4 pb-2 relative">
          <CopyButton text={reactCode} />
          <SyntaxHighlighter
            language="jsx"
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: "8px",
              fontSize: "12px",
              background: "#18181b",
            }}
          >
            {reactCode}
          </SyntaxHighlighter>
        </TabsContent>
        <TabsContent value="css" className="flex-1 overflow-auto px-4 pb-2 relative">
          <CopyButton text={cssCode} />
          <SyntaxHighlighter
            language="css"
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: "8px",
              fontSize: "12px",
              background: "#18181b",
            }}
          >
            {cssCode}
          </SyntaxHighlighter>
        </TabsContent>
        <TabsContent value="tailwind" className="flex-1 overflow-auto px-4 pb-2 relative">
          <CopyButton text={tailwindCode} />
          <SyntaxHighlighter
            language="jsx"
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: "8px",
              fontSize: "12px",
              background: "#18181b",
            }}
          >
            {tailwindCode}
          </SyntaxHighlighter>
        </TabsContent>
      </Tabs>
    </div>
  );
}
