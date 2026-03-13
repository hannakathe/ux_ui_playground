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
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import type { CodeOutput } from "@/lib/code-generators";

interface GridItem {
  colSpan: number;
  rowSpan: number;
  color: string;
}

const defaultColors = [
  "bg-indigo-500/70",
  "bg-purple-500/70",
  "bg-cyan-500/70",
  "bg-pink-500/70",
  "bg-amber-500/70",
  "bg-emerald-500/70",
  "bg-rose-500/70",
  "bg-blue-500/70",
  "bg-orange-500/70",
];

export function GridPlayground() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(12);
  const [autoFlow, setAutoFlow] = useState("row");
  const [itemCount, setItemCount] = useState(6);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [items, setItems] = useState<GridItem[]>(
    Array.from({ length: 12 }, (_, i) => ({
      colSpan: 1,
      rowSpan: 1,
      color: defaultColors[i % defaultColors.length],
    }))
  );

  const updateItem = (index: number, key: keyof GridItem, value: number | string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const itemChildren = Array.from({ length: itemCount }, (_, i) => `  <div>Item ${i + 1}</div>`).join("\n");

  const codeOutputs: CodeOutput[] = [
    {
      language: "html",
      label: "HTML",
      syntaxLang: "html",
      code: `<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); grid-template-rows: repeat(${rows}, 1fr); gap: ${gap}px; grid-auto-flow: ${autoFlow};">\n${itemChildren}\n</div>`,
    },
    {
      language: "css",
      label: "CSS",
      syntaxLang: "css",
      code: `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(${columns}, 1fr);\n  grid-template-rows: repeat(${rows}, 1fr);\n  gap: ${gap}px;\n  grid-auto-flow: ${autoFlow};\n}`,
    },
    {
      language: "javascript",
      label: "JavaScript",
      syntaxLang: "javascript",
      code: `const el = document.querySelector('.grid-container');\nel.style.display = "grid";\nel.style.gridTemplateColumns = "repeat(${columns}, 1fr)";\nel.style.gridTemplateRows = "repeat(${rows}, 1fr)";\nel.style.gap = "${gap}px";\nel.style.gridAutoFlow = "${autoFlow}";`,
    },
    {
      language: "react",
      label: "React",
      syntaxLang: "jsx",
      code: `<div\n  style={{\n    display: "grid",\n    gridTemplateColumns: "repeat(${columns}, 1fr)",\n    gridTemplateRows: "repeat(${rows}, 1fr)",\n    gap: ${gap},\n    gridAutoFlow: "${autoFlow}",\n  }}\n>\n${itemChildren}\n</div>`,
    },
    {
      language: "tailwind",
      label: "Tailwind",
      syntaxLang: "jsx",
      code: `<div className="grid grid-cols-${columns} grid-rows-${rows} gap-[${gap}px]${autoFlow !== "row" ? ` grid-flow-${autoFlow}` : ""}">\n${itemChildren}\n</div>`,
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Preview */}
        <div className="flex-1 bg-[var(--bg)] flex items-center justify-center p-10 overflow-auto">
          <div
            className="w-full max-w-3xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, minmax(80px, 1fr))`,
              gap: `${gap}px`,
              gridAutoFlow: autoFlow,
            }}
          >
            {items.slice(0, itemCount).map((item, i) => (
              <motion.div
                key={i}
                layout
                onClick={() => setSelectedItem(i === selectedItem ? null : i)}
                className={cn(
                  "rounded-lg flex items-center justify-center text-white text-sm font-medium cursor-pointer transition-all min-h-[60px]",
                  item.color,
                  selectedItem === i && "ring-2 ring-white ring-offset-2 ring-offset-[var(--bg)]"
                )}
                style={{
                  gridColumn: `span ${item.colSpan}`,
                  gridRow: `span ${item.rowSpan}`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {i + 1}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right controls */}
        <aside className="w-72 bg-[var(--surface)] border-l border-[var(--border)] overflow-y-auto p-5 space-y-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80 mb-4">Grid Settings</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-[var(--fg)] font-medium">Columns</label>
                  <NumberInput value={columns} onChange={setColumns} min={1} max={6} unit="" />
                </div>
                <Slider value={[columns]} min={1} max={6} onValueChange={([v]) => setColumns(v)} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-[var(--fg)] font-medium">Rows</label>
                  <NumberInput value={rows} onChange={setRows} min={1} max={6} unit="" />
                </div>
                <Slider value={[rows]} min={1} max={6} onValueChange={([v]) => setRows(v)} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-[var(--fg)] font-medium">Gap</label>
                  <NumberInput value={gap} onChange={setGap} min={0} max={32} />
                </div>
                <Slider value={[gap]} min={0} max={32} onValueChange={([v]) => setGap(v)} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-[var(--fg)] font-medium">Items</label>
                  <NumberInput value={itemCount} onChange={setItemCount} min={1} max={12} unit="" />
                </div>
                <Slider value={[itemCount]} min={1} max={12} onValueChange={([v]) => setItemCount(v)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[var(--fg)] font-medium">Auto Flow</label>
                <Select value={autoFlow} onValueChange={setAutoFlow}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="row">Row</SelectItem>
                    <SelectItem value="column">Column</SelectItem>
                    <SelectItem value="dense">Dense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {selectedItem !== null && (
            <div className="pt-4 border-t border-[var(--border)] space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80">
                Item {selectedItem + 1}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-[var(--fg)] font-medium">Column Span</label>
                  <NumberInput
                    value={items[selectedItem].colSpan}
                    onChange={(v) => updateItem(selectedItem, "colSpan", v)}
                    min={1}
                    max={columns}
                    unit=""
                  />
                </div>
                <Slider
                  value={[items[selectedItem].colSpan]}
                  min={1}
                  max={columns}
                  onValueChange={([v]) => updateItem(selectedItem, "colSpan", v)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-[var(--fg)] font-medium">Row Span</label>
                  <NumberInput
                    value={items[selectedItem].rowSpan}
                    onChange={(v) => updateItem(selectedItem, "rowSpan", v)}
                    min={1}
                    max={rows}
                    unit=""
                  />
                </div>
                <Slider
                  value={[items[selectedItem].rowSpan]}
                  min={1}
                  max={rows}
                  onValueChange={([v]) => updateItem(selectedItem, "rowSpan", v)}
                />
              </div>
            </div>
          )}
        </aside>
      </div>

      <CodeBlock outputs={codeOutputs} />
    </div>
  );
}
