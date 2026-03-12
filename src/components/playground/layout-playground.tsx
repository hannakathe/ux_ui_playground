"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type LayoutMode = "flexbox" | "grid";

interface FlexConfig {
  direction: string;
  justify: string;
  align: string;
  wrap: string;
  gap: number;
  itemCount: number;
}

interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
  itemCount: number;
}

export function LayoutPlayground() {
  const [mode, setMode] = useState<LayoutMode>("flexbox");
  const [flexConfig, setFlexConfig] = useState<FlexConfig>({
    direction: "row",
    justify: "flex-start",
    align: "stretch",
    wrap: "nowrap",
    gap: 12,
    itemCount: 5,
  });
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    columns: 3,
    rows: 2,
    gap: 12,
    itemCount: 6,
  });
  const [copied, setCopied] = useState(false);

  const colors = [
    "bg-indigo-500/80",
    "bg-purple-500/80",
    "bg-cyan-500/80",
    "bg-pink-500/80",
    "bg-amber-500/80",
    "bg-emerald-500/80",
    "bg-red-500/80",
    "bg-blue-500/80",
    "bg-orange-500/80",
    "bg-teal-500/80",
    "bg-rose-500/80",
    "bg-lime-500/80",
  ];

  const generateFlexCSS = () => `display: flex;
flex-direction: ${flexConfig.direction};
justify-content: ${flexConfig.justify};
align-items: ${flexConfig.align};
flex-wrap: ${flexConfig.wrap};
gap: ${flexConfig.gap}px;`;

  const generateGridCSS = () => `display: grid;
grid-template-columns: repeat(${gridConfig.columns}, 1fr);
grid-template-rows: repeat(${gridConfig.rows}, 1fr);
gap: ${gridConfig.gap}px;`;

  const cssCode = mode === "flexbox" ? generateFlexCSS() : generateGridCSS();
  const itemCount = mode === "flexbox" ? flexConfig.itemCount : gridConfig.itemCount;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerStyle: React.CSSProperties =
    mode === "flexbox"
      ? {
          display: "flex",
          flexDirection: flexConfig.direction as React.CSSProperties["flexDirection"],
          justifyContent: flexConfig.justify,
          alignItems: flexConfig.align,
          flexWrap: flexConfig.wrap as React.CSSProperties["flexWrap"],
          gap: `${flexConfig.gap}px`,
        }
      : {
          display: "grid",
          gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
          gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
          gap: `${gridConfig.gap}px`,
        };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Controls */}
      <div className="w-64 bg-zinc-950 border-r border-zinc-800 overflow-y-auto p-4 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            Layout Mode
          </p>
          <div className="flex gap-1">
            {(["flexbox", "grid"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "flex-1 py-1.5 text-sm rounded-md transition-colors capitalize",
                  mode === m
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {mode === "flexbox" ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Direction</label>
              <Select
                value={flexConfig.direction}
                onValueChange={(v) =>
                  setFlexConfig((p) => ({ ...p, direction: v }))
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">Row</SelectItem>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="row-reverse">Row Reverse</SelectItem>
                  <SelectItem value="column-reverse">Column Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Justify Content</label>
              <Select
                value={flexConfig.justify}
                onValueChange={(v) =>
                  setFlexConfig((p) => ({ ...p, justify: v }))
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex-start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="flex-end">End</SelectItem>
                  <SelectItem value="space-between">Space Between</SelectItem>
                  <SelectItem value="space-around">Space Around</SelectItem>
                  <SelectItem value="space-evenly">Space Evenly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Align Items</label>
              <Select
                value={flexConfig.align}
                onValueChange={(v) =>
                  setFlexConfig((p) => ({ ...p, align: v }))
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex-start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="flex-end">End</SelectItem>
                  <SelectItem value="stretch">Stretch</SelectItem>
                  <SelectItem value="baseline">Baseline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Wrap</label>
              <Select
                value={flexConfig.wrap}
                onValueChange={(v) =>
                  setFlexConfig((p) => ({ ...p, wrap: v }))
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nowrap">No Wrap</SelectItem>
                  <SelectItem value="wrap">Wrap</SelectItem>
                  <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs text-zinc-400">Gap</label>
                <span className="text-xs text-zinc-500 font-mono">{flexConfig.gap}px</span>
              </div>
              <Slider
                value={[flexConfig.gap]}
                min={0}
                max={48}
                onValueChange={([v]) =>
                  setFlexConfig((p) => ({ ...p, gap: v }))
                }
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs text-zinc-400">Items</label>
                <span className="text-xs text-zinc-500 font-mono">{flexConfig.itemCount}</span>
              </div>
              <Slider
                value={[flexConfig.itemCount]}
                min={1}
                max={12}
                onValueChange={([v]) =>
                  setFlexConfig((p) => ({ ...p, itemCount: v }))
                }
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs text-zinc-400">Columns</label>
                <span className="text-xs text-zinc-500 font-mono">{gridConfig.columns}</span>
              </div>
              <Slider
                value={[gridConfig.columns]}
                min={1}
                max={6}
                onValueChange={([v]) =>
                  setGridConfig((p) => ({ ...p, columns: v }))
                }
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs text-zinc-400">Rows</label>
                <span className="text-xs text-zinc-500 font-mono">{gridConfig.rows}</span>
              </div>
              <Slider
                value={[gridConfig.rows]}
                min={1}
                max={6}
                onValueChange={([v]) =>
                  setGridConfig((p) => ({ ...p, rows: v }))
                }
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs text-zinc-400">Gap</label>
                <span className="text-xs text-zinc-500 font-mono">{gridConfig.gap}px</span>
              </div>
              <Slider
                value={[gridConfig.gap]}
                min={0}
                max={48}
                onValueChange={([v]) =>
                  setGridConfig((p) => ({ ...p, gap: v }))
                }
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs text-zinc-400">Items</label>
                <span className="text-xs text-zinc-500 font-mono">{gridConfig.itemCount}</span>
              </div>
              <Slider
                value={[gridConfig.itemCount]}
                min={1}
                max={12}
                onValueChange={([v]) =>
                  setGridConfig((p) => ({ ...p, itemCount: v }))
                }
              />
            </div>
          </div>
        )}

        {/* Code output */}
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            CSS Output
          </p>
          <button
            onClick={copyCode}
            className="absolute top-0 right-0 p-1 rounded text-zinc-500 hover:text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <SyntaxHighlighter
            language="css"
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: "8px",
              fontSize: "11px",
              background: "#18181b",
            }}
          >
            {cssCode}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 bg-zinc-900 flex items-center justify-center p-8">
        <div
          className="w-full max-w-3xl min-h-[400px] bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          style={containerStyle}
        >
          {Array.from({ length: itemCount }, (_, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-lg flex items-center justify-center text-white text-sm font-medium min-w-[60px] min-h-[60px]",
                colors[i % colors.length]
              )}
              style={{
                width: mode === "flexbox" ? (flexConfig.direction.includes("column") ? "100%" : undefined) : undefined,
                height: mode === "flexbox" ? (flexConfig.direction.includes("column") ? undefined : "60px") : "60px",
                padding: "16px",
              }}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
