"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlaygroundShell } from "@/components/layout/playground-shell";
import { cn } from "@/lib/utils";
import type { CodeOutput } from "@/lib/code-generators";

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

  const colors = [
    "bg-indigo-500/80", "bg-purple-500/80", "bg-cyan-500/80", "bg-pink-500/80",
    "bg-amber-500/80", "bg-emerald-500/80", "bg-red-500/80", "bg-blue-500/80",
    "bg-orange-500/80", "bg-teal-500/80", "bg-rose-500/80", "bg-lime-500/80",
  ];

  const flexCSS = `display: flex;\nflex-direction: ${flexConfig.direction};\njustify-content: ${flexConfig.justify};\nalign-items: ${flexConfig.align};\nflex-wrap: ${flexConfig.wrap};\ngap: ${flexConfig.gap}px;`;
  const gridCSS = `display: grid;\ngrid-template-columns: repeat(${gridConfig.columns}, 1fr);\ngrid-template-rows: repeat(${gridConfig.rows}, 1fr);\ngap: ${gridConfig.gap}px;`;
  const cssCode = mode === "flexbox" ? flexCSS : gridCSS;
  const itemCount = mode === "flexbox" ? flexConfig.itemCount : gridConfig.itemCount;

  const codeOutputs: CodeOutput[] = [
    { language: "html", label: "HTML", syntaxLang: "html", code: `<div style="${cssCode.replace(/\n/g, " ")}">\n${Array.from({ length: itemCount }, (_, i) => `  <div>Item ${i + 1}</div>`).join("\n")}\n</div>` },
    { language: "css", label: "CSS", syntaxLang: "css", code: `.container {\n  ${cssCode.replace(/\n/g, "\n  ")}\n}` },
    { language: "javascript", label: "JavaScript", syntaxLang: "javascript", code: mode === "flexbox"
      ? `el.style.display = "flex";\nel.style.flexDirection = "${flexConfig.direction}";\nel.style.justifyContent = "${flexConfig.justify}";\nel.style.alignItems = "${flexConfig.align}";\nel.style.flexWrap = "${flexConfig.wrap}";\nel.style.gap = "${flexConfig.gap}px";`
      : `el.style.display = "grid";\nel.style.gridTemplateColumns = "repeat(${gridConfig.columns}, 1fr)";\nel.style.gridTemplateRows = "repeat(${gridConfig.rows}, 1fr)";\nel.style.gap = "${gridConfig.gap}px";`
    },
    { language: "react", label: "React", syntaxLang: "jsx", code: mode === "flexbox"
      ? `<div style={{ display: "flex", flexDirection: "${flexConfig.direction}", justifyContent: "${flexConfig.justify}", alignItems: "${flexConfig.align}", flexWrap: "${flexConfig.wrap}", gap: ${flexConfig.gap} }}>\n${Array.from({ length: itemCount }, (_, i) => `  <div>Item ${i + 1}</div>`).join("\n")}\n</div>`
      : `<div style={{ display: "grid", gridTemplateColumns: "repeat(${gridConfig.columns}, 1fr)", gridTemplateRows: "repeat(${gridConfig.rows}, 1fr)", gap: ${gridConfig.gap} }}>\n${Array.from({ length: itemCount }, (_, i) => `  <div>Item ${i + 1}</div>`).join("\n")}\n</div>`
    },
    { language: "tailwind", label: "Tailwind", syntaxLang: "jsx", code: mode === "flexbox"
      ? `<div className="flex${flexConfig.direction === "column" ? " flex-col" : ""}${flexConfig.wrap === "wrap" ? " flex-wrap" : ""} gap-[${flexConfig.gap}px] justify-${flexConfig.justify.replace("flex-", "")} items-${flexConfig.align.replace("flex-", "")}">\n${Array.from({ length: itemCount }, (_, i) => `  <div>Item ${i + 1}</div>`).join("\n")}\n</div>`
      : `<div className="grid grid-cols-${gridConfig.columns} grid-rows-${gridConfig.rows} gap-[${gridConfig.gap}px]">\n${Array.from({ length: itemCount }, (_, i) => `  <div>Item ${i + 1}</div>`).join("\n")}\n</div>`
    },
  ];

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

  const configUI = (
    <>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80 mb-3">Layout Mode</p>
        <div className="flex gap-1">
          {(["flexbox", "grid"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 py-2 text-sm rounded-lg transition-colors capitalize font-medium",
                mode === m ? "bg-indigo-600 text-white" : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--fg)]"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === "flexbox" ? (
        <div className="space-y-4">
          {[
            { label: "Direction", value: flexConfig.direction, key: "direction", options: [{ value: "row", label: "Row" }, { value: "column", label: "Column" }, { value: "row-reverse", label: "Row Reverse" }, { value: "column-reverse", label: "Column Reverse" }] },
            { label: "Justify Content", value: flexConfig.justify, key: "justify", options: [{ value: "flex-start", label: "Start" }, { value: "center", label: "Center" }, { value: "flex-end", label: "End" }, { value: "space-between", label: "Space Between" }, { value: "space-around", label: "Space Around" }, { value: "space-evenly", label: "Space Evenly" }] },
            { label: "Align Items", value: flexConfig.align, key: "align", options: [{ value: "flex-start", label: "Start" }, { value: "center", label: "Center" }, { value: "flex-end", label: "End" }, { value: "stretch", label: "Stretch" }, { value: "baseline", label: "Baseline" }] },
            { label: "Wrap", value: flexConfig.wrap, key: "wrap", options: [{ value: "nowrap", label: "No Wrap" }, { value: "wrap", label: "Wrap" }, { value: "wrap-reverse", label: "Wrap Reverse" }] },
          ].map((ctrl) => (
            <div key={ctrl.key} className="space-y-2">
              <label className="text-xs text-[var(--fg)] font-medium">{ctrl.label}</label>
              <Select value={ctrl.value} onValueChange={(v) => setFlexConfig((p) => ({ ...p, [ctrl.key]: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ctrl.options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs text-[var(--fg)] font-medium">Gap</label>
              <NumberInput value={flexConfig.gap} onChange={(v) => setFlexConfig((p) => ({ ...p, gap: v }))} max={48} />
            </div>
            <Slider value={[flexConfig.gap]} min={0} max={48} onValueChange={([v]) => setFlexConfig((p) => ({ ...p, gap: v }))} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs text-[var(--fg)] font-medium">Items</label>
              <NumberInput value={flexConfig.itemCount} onChange={(v) => setFlexConfig((p) => ({ ...p, itemCount: v }))} min={1} max={12} unit="" />
            </div>
            <Slider value={[flexConfig.itemCount]} min={1} max={12} onValueChange={([v]) => setFlexConfig((p) => ({ ...p, itemCount: v }))} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {[
            { label: "Columns", value: gridConfig.columns, key: "columns", max: 6 },
            { label: "Rows", value: gridConfig.rows, key: "rows", max: 6 },
            { label: "Gap", value: gridConfig.gap, key: "gap", max: 48 },
            { label: "Items", value: gridConfig.itemCount, key: "itemCount", max: 12 },
          ].map((ctrl) => (
            <div key={ctrl.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-[var(--fg)] font-medium">{ctrl.label}</label>
                <NumberInput value={ctrl.value} onChange={(v) => setGridConfig((p) => ({ ...p, [ctrl.key]: v }))} min={ctrl.key === "gap" ? 0 : 1} max={ctrl.max} unit={ctrl.key === "gap" ? "px" : ""} />
              </div>
              <Slider value={[ctrl.value]} min={ctrl.key === "gap" ? 0 : 1} max={ctrl.max} onValueChange={([v]) => setGridConfig((p) => ({ ...p, [ctrl.key]: v }))} />
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <PlaygroundShell configPanel={configUI} codeOutputs={codeOutputs}>
      <div className="flex-1 bg-[var(--bg)] flex items-center justify-center p-10 overflow-auto">
        <div
          className="w-full max-w-3xl min-h-[400px] bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6"
          style={containerStyle}
        >
          {Array.from({ length: itemCount }, (_, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
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
    </PlaygroundShell>
  );
}
