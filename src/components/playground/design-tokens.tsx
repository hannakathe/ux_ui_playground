"use client";

import { useState } from "react";
import { defaultTokens, type DesignTokens } from "@/lib/design-tokens";
import { HexColorPicker } from "react-colorful";
import { Copy, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function DesignTokensEditor() {
  const [tokens, setTokens] = useState<DesignTokens>(defaultTokens);
  const [activeSection, setActiveSection] = useState<keyof DesignTokens>("colors");
  const [editingColor, setEditingColor] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sections: { id: keyof DesignTokens; label: string }[] = [
    { id: "colors", label: "Colors" },
    { id: "spacing", label: "Spacing" },
    { id: "typography", label: "Typography" },
    { id: "borderRadius", label: "Border Radius" },
    { id: "shadows", label: "Shadows" },
  ];

  const updateColor = (key: string, value: string) => {
    setTokens((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const exportTokens = () => {
    const json = JSON.stringify(tokens, null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSS = () => {
    let css = ":root {\n";
    Object.entries(tokens.colors).forEach(([k, v]) => {
      css += `  --color-${k}: ${v};\n`;
    });
    Object.entries(tokens.spacing).forEach(([k, v]) => {
      css += `  --spacing-${k}: ${v};\n`;
    });
    Object.entries(tokens.borderRadius).forEach(([k, v]) => {
      css += `  --radius-${k}: ${v};\n`;
    });
    css += "}";
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-52 bg-zinc-950 border-r border-zinc-800 p-4 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          Token Categories
        </p>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={cn(
              "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
              activeSection === s.id
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            )}
          >
            {s.label}
          </button>
        ))}
        <div className="pt-4 space-y-2">
          <button
            onClick={exportTokens}
            className="w-full px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors"
          >
            {copied ? "Copied!" : "Export JSON"}
          </button>
          <button
            onClick={exportCSS}
            className="w-full px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-md transition-colors"
          >
            Export CSS
          </button>
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 overflow-auto p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {activeSection === "colors" && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Color Tokens</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(tokens.colors).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-zinc-800/50 rounded-xl border border-zinc-700 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-white font-medium capitalize">{key}</span>
                        <span className="text-xs text-zinc-500 font-mono">{value}</span>
                      </div>
                      <div
                        className="h-16 rounded-lg mb-3 cursor-pointer border border-zinc-600"
                        style={{ backgroundColor: value }}
                        onClick={() => setEditingColor(editingColor === key ? null : key)}
                      />
                      {editingColor === key && (
                        <div className="mt-2">
                          <HexColorPicker
                            color={value}
                            onChange={(v) => updateColor(key, v)}
                            style={{ width: "100%" }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview with tokens */}
              <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 p-6">
                <h4 className="text-sm font-semibold text-white mb-4">Live Preview</h4>
                <div
                  className="rounded-xl p-6 space-y-4"
                  style={{ backgroundColor: tokens.colors.background }}
                >
                  <h2
                    style={{ color: tokens.colors.foreground }}
                    className="text-xl font-bold"
                  >
                    Sample UI with Tokens
                  </h2>
                  <p
                    style={{ color: tokens.colors.foreground }}
                    className="text-sm opacity-70"
                  >
                    This preview uses your design tokens.
                  </p>
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: tokens.colors.primary }}
                    >
                      Primary
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: tokens.colors.secondary }}
                    >
                      Secondary
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: tokens.colors.accent }}
                    >
                      Accent
                    </button>
                  </div>
                  <div
                    className="rounded-lg p-4"
                    style={{
                      backgroundColor: tokens.colors.muted,
                      border: `1px solid ${tokens.colors.border}`,
                    }}
                  >
                    <p className="text-sm" style={{ color: tokens.colors.foreground }}>
                      Muted background card
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "spacing" && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Spacing Tokens</h3>
              <div className="space-y-4">
                {Object.entries(tokens.spacing).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-4">
                    <span className="w-12 text-sm text-zinc-400 font-mono">{key}</span>
                    <div
                      className="bg-indigo-500/50 rounded"
                      style={{ width: value, height: "32px" }}
                    />
                    <span className="text-xs text-zinc-500 font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "typography" && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Typography Tokens</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Font Family</p>
                  <p className="text-white" style={{ fontFamily: tokens.typography.fontFamily }}>
                    {tokens.typography.fontFamily}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Font Sizes</p>
                  {Object.entries(tokens.typography.fontSize).map(([key, value]) => (
                    <div key={key} className="flex items-baseline gap-4">
                      <span className="w-12 text-xs text-zinc-500 font-mono">{key}</span>
                      <span className="text-white" style={{ fontSize: value }}>
                        Sample text ({value})
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Font Weights</p>
                  {Object.entries(tokens.typography.fontWeight).map(([key, value]) => (
                    <div key={key} className="flex items-baseline gap-4">
                      <span className="w-20 text-xs text-zinc-500 font-mono">{key}</span>
                      <span className="text-white text-lg" style={{ fontWeight: value }}>
                        Weight {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "borderRadius" && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Border Radius Tokens</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(tokens.borderRadius).map(([key, value]) => (
                  <div key={key} className="flex flex-col items-center gap-2">
                    <div
                      className="w-24 h-24 bg-indigo-500/50 border-2 border-indigo-400"
                      style={{ borderRadius: value }}
                    />
                    <span className="text-xs text-zinc-400 font-mono">{key}</span>
                    <span className="text-xs text-zinc-600 font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "shadows" && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Shadow Tokens</h3>
              <div className="grid grid-cols-3 gap-6">
                {Object.entries(tokens.shadows).map(([key, value]) => (
                  <div key={key} className="flex flex-col items-center gap-3">
                    <div
                      className="w-24 h-24 bg-zinc-800 rounded-xl"
                      style={{ boxShadow: value }}
                    />
                    <span className="text-xs text-zinc-400 font-mono">{key}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
