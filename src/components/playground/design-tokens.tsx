"use client";

import { useState, useMemo } from "react";
import { defaultTokens, type DesignTokens } from "@/lib/design-tokens";
import { HexColorPicker } from "react-colorful";
import { Copy, Check } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import type { CodeOutput } from "@/lib/code-generators";

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

  const codeOutputs = useMemo<CodeOutput[]>(() => {
    let cssVars = ":root {\n";
    Object.entries(tokens.colors).forEach(([k, v]) => {
      cssVars += `  --color-${k}: ${v};\n`;
    });
    Object.entries(tokens.spacing).forEach(([k, v]) => {
      cssVars += `  --spacing-${k}: ${v};\n`;
    });
    Object.entries(tokens.borderRadius).forEach(([k, v]) => {
      cssVars += `  --radius-${k}: ${v};\n`;
    });
    cssVars += "}";

    let scssVars = "// Colors\n";
    Object.entries(tokens.colors).forEach(([k, v]) => {
      scssVars += `$color-${k}: ${v};\n`;
    });
    scssVars += "\n// Spacing\n";
    Object.entries(tokens.spacing).forEach(([k, v]) => {
      scssVars += `$spacing-${k}: ${v};\n`;
    });
    scssVars += "\n// Border Radius\n";
    Object.entries(tokens.borderRadius).forEach(([k, v]) => {
      scssVars += `$radius-${k}: ${v};\n`;
    });

    const jsonTokens = JSON.stringify(tokens, null, 2);

    const tailwindConfig = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${Object.entries(tokens.colors).map(([k, v]) => `        '${k}': '${v}',`).join("\n")}\n      },\n      spacing: {\n${Object.entries(tokens.spacing).map(([k, v]) => `        '${k}': '${v}',`).join("\n")}\n      },\n      borderRadius: {\n${Object.entries(tokens.borderRadius).map(([k, v]) => `        '${k}': '${v}',`).join("\n")}\n      },\n    },\n  },\n};`;

    return [
      { language: "css", label: "CSS Variables", code: cssVars, syntaxLang: "css" },
      { language: "scss", label: "SCSS", code: scssVars, syntaxLang: "scss" },
      { language: "javascript", label: "JSON Tokens", code: jsonTokens, syntaxLang: "json" },
      { language: "tailwind", label: "Tailwind Config", code: tailwindConfig, syntaxLang: "javascript" },
    ];
  }, [tokens]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Main content */}
        <div className="flex-1 bg-[var(--bg)] overflow-auto p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {activeSection === "colors" && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Color Tokens</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(tokens.colors).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-[var(--fg)] font-medium capitalize">{key}</span>
                          <span className="text-xs text-[var(--muted)] font-mono">{value}</span>
                        </div>
                        <div
                          className="h-16 rounded-lg mb-3 cursor-pointer border border-[var(--border-light)]"
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
                <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
                  <h4 className="text-sm font-semibold text-[var(--fg)] mb-4">Live Preview</h4>
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
                <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Spacing Tokens</h3>
                <div className="space-y-4">
                  {Object.entries(tokens.spacing).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-4">
                      <span className="w-12 text-sm text-[var(--muted)] font-mono">{key}</span>
                      <div
                        className="bg-indigo-500/50 rounded"
                        style={{ width: value, height: "32px" }}
                      />
                      <span className="text-xs text-[var(--muted)] font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "typography" && (
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Typography Tokens</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Font Family</p>
                    <p className="text-[var(--fg)]" style={{ fontFamily: tokens.typography.fontFamily }}>
                      {tokens.typography.fontFamily}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Font Sizes</p>
                    {Object.entries(tokens.typography.fontSize).map(([key, value]) => (
                      <div key={key} className="flex items-baseline gap-4">
                        <span className="w-12 text-xs text-[var(--muted)] font-mono">{key}</span>
                        <span className="text-[var(--fg)]" style={{ fontSize: value }}>
                          Sample text ({value})
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Font Weights</p>
                    {Object.entries(tokens.typography.fontWeight).map(([key, value]) => (
                      <div key={key} className="flex items-baseline gap-4">
                        <span className="w-20 text-xs text-[var(--muted)] font-mono">{key}</span>
                        <span className="text-[var(--fg)] text-lg" style={{ fontWeight: value }}>
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
                <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Border Radius Tokens</h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(tokens.borderRadius).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center gap-2">
                      <div
                        className="w-24 h-24 bg-indigo-500/50 border-2 border-indigo-400"
                        style={{ borderRadius: value }}
                      />
                      <span className="text-xs text-[var(--muted)] font-mono">{key}</span>
                      <span className="text-xs text-[var(--muted)] font-mono opacity-60">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "shadows" && (
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">Shadow Tokens</h3>
                <div className="grid grid-cols-3 gap-6">
                  {Object.entries(tokens.shadows).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center gap-3">
                      <div
                        className="w-24 h-24 bg-[var(--surface)] rounded-xl"
                        style={{ boxShadow: value }}
                      />
                      <span className="text-xs text-[var(--muted)] font-mono">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-72 bg-[var(--surface)] border-l border-[var(--border)] overflow-y-auto p-5 space-y-6">
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80">
              Token Categories
            </h3>
            <div className="space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    activeSection === s.id
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={exportTokens}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy JSON
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Code output */}
      <CodeBlock outputs={codeOutputs} />
    </div>
  );
}
