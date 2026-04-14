"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { NumberInput } from "@/components/ui/number-input";
import { CodeBlock } from "@/components/ui/code-block";
import type { CodeOutput } from "@/lib/code-generators";

export function SpacingVisualizer() {
  const [padding, setPadding] = useState(16);
  const [margin, setMargin] = useState(24);
  const [gap, setGap] = useState(12);
  const [borderWidth, setBorderWidth] = useState(2);
  const [itemCount, setItemCount] = useState(3);

  const items = Array.from({ length: itemCount }, (_, i) => i + 1);
  const itemsHtml = items.map((i) => `  <div>${i}</div>`).join("\n");

  const codeOutputs: CodeOutput[] = [
    {
      language: "html",
      label: "HTML",
      syntaxLang: "html",
      code: `<div style="margin: ${margin}px; padding: ${padding}px; gap: ${gap}px; border-width: ${borderWidth}px; display: flex;">\n${itemsHtml}\n</div>`,
    },
    {
      language: "css",
      label: "CSS",
      syntaxLang: "css",
      code: `.container {\n  margin: ${margin}px;\n  padding: ${padding}px;\n  gap: ${gap}px;\n  border-width: ${borderWidth}px;\n  display: flex;\n}`,
    },
    {
      language: "javascript",
      label: "JavaScript",
      syntaxLang: "javascript",
      code: `element.style.margin = "${margin}px";\nelement.style.padding = "${padding}px";\nelement.style.gap = "${gap}px";\nelement.style.borderWidth = "${borderWidth}px";\nelement.style.display = "flex";`,
    },
    {
      language: "react",
      label: "React",
      syntaxLang: "jsx",
      code: `<div style={{ margin: ${margin}, padding: ${padding}, gap: ${gap}, borderWidth: ${borderWidth}, display: "flex" }}>\n${itemsHtml}\n</div>`,
    },
    {
      language: "tailwind",
      label: "Tailwind",
      syntaxLang: "jsx",
      code: `<div className="m-[${margin}px] p-[${padding}px] gap-[${gap}px] border-[${borderWidth}px] flex">\n${itemsHtml}\n</div>`,
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Preview */}
        <div className="flex-1 bg-[var(--bg)] flex items-center justify-center p-10 overflow-auto">
          <div className="relative">
            <motion.div
              layout
              className="bg-orange-400/10 border border-dashed border-orange-400/40 rounded-lg relative"
              style={{ padding: `${margin}px` }}
            >
              {margin > 10 && (
                <span className="absolute top-1 left-1 text-[10px] text-orange-400/60 font-mono">
                  margin: {margin}px
                </span>
              )}
              <motion.div
                layout
                className="bg-green-400/10 border border-dashed border-green-400/40 rounded-lg relative"
                style={{ padding: `${padding}px` }}
              >
                {padding > 10 && (
                  <span className="absolute top-1 left-1 text-[10px] text-green-400/60 font-mono">
                    padding: {padding}px
                  </span>
                )}
                <div className="flex items-center flex-wrap" style={{ gap: `${gap}px` }}>
                  {items.map((i) => (
                    <motion.div
                      key={i}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-indigo-500/80 rounded-md flex items-center justify-center text-white text-sm font-medium shrink-0"
                      style={{
                        width: "80px",
                        height: "80px",
                        border: borderWidth > 0 ? `${borderWidth}px solid rgba(99,102,241,0.5)` : "none",
                      }}
                    >
                      {i}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
            <div className="mt-4 flex justify-center gap-6 text-xs text-[var(--muted)] font-mono">
              <span>
                Total width: {margin * 2 + padding * 2 + 80 * itemCount + gap * Math.max(0, itemCount - 1)}px
              </span>
              <span>Total height: {margin * 2 + padding * 2 + 80}px</span>
            </div>
          </div>
        </div>

        {/* Right controls */}
        <aside className="w-72 bg-[var(--surface)] border-l border-[var(--border)] overflow-y-auto p-5 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[var(--fg)] mb-0.5">Spacing Visualizer</h3>
            <p className="text-xs text-[var(--muted)]">See how spacing properties affect layout</p>
          </div>

          <div className="space-y-5">
            {/* Elements count */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[var(--muted)] font-medium">Elements</span>
                <NumberInput value={itemCount} onChange={setItemCount} min={1} max={5} unit="" />
              </div>
              <Slider value={[itemCount]} min={1} max={5} onValueChange={([v]) => setItemCount(v)} />
            </div>

            {[
              { label: "Margin", value: margin, set: setMargin, max: 80, color: "bg-orange-400/60" },
              { label: "Padding", value: padding, set: setPadding, max: 80, color: "bg-green-400/60" },
              { label: "Gap", value: gap, set: setGap, max: 48, color: "bg-blue-400/60", disabled: itemCount < 2 },
              { label: "Border Width", value: borderWidth, set: setBorderWidth, max: 8, color: "" },
            ].map((ctrl) => (
              <div key={ctrl.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[var(--muted)] font-medium flex items-center gap-2">
                    {ctrl.color && <span className={`w-2.5 h-2.5 rounded-sm ${ctrl.color}`} />}
                    {ctrl.label}
                    {ctrl.disabled && (
                      <span className="text-amber-400/70 text-[10px]">needs 2+ items</span>
                    )}
                  </span>
                  <NumberInput
                    value={ctrl.value}
                    onChange={ctrl.set}
                    max={ctrl.max}
                  />
                </div>
                <Slider
                  value={[ctrl.value]}
                  min={0}
                  max={ctrl.max}
                  onValueChange={([v]) => ctrl.set(v)}
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--border)] space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80">Legend</p>
            <div className="space-y-1.5">
              {[
                { label: "Margin area", color: "bg-orange-400/30 border-orange-400" },
                { label: "Padding area", color: "bg-green-400/30 border-green-400" },
                { label: "Gap between items", color: "bg-blue-400/30 border-blue-400" },
                { label: "Content area", color: "bg-indigo-500 border-transparent" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span className={`w-3 h-3 rounded-sm border border-dashed ${l.color}`} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <CodeBlock outputs={codeOutputs} />
    </div>
  );
}
