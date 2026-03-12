"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShadowExplorer() {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(4);
  const [blur, setBlur] = useState(12);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const shadowValue = `${inset ? "inset " : ""}${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity / 100})`;

  const copyCSS = () => {
    navigator.clipboard.writeText(`box-shadow: ${shadowValue};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { name: "Subtle", value: "0 1px 2px 0 rgba(0,0,0,0.05)" },
    { name: "Small", value: "0 1px 3px 0 rgba(0,0,0,0.1)" },
    { name: "Medium", value: "0 4px 6px -1px rgba(0,0,0,0.1)" },
    { name: "Large", value: "0 10px 15px -3px rgba(0,0,0,0.1)" },
    { name: "XL", value: "0 20px 25px -5px rgba(0,0,0,0.1)" },
    { name: "2XL", value: "0 25px 50px -12px rgba(0,0,0,0.25)" },
    { name: "Inner", value: "inset 0 2px 4px 0 rgba(0,0,0,0.05)" },
    { name: "Glow", value: "0 0 20px 0 rgba(99,102,241,0.4)" },
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-64 bg-zinc-950 border-r border-zinc-800 p-4 space-y-4 overflow-y-auto">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Shadows</h3>
          <p className="text-xs text-zinc-500">Create custom box shadows</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Offset X</label>
              <span className="text-xs text-zinc-500 font-mono">{offsetX}px</span>
            </div>
            <Slider value={[offsetX]} min={-50} max={50} onValueChange={([v]) => setOffsetX(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Offset Y</label>
              <span className="text-xs text-zinc-500 font-mono">{offsetY}px</span>
            </div>
            <Slider value={[offsetY]} min={-50} max={50} onValueChange={([v]) => setOffsetY(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Blur</label>
              <span className="text-xs text-zinc-500 font-mono">{blur}px</span>
            </div>
            <Slider value={[blur]} min={0} max={100} onValueChange={([v]) => setBlur(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Spread</label>
              <span className="text-xs text-zinc-500 font-mono">{spread}px</span>
            </div>
            <Slider value={[spread]} min={-50} max={50} onValueChange={([v]) => setSpread(v)} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Opacity</label>
              <span className="text-xs text-zinc-500 font-mono">{opacity}%</span>
            </div>
            <Slider value={[opacity]} min={0} max={100} onValueChange={([v]) => setOpacity(v)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-7 rounded bg-zinc-800 border border-zinc-700 cursor-pointer" />
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
            <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="rounded" />
            Inset shadow
          </label>
        </div>

        <div className="pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">CSS</p>
            <button onClick={copyCSS} className="p-1 rounded text-zinc-500 hover:text-white">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="text-[11px] text-zinc-400 font-mono bg-zinc-900 rounded-lg p-3 break-all">
            box-shadow: {shadowValue};
          </pre>
        </div>

        <div className="pt-3 border-t border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Presets</p>
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map((p) => (
              <button
                key={p.name}
                className="px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-zinc-300 transition-colors"
                onClick={() => {
                  // Parse and apply preset values (simplified)
                  const el = document.createElement("div");
                  el.style.boxShadow = p.value;
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 flex items-center justify-center">
        <div className="space-y-8">
          <div
            className="w-48 h-48 bg-zinc-800 rounded-xl flex items-center justify-center"
            style={{ boxShadow: shadowValue }}
          >
            <span className="text-zinc-400 text-sm">Preview</span>
          </div>
          <div className="flex gap-6 justify-center">
            {presets.slice(0, 4).map((p) => (
              <div key={p.name} className="text-center">
                <div
                  className="w-16 h-16 bg-zinc-800 rounded-lg mb-2"
                  style={{ boxShadow: p.value }}
                />
                <span className="text-[10px] text-zinc-500">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
