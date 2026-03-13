"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { NumberInput } from "@/components/ui/number-input";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import type { CodeOutput } from "@/lib/code-generators";

export function ShadowExplorer() {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(4);
  const [blur, setBlur] = useState(12);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);

  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const shadowValue = `${inset ? "inset " : ""}${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${opacity / 100})`;

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

  const applyPreset = (presetValue: string) => {
    const isInset = presetValue.startsWith("inset ");
    const cleaned = presetValue.replace("inset ", "");
    const parts = cleaned.split(/\s+/);
    const pxVals = parts.slice(0, 4).map((p) => parseInt(p));
    setInset(isInset);
    setOffsetX(pxVals[0] || 0);
    setOffsetY(pxVals[1] || 0);
    setBlur(pxVals[2] || 0);
    setSpread(pxVals[3] || 0);
    // Parse rgba
    const rgbaMatch = presetValue.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (rgbaMatch) {
      const pr = parseInt(rgbaMatch[1]);
      const pg = parseInt(rgbaMatch[2]);
      const pb = parseInt(rgbaMatch[3]);
      const pa = parseFloat(rgbaMatch[4]);
      setColor(`#${pr.toString(16).padStart(2, "0")}${pg.toString(16).padStart(2, "0")}${pb.toString(16).padStart(2, "0")}`);
      setOpacity(Math.round(pa * 100));
    }
  };

  const codeOutputs: CodeOutput[] = useMemo(() => [
    {
      language: "html",
      label: "HTML",
      syntaxLang: "html",
      code: `<div class="shadow-box" style="box-shadow: ${shadowValue};">\n  Content\n</div>`,
    },
    {
      language: "css",
      label: "CSS",
      syntaxLang: "css",
      code: `.shadow-box {\n  box-shadow: ${shadowValue};\n}`,
    },
    {
      language: "javascript",
      label: "JavaScript",
      syntaxLang: "javascript",
      code: `const el = document.querySelector('.shadow-box');\nel.style.boxShadow = '${shadowValue}';`,
    },
    {
      language: "react",
      label: "React",
      syntaxLang: "jsx",
      code: `<div\n  style={{\n    boxShadow: "${shadowValue}",\n  }}\n>\n  Content\n</div>`,
    },
    {
      language: "tailwind",
      label: "Tailwind",
      syntaxLang: "html",
      code: `<!-- Using arbitrary value -->\n<div className="shadow-[${shadowValue.replace(/\s+/g, "_")}]">\n  Content\n</div>`,
    },
  ], [shadowValue]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Preview area */}
        <div className="flex-1 bg-[var(--bg)] flex items-center justify-center p-10 overflow-auto">
          <div className="space-y-10">
            <div
              className="w-52 h-52 bg-[var(--surface-2)] rounded-xl flex items-center justify-center"
              style={{ boxShadow: shadowValue }}
            >
              <span className="text-[var(--muted)] text-sm">Preview</span>
            </div>
            <div className="flex gap-6 justify-center">
              {presets.slice(0, 4).map((p) => (
                <button
                  key={p.name}
                  className="text-center group cursor-pointer"
                  onClick={() => applyPreset(p.value)}
                >
                  <div
                    className="w-16 h-16 bg-[var(--surface-2)] rounded-lg mb-2 group-hover:scale-105 transition-transform"
                    style={{ boxShadow: p.value }}
                  />
                  <span className="text-[10px] text-[var(--muted)]">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right controls panel */}
        <div className="w-72 bg-[var(--surface)] border-l border-[var(--border)] overflow-y-auto p-5 space-y-6">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80 mb-1">
              Shadow Controls
            </h3>
            <p className="text-xs text-[var(--muted)]">Create custom box shadows</p>
          </div>

          <div className="space-y-4">
            {/* Offset X */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[var(--fg)] font-medium">Offset X</label>
                <NumberInput value={offsetX} onChange={setOffsetX} min={-50} max={50} unit="px" />
              </div>
              <Slider value={[offsetX]} min={-50} max={50} onValueChange={([v]) => setOffsetX(v)} />
            </div>

            {/* Offset Y */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[var(--fg)] font-medium">Offset Y</label>
                <NumberInput value={offsetY} onChange={setOffsetY} min={-50} max={50} unit="px" />
              </div>
              <Slider value={[offsetY]} min={-50} max={50} onValueChange={([v]) => setOffsetY(v)} />
            </div>

            {/* Blur */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[var(--fg)] font-medium">Blur</label>
                <NumberInput value={blur} onChange={setBlur} min={0} max={100} unit="px" />
              </div>
              <Slider value={[blur]} min={0} max={100} onValueChange={([v]) => setBlur(v)} />
            </div>

            {/* Spread */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[var(--fg)] font-medium">Spread</label>
                <NumberInput value={spread} onChange={setSpread} min={-50} max={50} unit="px" />
              </div>
              <Slider value={[spread]} min={-50} max={50} onValueChange={([v]) => setSpread(v)} />
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[var(--fg)] font-medium">Opacity</label>
                <NumberInput value={opacity} onChange={setOpacity} min={0} max={100} unit="%" />
              </div>
              <Slider value={[opacity]} min={0} max={100} onValueChange={([v]) => setOpacity(v)} />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-xs text-[var(--fg)] font-medium">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-8 rounded bg-[var(--surface-2)] border border-[var(--border)] cursor-pointer"
              />
            </div>

            {/* Inset toggle */}
            <label className="flex items-center gap-2.5 text-xs text-[var(--fg)] font-medium cursor-pointer py-1">
              <input
                type="checkbox"
                checked={inset}
                onChange={(e) => setInset(e.target.checked)}
                className="rounded"
              />
              Inset shadow
            </label>
          </div>

          {/* Presets */}
          <div className="pt-4 border-t border-[var(--border-light)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80 mb-3">
              Presets
            </p>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  className="px-3 py-2 bg-[var(--surface-2)] hover:bg-[var(--border)] rounded-lg text-xs text-[var(--fg)] transition-colors"
                  onClick={() => applyPreset(p.value)}
                >
                  {p.name}
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
