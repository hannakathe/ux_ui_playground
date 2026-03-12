"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

export function SpacingVisualizer() {
  const [padding, setPadding] = useState(16);
  const [margin, setMargin] = useState(24);
  const [gap, setGap] = useState(12);
  const [borderWidth, setBorderWidth] = useState(2);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Controls */}
      <div className="w-64 bg-zinc-950 border-r border-zinc-800 p-4 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Spacing Visualizer</h3>
          <p className="text-xs text-zinc-500">See how spacing properties affect layout</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-orange-400/60" />
                Margin
              </span>
              <span className="text-xs text-zinc-500 font-mono">{margin}px</span>
            </div>
            <Slider value={[margin]} min={0} max={80} onValueChange={([v]) => setMargin(v)} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-green-400/60" />
                Padding
              </span>
              <span className="text-xs text-zinc-500 font-mono">{padding}px</span>
            </div>
            <Slider value={[padding]} min={0} max={80} onValueChange={([v]) => setPadding(v)} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-400/60" />
                Gap
              </span>
              <span className="text-xs text-zinc-500 font-mono">{gap}px</span>
            </div>
            <Slider value={[gap]} min={0} max={48} onValueChange={([v]) => setGap(v)} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">Border Width</span>
              <span className="text-xs text-zinc-500 font-mono">{borderWidth}px</span>
            </div>
            <Slider value={[borderWidth]} min={0} max={8} onValueChange={([v]) => setBorderWidth(v)} />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Legend</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-3 h-3 rounded-sm bg-orange-400/30 border border-dashed border-orange-400" />
              Margin area
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-3 h-3 rounded-sm bg-green-400/30 border border-dashed border-green-400" />
              Padding area
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-3 h-3 rounded-sm bg-blue-400/30 border border-dashed border-blue-400" />
              Gap between items
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-3 h-3 rounded-sm bg-indigo-500" />
              Content area
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 bg-zinc-900 flex items-center justify-center p-8">
        <div className="relative">
          {/* Margin box */}
          <motion.div
            layout
            className="bg-orange-400/10 border border-dashed border-orange-400/40 rounded-lg"
            style={{ padding: `${margin}px` }}
          >
            {/* Label */}
            {margin > 10 && (
              <span className="absolute top-1 left-1 text-[10px] text-orange-400/60 font-mono">
                margin: {margin}px
              </span>
            )}

            {/* Padding box */}
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

              {/* Content with gap */}
              <div
                className="flex items-center"
                style={{ gap: `${gap}px` }}
              >
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    layout
                    className="bg-indigo-500/80 rounded-md flex items-center justify-center text-white text-sm font-medium"
                    style={{
                      width: "80px",
                      height: "80px",
                      border: borderWidth > 0 ? `${borderWidth}px solid rgba(99,102,241,0.5)` : "none",
                    }}
                  >
                    {i}
                  </motion.div>
                ))}

                {/* Gap indicators */}
                {gap > 4 && (
                  <>
                    <div
                      className="absolute bg-blue-400/10 border-l border-r border-dashed border-blue-400/40"
                      style={{
                        width: `${gap}px`,
                        height: "80px",
                        left: `${padding + 80}px`,
                        top: `${padding}px`,
                      }}
                    />
                    <div
                      className="absolute bg-blue-400/10 border-l border-r border-dashed border-blue-400/40"
                      style={{
                        width: `${gap}px`,
                        height: "80px",
                        left: `${padding + 80 + gap + 80}px`,
                        top: `${padding}px`,
                      }}
                    />
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Dimension labels */}
          <div className="mt-4 flex justify-center gap-6 text-xs text-zinc-500 font-mono">
            <span>Total width: {margin * 2 + padding * 2 + 80 * 3 + gap * 2}px</span>
            <span>Total height: {margin * 2 + padding * 2 + 80}px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
