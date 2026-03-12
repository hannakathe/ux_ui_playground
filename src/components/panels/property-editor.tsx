"use client";

import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ElementStyles } from "@/hooks/use-playground-store";

interface PropertyEditorProps {
  styles: ElementStyles;
  onUpdateStyle: <K extends keyof ElementStyles>(
    key: K,
    value: ElementStyles[K]
  ) => void;
}

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
      >
        {title}
        {open ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>
      {open && <div className="px-4 pb-3 space-y-3">{children}</div>}
    </div>
  );
}

function SliderControl({
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
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs text-zinc-400">{label}</label>
        <span className="text-xs text-zinc-500 font-mono">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-1">
      <label className="text-xs text-zinc-400">{label}</label>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 w-full h-8 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-white"
        >
          <div
            className="w-4 h-4 rounded-sm border border-zinc-600"
            style={{ backgroundColor: value }}
          />
          <span className="font-mono">{value}</span>
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-zinc-900 rounded-lg p-3 border border-zinc-700 shadow-xl">
            <HexColorPicker color={value} onChange={onChange} />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2 w-full h-7 px-2 rounded bg-zinc-800 border border-zinc-700 text-xs text-white font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function PropertyEditor({ styles, onUpdateStyle }: PropertyEditorProps) {
  return (
    <aside className="w-72 bg-zinc-950 border-l border-zinc-800 overflow-y-auto h-full">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-white">Properties</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Edit element styles</p>
      </div>

      <Section title="Dimensions">
        <SliderControl
          label="Width"
          value={styles.width}
          min={50}
          max={600}
          onChange={(v) => onUpdateStyle("width", v)}
        />
        <SliderControl
          label="Height"
          value={styles.height}
          min={30}
          max={400}
          onChange={(v) => onUpdateStyle("height", v)}
        />
      </Section>

      <Section title="Spacing">
        <SliderControl
          label="Padding"
          value={styles.padding}
          max={80}
          onChange={(v) => onUpdateStyle("padding", v)}
        />
        <SliderControl
          label="Margin"
          value={styles.margin}
          max={80}
          onChange={(v) => onUpdateStyle("margin", v)}
        />
        <SliderControl
          label="Gap"
          value={styles.gap}
          max={48}
          onChange={(v) => onUpdateStyle("gap", v)}
        />
      </Section>

      <Section title="Appearance">
        <SliderControl
          label="Border Radius"
          value={styles.borderRadius}
          max={50}
          onChange={(v) => onUpdateStyle("borderRadius", v)}
        />
        <SliderControl
          label="Border Width"
          value={styles.borderWidth}
          max={10}
          onChange={(v) => onUpdateStyle("borderWidth", v)}
        />
        <SliderControl
          label="Opacity"
          value={styles.opacity}
          max={100}
          unit="%"
          onChange={(v) => onUpdateStyle("opacity", v)}
        />
        <div className="space-y-1">
          <label className="text-xs text-zinc-400">Shadow</label>
          <Select
            value={styles.shadow}
            onValueChange={(v) => onUpdateStyle("shadow", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="0 1px 2px 0 rgb(0 0 0 / 0.05)">
                Small
              </SelectItem>
              <SelectItem value="0 4px 6px -1px rgb(0 0 0 / 0.1)">
                Medium
              </SelectItem>
              <SelectItem value="0 10px 15px -3px rgb(0 0 0 / 0.1)">
                Large
              </SelectItem>
              <SelectItem value="0 20px 25px -5px rgb(0 0 0 / 0.1)">
                XL
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Section title="Colors">
        <ColorControl
          label="Background"
          value={styles.backgroundColor}
          onChange={(v) => onUpdateStyle("backgroundColor", v)}
        />
        <ColorControl
          label="Text Color"
          value={styles.textColor}
          onChange={(v) => onUpdateStyle("textColor", v)}
        />
        <ColorControl
          label="Border Color"
          value={styles.borderColor}
          onChange={(v) => onUpdateStyle("borderColor", v)}
        />
      </Section>

      <Section title="Typography" defaultOpen={false}>
        <SliderControl
          label="Font Size"
          value={styles.fontSize}
          min={10}
          max={48}
          onChange={(v) => onUpdateStyle("fontSize", v)}
        />
        <div className="space-y-1">
          <label className="text-xs text-zinc-400">Font Weight</label>
          <Select
            value={String(styles.fontWeight)}
            onValueChange={(v) => onUpdateStyle("fontWeight", Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300">Light</SelectItem>
              <SelectItem value="400">Regular</SelectItem>
              <SelectItem value="500">Medium</SelectItem>
              <SelectItem value="600">Semibold</SelectItem>
              <SelectItem value="700">Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Section title="Layout" defaultOpen={false}>
        <div className="space-y-1">
          <label className="text-xs text-zinc-400">Display</label>
          <Select
            value={styles.display}
            onValueChange={(v) => onUpdateStyle("display", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
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
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Direction</label>
              <Select
                value={styles.flexDirection}
                onValueChange={(v) => onUpdateStyle("flexDirection", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">Row</SelectItem>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="row-reverse">Row Reverse</SelectItem>
                  <SelectItem value="column-reverse">Column Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Justify</label>
              <Select
                value={styles.justifyContent}
                onValueChange={(v) => onUpdateStyle("justifyContent", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Align</label>
              <Select
                value={styles.alignItems}
                onValueChange={(v) => onUpdateStyle("alignItems", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex-start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="flex-end">End</SelectItem>
                  <SelectItem value="stretch">Stretch</SelectItem>
                  <SelectItem value="baseline">Baseline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Wrap</label>
              <Select
                value={styles.flexWrap}
                onValueChange={(v) => onUpdateStyle("flexWrap", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nowrap">No Wrap</SelectItem>
                  <SelectItem value="wrap">Wrap</SelectItem>
                  <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        {styles.display === "grid" && (
          <>
            <SliderControl
              label="Columns"
              value={styles.gridCols}
              min={1}
              max={12}
              unit=""
              onChange={(v) => onUpdateStyle("gridCols", v)}
            />
            <SliderControl
              label="Rows"
              value={styles.gridRows}
              min={1}
              max={8}
              unit=""
              onChange={(v) => onUpdateStyle("gridRows", v)}
            />
            <SliderControl
              label="Grid Gap"
              value={styles.gridGap}
              max={48}
              onChange={(v) => onUpdateStyle("gridGap", v)}
            />
          </>
        )}
      </Section>
    </aside>
  );
}
