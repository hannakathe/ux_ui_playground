"use client";

import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import { HexColorPicker } from "react-colorful";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { ElementStyles } from "@/hooks/use-playground-store";

interface PropertyEditorProps {
  styles: ElementStyles;
  onUpdateStyle: <K extends keyof ElementStyles>(key: K, value: ElementStyles[K]) => void;
}

function Section({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 group transition-colors hover:bg-[var(--surface-2)]"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--fg)] group-hover:text-indigo-400 transition-colors">
          {title}
        </span>
        {open
          ? <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)]" />
          : <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)]" />
        }
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 space-y-5">
          {children}
        </div>
      )}
    </div>
  );
}

function SliderWithInput({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = "px",
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] text-[var(--muted)] font-medium">{label}</label>
        <NumberInput value={value} onChange={onChange} min={min} max={max} step={step} unit={unit} />
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="text-[11px] text-[var(--muted)] font-medium">{label}</label>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2.5 w-full h-9 px-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs hover:border-[var(--border-light)] transition-colors"
        >
          <div className="w-5 h-5 rounded-md border border-[var(--border)] shrink-0" style={{ backgroundColor: value }} />
          <span className="font-mono text-[var(--fg)] truncate">{value}</span>
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-[var(--surface)] rounded-xl p-3 border border-[var(--border)] shadow-2xl shadow-black/40 w-[220px]">
            <HexColorPicker color={value} onChange={onChange} style={{ width: "100%" }} />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2 w-full h-8 px-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--fg)] focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function PropertyEditor({ styles, onUpdateStyle }: PropertyEditorProps) {
  return (
    <div className="h-full flex flex-col bg-[var(--surface)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--border)]">
        <h2 className="text-sm font-semibold text-[var(--fg)]">Properties</h2>
        <p className="text-[11px] text-[var(--muted)] mt-0.5">Adjust element styles in real time</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Section title="Dimensions">
          <SliderWithInput label="Width" value={styles.width} min={50} max={600} onChange={(v) => onUpdateStyle("width", v)} />
          <SliderWithInput label="Height" value={styles.height} min={30} max={400} onChange={(v) => onUpdateStyle("height", v)} />
        </Section>

        <Section title="Spacing">
          <SliderWithInput label="Padding" value={styles.padding} max={80} onChange={(v) => onUpdateStyle("padding", v)} />
          <SliderWithInput label="Margin" value={styles.margin} max={80} onChange={(v) => onUpdateStyle("margin", v)} />
          <SliderWithInput label="Gap" value={styles.gap} max={48} onChange={(v) => onUpdateStyle("gap", v)} />
        </Section>

        <Section title="Appearance">
          <SliderWithInput label="Border Radius" value={styles.borderRadius} max={50} onChange={(v) => onUpdateStyle("borderRadius", v)} />
          <SliderWithInput label="Border Width" value={styles.borderWidth} max={10} onChange={(v) => onUpdateStyle("borderWidth", v)} />
          <SliderWithInput label="Opacity" value={styles.opacity} max={100} unit="%" onChange={(v) => onUpdateStyle("opacity", v)} />
          <div className="space-y-1.5">
            <label className="text-[11px] text-[var(--muted)] font-medium">Shadow</label>
            <Select value={styles.shadow} onValueChange={(v) => onUpdateStyle("shadow", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="0 1px 2px 0 rgb(0 0 0 / 0.05)">Small</SelectItem>
                <SelectItem value="0 4px 6px -1px rgb(0 0 0 / 0.1)">Medium</SelectItem>
                <SelectItem value="0 10px 15px -3px rgb(0 0 0 / 0.1)">Large</SelectItem>
                <SelectItem value="0 20px 25px -5px rgb(0 0 0 / 0.1)">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Section>

        <Section title="Colors">
          <ColorControl label="Background" value={styles.backgroundColor} onChange={(v) => onUpdateStyle("backgroundColor", v)} />
          <ColorControl label="Text Color" value={styles.textColor} onChange={(v) => onUpdateStyle("textColor", v)} />
          <ColorControl label="Border Color" value={styles.borderColor} onChange={(v) => onUpdateStyle("borderColor", v)} />
        </Section>

        <Section title="Typography" defaultOpen={false}>
          <SliderWithInput label="Font Size" value={styles.fontSize} min={10} max={48} onChange={(v) => onUpdateStyle("fontSize", v)} />
          <div className="space-y-1.5">
            <label className="text-[11px] text-[var(--muted)] font-medium">Font Weight</label>
            <Select value={String(styles.fontWeight)} onValueChange={(v) => onUpdateStyle("fontWeight", Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="300">Light (300)</SelectItem>
                <SelectItem value="400">Regular (400)</SelectItem>
                <SelectItem value="500">Medium (500)</SelectItem>
                <SelectItem value="600">Semibold (600)</SelectItem>
                <SelectItem value="700">Bold (700)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Section>

        <Section title="Layout" defaultOpen={false}>
          <div className="space-y-1.5">
            <label className="text-[11px] text-[var(--muted)] font-medium">Display</label>
            <Select value={styles.display} onValueChange={(v) => onUpdateStyle("display", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="flex">Flex</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="inline-flex">Inline Flex</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(styles.display === "flex" || styles.display === "inline-flex") && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] text-[var(--muted)] font-medium">Direction</label>
                <Select value={styles.flexDirection} onValueChange={(v) => onUpdateStyle("flexDirection", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="row">Row</SelectItem>
                    <SelectItem value="column">Column</SelectItem>
                    <SelectItem value="row-reverse">Row Reverse</SelectItem>
                    <SelectItem value="column-reverse">Column Reverse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-[var(--muted)] font-medium">Justify Content</label>
                <Select value={styles.justifyContent} onValueChange={(v) => onUpdateStyle("justifyContent", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flex-start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="flex-end">End</SelectItem>
                    <SelectItem value="space-between">Space Between</SelectItem>
                    <SelectItem value="space-around">Space Around</SelectItem>
                    <SelectItem value="space-evenly">Space Evenly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-[var(--muted)] font-medium">Align Items</label>
                <Select value={styles.alignItems} onValueChange={(v) => onUpdateStyle("alignItems", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flex-start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="flex-end">End</SelectItem>
                    <SelectItem value="stretch">Stretch</SelectItem>
                    <SelectItem value="baseline">Baseline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          {styles.display === "grid" && (
            <>
              <SliderWithInput label="Columns" value={styles.gridCols} min={1} max={12} unit="" onChange={(v) => onUpdateStyle("gridCols", v)} />
              <SliderWithInput label="Rows" value={styles.gridRows} min={1} max={8} unit="" onChange={(v) => onUpdateStyle("gridRows", v)} />
              <SliderWithInput label="Grid Gap" value={styles.gridGap} max={48} onChange={(v) => onUpdateStyle("gridGap", v)} />
            </>
          )}
        </Section>
        <div className="h-8" />
      </div>
    </div>
  );
}
