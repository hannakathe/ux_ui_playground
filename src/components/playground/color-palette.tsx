"use client";

import { useState, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { Copy, Check, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import {
  generateComplementary,
  generateAnalogous,
  generateTriadic,
  generateMonochromatic,
  generateSplitComplementary,
  generateShades,
  hexToHsl,
  hslToHex,
} from "@/lib/color-utils";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type PaletteType =
  | "complementary"
  | "analogous"
  | "triadic"
  | "monochromatic"
  | "split-complementary"
  | "shades";

function ColorSwatch({ color, large = false }: { color: string; large?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <motion.button
      onClick={copy}
      className={cn(
        "rounded-lg relative group transition-transform hover:scale-105",
        large ? "h-32 min-w-[100px] flex-1" : "h-20 min-w-[70px] flex-1"
      )}
      style={{ backgroundColor: color }}
      whileHover={{ y: -2 }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
        {copied ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <Copy className="w-4 h-4 text-white" />
        )}
      </div>
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/80 bg-black/30 px-1.5 py-0.5 rounded">
        {color}
      </span>
    </motion.button>
  );
}

export function ColorPalette() {
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [paletteType, setPaletteType] = useState<PaletteType>("monochromatic");
  const [hsl, setHsl] = useState(() => hexToHsl(baseColor));

  const updateBaseColor = useCallback((hex: string) => {
    setBaseColor(hex);
    setHsl(hexToHsl(hex));
  }, []);

  const updateHsl = useCallback(
    (index: 0 | 1 | 2, value: number) => {
      const newHsl: [number, number, number] = [...hsl];
      newHsl[index] = value;
      setHsl(newHsl);
      setBaseColor(hslToHex(newHsl[0], newHsl[1], newHsl[2]));
    },
    [hsl]
  );

  const randomColor = () => {
    const hex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    updateBaseColor(hex);
  };

  const generators: Record<PaletteType, (hex: string) => string[]> = {
    complementary: generateComplementary,
    analogous: generateAnalogous,
    triadic: generateTriadic,
    monochromatic: generateMonochromatic,
    "split-complementary": generateSplitComplementary,
    shades: generateShades,
  };

  const palette = generators[paletteType](baseColor);

  const paletteTypes: { id: PaletteType; label: string }[] = [
    { id: "monochromatic", label: "Monochromatic" },
    { id: "complementary", label: "Complementary" },
    { id: "analogous", label: "Analogous" },
    { id: "triadic", label: "Triadic" },
    { id: "split-complementary", label: "Split Comp." },
    { id: "shades", label: "Shades" },
  ];

  const exportTokens = () => {
    const tokens = palette.reduce(
      (acc, color, i) => {
        acc[`color-${i + 1}`] = color;
        return acc;
      },
      {} as Record<string, string>
    );
    navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
  };

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Color Palette Generator</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Create and explore color palettes
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={randomColor}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-md transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Random
            </button>
            <button
              onClick={exportTokens}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors"
            >
              Export Tokens
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[280px_1fr] gap-8">
          {/* Color Picker */}
          <div className="space-y-4">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 space-y-4">
              <HexColorPicker
                color={baseColor}
                onChange={updateBaseColor}
                style={{ width: "100%" }}
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => updateBaseColor(e.target.value)}
                className="w-full h-8 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-sm text-white font-mono"
              />
            </div>

            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                HSL Controls
              </p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-400">Hue</span>
                  <span className="text-xs text-zinc-500 font-mono">{hsl[0]}°</span>
                </div>
                <Slider
                  value={[hsl[0]]}
                  min={0}
                  max={360}
                  onValueChange={([v]) => updateHsl(0, v)}
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-400">Saturation</span>
                  <span className="text-xs text-zinc-500 font-mono">{hsl[1]}%</span>
                </div>
                <Slider
                  value={[hsl[1]]}
                  min={0}
                  max={100}
                  onValueChange={([v]) => updateHsl(1, v)}
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-400">Lightness</span>
                  <span className="text-xs text-zinc-500 font-mono">{hsl[2]}%</span>
                </div>
                <Slider
                  value={[hsl[2]]}
                  min={0}
                  max={100}
                  onValueChange={([v]) => updateHsl(2, v)}
                />
              </div>
            </div>
          </div>

          {/* Palettes */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {paletteTypes.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => setPaletteType(pt.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm transition-colors",
                    paletteType === pt.id
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  )}
                >
                  {pt.label}
                </button>
              ))}
            </div>

            {/* Generated palette */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
                Generated Palette
              </p>
              <div className="flex gap-3">
                {palette.map((color, i) => (
                  <ColorSwatch key={`${color}-${i}`} color={color} large />
                ))}
              </div>
            </div>

            {/* Preview in context */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
                Preview
              </p>
              <div className="space-y-3">
                <div className="flex gap-3">
                  {palette.slice(0, 3).map((color, i) => (
                    <button
                      key={i}
                      className="px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-80"
                      style={{
                        backgroundColor: color,
                        color: i === 0 ? "#fff" : "#fff",
                      }}
                    >
                      Button {i + 1}
                    </button>
                  ))}
                </div>
                <div
                  className="rounded-lg p-4 border"
                  style={{
                    backgroundColor: palette[palette.length - 1],
                    borderColor: palette[Math.floor(palette.length / 2)],
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: palette[0] }}
                  >
                    Card preview with palette colors
                  </p>
                  <p className="text-xs mt-1" style={{ color: palette[1] }}>
                    Secondary text using palette colors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
