"use client";

import { useState, useMemo, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { NumberInput } from "@/components/ui/number-input";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import type { CodeOutput } from "@/lib/code-generators";

interface FontEntry {
  name: string;
  category: string;
}

const GOOGLE_FONTS: FontEntry[] = [
  // Sans-serif
  { name: "Inter", category: "Sans-serif" },
  { name: "Roboto", category: "Sans-serif" },
  { name: "Open Sans", category: "Sans-serif" },
  { name: "Lato", category: "Sans-serif" },
  { name: "Montserrat", category: "Sans-serif" },
  { name: "Poppins", category: "Sans-serif" },
  { name: "Raleway", category: "Sans-serif" },
  { name: "Oswald", category: "Sans-serif" },
  { name: "Ubuntu", category: "Sans-serif" },
  { name: "Nunito", category: "Sans-serif" },
  { name: "Source Sans 3", category: "Sans-serif" },
  { name: "Work Sans", category: "Sans-serif" },
  { name: "Rubik", category: "Sans-serif" },
  { name: "Cabin", category: "Sans-serif" },
  { name: "Figtree", category: "Sans-serif" },
  { name: "DM Sans", category: "Sans-serif" },
  { name: "Plus Jakarta Sans", category: "Sans-serif" },
  { name: "Space Grotesk", category: "Sans-serif" },
  { name: "Sora", category: "Sans-serif" },
  { name: "Karla", category: "Sans-serif" },
  { name: "Outfit", category: "Sans-serif" },
  { name: "Quicksand", category: "Sans-serif" },
  { name: "Varela Round", category: "Sans-serif" },
  { name: "Comfortaa", category: "Sans-serif" },
  { name: "Josefin Sans", category: "Sans-serif" },
  { name: "Barlow", category: "Sans-serif" },
  { name: "Exo 2", category: "Sans-serif" },
  { name: "Fira Sans", category: "Sans-serif" },
  { name: "Hind", category: "Sans-serif" },
  { name: "Mukta", category: "Sans-serif" },
  { name: "Catamaran", category: "Sans-serif" },
  { name: "Prompt", category: "Sans-serif" },
  { name: "Titillium Web", category: "Sans-serif" },
  { name: "Oxygen", category: "Sans-serif" },
  { name: "Asap", category: "Sans-serif" },
  { name: "Nunito Sans", category: "Sans-serif" },
  { name: "Noto Sans", category: "Sans-serif" },
  { name: "Manrope", category: "Sans-serif" },
  { name: "Be Vietnam Pro", category: "Sans-serif" },
  { name: "Mulish", category: "Sans-serif" },
  // Serif
  { name: "Playfair Display", category: "Serif" },
  { name: "Merriweather", category: "Serif" },
  { name: "Lora", category: "Serif" },
  { name: "PT Serif", category: "Serif" },
  { name: "Arvo", category: "Serif" },
  { name: "Bitter", category: "Serif" },
  { name: "Crimson Pro", category: "Serif" },
  { name: "Cormorant Garamond", category: "Serif" },
  { name: "EB Garamond", category: "Serif" },
  { name: "Libre Baskerville", category: "Serif" },
  { name: "Neuton", category: "Serif" },
  { name: "Spectral", category: "Serif" },
  { name: "Cardo", category: "Serif" },
  { name: "Gelasio", category: "Serif" },
  { name: "Domine", category: "Serif" },
  // Monospace
  { name: "JetBrains Mono", category: "Monospace" },
  { name: "Fira Code", category: "Monospace" },
  { name: "Source Code Pro", category: "Monospace" },
  { name: "Roboto Mono", category: "Monospace" },
  { name: "Inconsolata", category: "Monospace" },
  { name: "Space Mono", category: "Monospace" },
  { name: "IBM Plex Mono", category: "Monospace" },
  { name: "Courier Prime", category: "Monospace" },
  { name: "DM Mono", category: "Monospace" },
  { name: "Overpass Mono", category: "Monospace" },
  // Display
  { name: "Bebas Neue", category: "Display" },
  { name: "Anton", category: "Display" },
  { name: "Righteous", category: "Display" },
  { name: "Pacifico", category: "Display" },
  { name: "Lobster", category: "Display" },
  { name: "Abril Fatface", category: "Display" },
  { name: "Permanent Marker", category: "Display" },
  { name: "Satisfy", category: "Display" },
  { name: "Caveat", category: "Display" },
  { name: "Dancing Script", category: "Display" },
  { name: "Paytone One", category: "Display" },
  { name: "Boogaloo", category: "Display" },
  { name: "Fredoka One", category: "Display" },
  { name: "Kalam", category: "Display" },
  { name: "Patrick Hand", category: "Display" },
];

const CATEGORIES = ["All", "Sans-serif", "Serif", "Monospace", "Display"];

const loadedFonts = new Set<string>();

function loadGoogleFont(name: string) {
  if (loadedFonts.has(name)) return;
  loadedFonts.add(name);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g, "+")}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

const sampleText = "The quick brown fox jumps over the lazy dog";

export function TypographyExplorer() {
  const [selectedFont, setSelectedFont] = useState<FontEntry>(GOOGLE_FONTS[0]);
  const [fontSize, setFontSize] = useState(32);
  const [fontWeight, setFontWeight] = useState(400);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [color, setColor] = useState("#ffffff");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const fontFamily = `'${selectedFont.name}', ${
    selectedFont.category === "Serif" ? "serif" :
    selectedFont.category === "Monospace" ? "monospace" :
    "sans-serif"
  }`;

  // Load font on selection change
  useEffect(() => {
    loadGoogleFont(selectedFont.name);
  }, [selectedFont]);

  // Pre-load first fonts in each category for the type scale
  useEffect(() => {
    GOOGLE_FONTS.slice(0, 10).forEach((f) => loadGoogleFont(f.name));
  }, []);

  const filteredFonts = useMemo(() => {
    return GOOGLE_FONTS.filter((f) => {
      const matchesCategory = categoryFilter === "All" || f.category === categoryFilter;
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, search]);

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

  const codeOutputs: CodeOutput[] = useMemo(() => [
    {
      language: "html",
      label: "HTML",
      syntaxLang: "html",
      code: `<p class="custom-text" style="font-family: ${fontFamily}; font-size: ${fontSize}px; font-weight: ${fontWeight}; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}px; color: ${color};">\n  ${sampleText}\n</p>`,
    },
    {
      language: "css",
      label: "CSS",
      syntaxLang: "css",
      code: `@import url('https://fonts.googleapis.com/css2?family=${selectedFont.name.replace(/ /g, "+")}:wght@400;700&display=swap');\n\n.custom-text {\n  font-family: ${fontFamily};\n  font-size: ${fontSize}px;\n  font-weight: ${fontWeight};\n  line-height: ${lineHeight};\n  letter-spacing: ${letterSpacing}px;\n  color: ${color};\n}`,
    },
    {
      language: "javascript",
      label: "JavaScript",
      syntaxLang: "javascript",
      code: `const el = document.querySelector('.custom-text');\nObject.assign(el.style, {\n  fontFamily: "${fontFamily}",\n  fontSize: "${fontSize}px",\n  fontWeight: "${fontWeight}",\n  lineHeight: "${lineHeight}",\n  letterSpacing: "${letterSpacing}px",\n  color: "${color}",\n});`,
    },
    {
      language: "react",
      label: "React",
      syntaxLang: "jsx",
      code: `// In your layout or _app: import a Google Fonts link\n\n<p\n  style={{\n    fontFamily: "${fontFamily}",\n    fontSize: ${fontSize},\n    fontWeight: ${fontWeight},\n    lineHeight: ${lineHeight},\n    letterSpacing: ${letterSpacing},\n    color: "${color}",\n  }}\n>\n  ${sampleText}\n</p>`,
    },
    {
      language: "tailwind",
      label: "Tailwind",
      syntaxLang: "jsx",
      code: `// tailwind.config.js — extend theme.fontFamily\n\n<p className="text-[${fontSize}px] font-[${fontWeight}] leading-[${lineHeight}] tracking-[${letterSpacing}px] text-[${color}]"\n   style={{ fontFamily: "${fontFamily}" }}\n>\n  ${sampleText}\n</p>`,
    },
  ], [fontFamily, selectedFont.name, fontSize, fontWeight, lineHeight, letterSpacing, color]);

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
        <div className="w-80 bg-[var(--surface)] border-l border-[var(--border)] flex flex-col overflow-hidden">
          {/* Font selector */}
          <div className="p-5 border-b border-[var(--border)] space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80">
              Font Family
            </h3>
            {/* Search */}
            <input
              type="text"
              placeholder="Search fonts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 px-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-indigo-500"
            />
            {/* Category filter */}
            <div className="flex gap-1 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "px-2 py-0.5 rounded-md text-[11px] transition-colors",
                    categoryFilter === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--fg)]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Font list */}
            <div className="max-h-48 overflow-y-auto space-y-0.5 -mx-1 px-1">
              {filteredFonts.map((font) => (
                <button
                  key={font.name}
                  onClick={() => setSelectedFont(font)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                    selectedFont.name === font.name
                      ? "bg-indigo-600/20 text-indigo-400"
                      : "text-[var(--fg)] hover:bg-[var(--surface-2)]"
                  )}
                >
                  <span>{font.name}</span>
                  <span className="text-[10px] text-[var(--muted)]">{font.category}</span>
                </button>
              ))}
              {filteredFonts.length === 0 && (
                <p className="text-xs text-[var(--muted)] text-center py-4">No fonts found</p>
              )}
            </div>
          </div>

          {/* Typography controls */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-[var(--muted)] font-medium">Font Size</label>
                <NumberInput value={fontSize} onChange={setFontSize} min={10} max={96} unit="px" />
              </div>
              <Slider value={[fontSize]} min={10} max={96} onValueChange={([v]) => setFontSize(v)} />
            </div>

            {/* Font Weight */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-[var(--muted)] font-medium">Font Weight</label>
                <NumberInput value={fontWeight} onChange={setFontWeight} min={100} max={900} step={100} unit="" />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => (
                  <button
                    key={w}
                    className={cn(
                      "px-2 py-1.5 rounded-lg text-xs transition-colors",
                      fontWeight === w
                        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                        : "bg-[var(--surface-2)] text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--fg)]"
                    )}
                    onClick={() => setFontWeight(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Height */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-[var(--muted)] font-medium">Line Height</label>
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
                <label className="text-[11px] text-[var(--muted)] font-medium">Letter Spacing</label>
                <NumberInput value={letterSpacing} onChange={setLetterSpacing} min={-5} max={20} unit="px" />
              </div>
              <Slider value={[letterSpacing]} min={-5} max={20} onValueChange={([v]) => setLetterSpacing(v)} />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-[11px] text-[var(--muted)] font-medium">Color</label>
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
        </div>
      </div>

      {/* Code block */}
      <CodeBlock outputs={codeOutputs} />
    </div>
  );
}
