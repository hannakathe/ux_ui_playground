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
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [copied, setCopied] = useState(false);

  const cssCode = `.grid-container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${gap}px;
  grid-auto-flow: ${autoFlow};
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateItem = (index: number, key: keyof GridItem, value: number | string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-64 bg-zinc-950 border-r border-zinc-800 p-4 space-y-4 overflow-y-auto">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">CSS Grid</h3>
          <p className="text-xs text-zinc-500">Advanced grid layout editor</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Columns</label>
              <span className="text-xs text-zinc-500 font-mono">{columns}</span>
            </div>
            <Slider value={[columns]} min={1} max={6} onValueChange={([v]) => setColumns(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Rows</label>
              <span className="text-xs text-zinc-500 font-mono">{rows}</span>
            </div>
            <Slider value={[rows]} min={1} max={6} onValueChange={([v]) => setRows(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Gap</label>
              <span className="text-xs text-zinc-500 font-mono">{gap}px</span>
            </div>
            <Slider value={[gap]} min={0} max={32} onValueChange={([v]) => setGap(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Items</label>
              <span className="text-xs text-zinc-500 font-mono">{itemCount}</span>
            </div>
            <Slider value={[itemCount]} min={1} max={12} onValueChange={([v]) => setItemCount(v)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Auto Flow</label>
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

        {selectedItem !== null && (
          <div className="pt-3 border-t border-zinc-800 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Item {selectedItem + 1}
            </p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs text-zinc-400">Column Span</label>
                <span className="text-xs text-zinc-500 font-mono">{items[selectedItem].colSpan}</span>
              </div>
              <Slider
                value={[items[selectedItem].colSpan]}
                min={1}
                max={columns}
                onValueChange={([v]) => updateItem(selectedItem, "colSpan", v)}
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs text-zinc-400">Row Span</label>
                <span className="text-xs text-zinc-500 font-mono">{items[selectedItem].rowSpan}</span>
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

        <div className="pt-3 border-t border-zinc-800 relative">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">CSS</p>
            <button onClick={copyCode} className="p-1 rounded text-zinc-500 hover:text-white">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="text-[11px] text-zinc-400 font-mono bg-zinc-900 rounded-lg p-3">
            {cssCode}
          </pre>
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 flex items-center justify-center p-8">
        <div
          className="w-full max-w-3xl bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
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
                selectedItem === i && "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
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
    </div>
  );
}
