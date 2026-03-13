"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import type { CodeOutput } from "@/lib/code-generators";

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

  const fontFamilyCSS = fontFamily;
  const fontFamilyClean = fontFamily.split(",")[0].replace(/'/g, "").trim();

  const codeOutputs: CodeOutput[] = useMemo(() => [
    {
      language: "html",
      label: "HTML",
      syntaxLang: "html",
      code: `<p class="custom-text" style="font-family: ${fontFamilyCSS}; font-size: ${fontSize}px; font-weight: ${fontWeight}; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}px; color: ${color};">\n  ${sampleText}\n</p>`,
    },
    {
      language: "css",
      label: "CSS",
      syntaxLang: "css",
      code: `.custom-text {\n  font-family: ${fontFamilyCSS};\n  font-size: ${fontSize}px;\n  font-weight: ${fontWeight};\n  line-height: ${lineHeight};\n  letter-spacing: ${letterSpacing}px;\n  color: ${color};\n}`,
    },
    {
      language: "javascript",
      label: "JavaScript",
      syntaxLang: "javascript",
      code: `const el = document.querySelector('.custom-text');\nObject.assign(el.style, {\n  fontFamily: "${fontFamilyCSS}",\n  fontSize: "${fontSize}px",\n  fontWeight: "${fontWeight}",\n  lineHeight: "${lineHeight}",\n  letterSpacing: "${letterSpacing}px",\n  color: "${color}",\n});`,
    },
    {
      language: "react",
      label: "React",
      syntaxLang: "jsx",
      code: `<p\n  style={{\n    fontFamily: "${fontFamilyCSS}",\n    fontSize: ${fontSize},\n    fontWeight: ${fontWeight},\n    lineHeight: ${lineHeight},\n    letterSpacing: ${letterSpacing},\n    color: "${color}",\n  }}\n>\n  ${sampleText}\n</p>`,
    },
    {
      language: "tailwind",
      label: "Tailwind",
      syntaxLang: "html",
      code: `<p className="font-['${fontFamilyClean.replace(/\s+/g, "_")}'] text-[${fontSize}px] font-[${fontWeight}] leading-[${lineHeight}] tracking-[${letterSpacing}px] text-[${color}]">\n  ${sampleText}\n</p>`,
    },
  ], [fontFamilyCSS, fontFamilyClean, fontSize, fontWeight, lineHeight, letterSpacing, color]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Preview area */}
        <div className="flex-1 bg-[var(--bg)] overflow-auto p-10 space-y-12">
          {/* Live preview */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80 mb-5">
              Live Preview
            </p>
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
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80 mb-6">
              Type Scale
            </p>
            <div className="space-y-5">
              {typeScale.map((ts) => (
                <div key={ts.label} className="flex items-baseline gap-4">
                  <span className="w-24 text-xs text-[var(--muted)] font-mono shrink-0 text-right">
                    {ts.label}
                    <br />
                    <span className="opacity-60">{ts.size}px</span>
                  </span>
                  <p
                    className="text-[var(--fg)] truncate"
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

        {/* Right controls panel */}
        <div className="w-72 bg-[var(--surface)] border-l border-[var(--border)] overflow-y-auto p-5 space-y-6">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80 mb-1">
              Typography Controls
            </h3>
            <p className="text-xs text-[var(--muted)]">Explore type settings</p>
          </div>

          <div className="space-y-4">
            {/* Font Family */}
            <div className="space-y-2">
              <label className="text-xs text-[var(--fg)] font-medium">Font Family</label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f.split(",")[0].replace(/'/g, "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[var(--fg)] font-medium">Font Size</label>
                <NumberInput value={fontSize} onChange={setFontSize} min={10} max={72} unit="px" />
              </div>
              <Slider value={[fontSize]} min={10} max={72} onValueChange={([v]) => setFontSize(v)} />
            </div>

            {/* Font Weight */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[var(--fg)] font-medium">Font Weight</label>
                <NumberInput value={fontWeight} onChange={setFontWeight} min={100} max={900} step={100} unit="" />
              </div>
              <Slider value={[fontWeight]} min={100} max={900} step={100} onValueChange={([v]) => setFontWeight(v)} />
            </div>

            {/* Line Height */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[var(--fg)] font-medium">Line Height</label>
                <NumberInput
                  value={parseFloat(lineHeight.toFixed(1))}
                  onChange={setLineHeight}
                  min={0.8}
                  max={3}
                  step={0.1}
                  unit=""
                />
              </div>
              <Slider value={[lineHeight * 10]} min={8} max={30} onValueChange={([v]) => setLineHeight(v / 10)} />
            </div>

            {/* Letter Spacing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[var(--fg)] font-medium">Letter Spacing</label>
                <NumberInput value={letterSpacing} onChange={setLetterSpacing} min={-5} max={20} unit="px" />
              </div>
              <Slider value={[letterSpacing]} min={-5} max={20} onValueChange={([v]) => setLetterSpacing(v)} />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-xs text-[var(--fg)] font-medium">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-9 h-9 rounded bg-[var(--surface-2)] border border-[var(--border)] cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 h-9 px-2.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--fg)] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Quick weight presets */}
          <div className="pt-4 border-t border-[var(--border-light)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80 mb-3">
              Weight Presets
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => (
                <button
                  key={w}
                  className={cn(
                    "px-2 py-2 rounded-lg text-xs transition-colors",
                    fontWeight === w
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                      : "bg-[var(--surface-2)] text-[var(--fg)] hover:bg-[var(--border)]"
                  )}
                  onClick={() => setFontWeight(w)}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Code block */}
      <CodeBlock outputs={codeOutputs} />
    </div>
  );
}
