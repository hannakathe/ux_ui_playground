"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check } from "lucide-react";

const fontFamilies = [
  "Inter, system-ui, sans-serif",
  "Georgia, serif",
  "'JetBrains Mono', monospace",
  "system-ui, sans-serif",
  "'Segoe UI', sans-serif",
];

const sampleText = "The quick brown fox jumps over the lazy dog";

export function TypographyExplorer() {
  const [fontFamily, setFontFamily] = useState(fontFamilies[0]);
  const [fontSize, setFontSize] = useState(32);
  const [fontWeight, setFontWeight] = useState(400);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [color, setColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const cssCode = `font-family: ${fontFamily};
font-size: ${fontSize}px;
font-weight: ${fontWeight};
line-height: ${lineHeight};
letter-spacing: ${letterSpacing}px;
color: ${color};`;

  const copyCSS = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typeScale = [
    { label: "Display", size: 60, weight: 700 },
    { label: "H1", size: 36, weight: 700 },
    { label: "H2", size: 30, weight: 600 },
    { label: "H3", size: 24, weight: 600 },
    { label: "H4", size: 20, weight: 500 },
    { label: "Body Large", size: 18, weight: 400 },
    { label: "Body", size: 16, weight: 400 },
    { label: "Small", size: 14, weight: 400 },
    { label: "Caption", size: 12, weight: 400 },
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-64 bg-zinc-950 border-r border-zinc-800 p-4 space-y-4 overflow-y-auto">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Typography</h3>
          <p className="text-xs text-zinc-500">Explore type settings</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Font Family</label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {fontFamilies.map((f) => (
                  <SelectItem key={f} value={f}>{f.split(",")[0].replace(/'/g, "")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Font Size</label>
              <span className="text-xs text-zinc-500 font-mono">{fontSize}px</span>
            </div>
            <Slider value={[fontSize]} min={10} max={72} onValueChange={([v]) => setFontSize(v)} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Font Weight</label>
              <span className="text-xs text-zinc-500 font-mono">{fontWeight}</span>
            </div>
            <Slider value={[fontWeight]} min={100} max={900} step={100} onValueChange={([v]) => setFontWeight(v)} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Line Height</label>
              <span className="text-xs text-zinc-500 font-mono">{lineHeight.toFixed(1)}</span>
            </div>
            <Slider value={[lineHeight * 10]} min={8} max={30} onValueChange={([v]) => setLineHeight(v / 10)} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Letter Spacing</label>
              <span className="text-xs text-zinc-500 font-mono">{letterSpacing}px</span>
            </div>
            <Slider value={[letterSpacing]} min={-5} max={20} onValueChange={([v]) => setLetterSpacing(v)} />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 h-8 px-2 rounded bg-zinc-800 border border-zinc-700 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800 relative">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">CSS</p>
            <button onClick={copyCSS} className="p-1 rounded text-zinc-500 hover:text-white">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="text-[11px] text-zinc-400 font-mono bg-zinc-900 rounded-lg p-3 overflow-x-auto">
            {cssCode}
          </pre>
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 overflow-auto p-8 space-y-12">
        {/* Live preview */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
          <p className="text-xs text-zinc-500 font-mono mb-4">Live Preview</p>
          <p
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              fontWeight,
              lineHeight,
              letterSpacing: `${letterSpacing}px`,
              color,
            }}
          >
            {sampleText}
          </p>
        </div>

        {/* Type scale */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
          <p className="text-xs text-zinc-500 font-mono mb-6">Type Scale</p>
          <div className="space-y-4">
            {typeScale.map((ts) => (
              <div key={ts.label} className="flex items-baseline gap-4">
                <span className="w-24 text-xs text-zinc-500 font-mono shrink-0 text-right">
                  {ts.label}
                  <br />
                  <span className="text-zinc-600">{ts.size}px</span>
                </span>
                <p
                  className="text-white truncate"
                  style={{
                    fontFamily,
                    fontSize: `${ts.size}px`,
                    fontWeight: ts.weight,
                    lineHeight: 1.2,
                  }}
                >
                  {sampleText}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
