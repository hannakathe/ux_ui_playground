"use client";

import { useState, useRef, useEffect } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Save,
  ChevronDown,
  RotateCw,
  X,
  Download,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Preset } from "@/hooks/use-playground-store";

export interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  category: "phone" | "tablet" | "desktop";
}

const devicePresets: DevicePreset[] = [
  { id: "iphone-15-pro", name: "iPhone 15 Pro", width: 393, height: 852, category: "phone" },
  { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", width: 430, height: 932, category: "phone" },
  { id: "iphone-se", name: "iPhone SE", width: 375, height: 667, category: "phone" },
  { id: "pixel-8", name: "Pixel 8", width: 412, height: 915, category: "phone" },
  { id: "samsung-s24", name: "Galaxy S24", width: 360, height: 780, category: "phone" },
  { id: "samsung-s24-ultra", name: "Galaxy S24 Ultra", width: 412, height: 915, category: "phone" },
  { id: "ipad-mini", name: "iPad Mini", width: 768, height: 1024, category: "tablet" },
  { id: "ipad-air", name: "iPad Air", width: 820, height: 1180, category: "tablet" },
  { id: "ipad-pro-11", name: 'iPad Pro 11"', width: 834, height: 1194, category: "tablet" },
  { id: "ipad-pro-13", name: 'iPad Pro 12.9"', width: 1024, height: 1366, category: "tablet" },
  { id: "surface-pro", name: "Surface Pro 8", width: 912, height: 1368, category: "tablet" },
  { id: "macbook-air", name: "MacBook Air", width: 1280, height: 800, category: "desktop" },
  { id: "macbook-pro-14", name: "MacBook Pro 14", width: 1512, height: 982, category: "desktop" },
  { id: "desktop-fhd", name: "Desktop 1080p", width: 1920, height: 1080, category: "desktop" },
  { id: "desktop-2k", name: "Desktop 1440p", width: 2560, height: 1440, category: "desktop" },
];

export interface ViewportConfig {
  device: DevicePreset | null;
  customWidth: number;
  customHeight: number;
  rotated: boolean;
}

interface ViewportToolbarProps {
  viewport: ViewportConfig;
  onViewportChange: (v: ViewportConfig) => void;
  onReset: () => void;
  onSave: () => void;
  presets: Preset[];
  onLoadPreset: (p: Preset) => void;
  onDeletePreset: (id: string) => void;
  onExportPresets: () => void;
}

function Dropdown({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div ref={ref} className="absolute top-full left-0 mt-1 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
      {children}
    </div>
  );
}

export function ViewportToolbar({
  viewport,
  onViewportChange,
  onReset,
  onSave,
  presets,
  onLoadPreset,
  onDeletePreset,
  onExportPresets,
}: ViewportToolbarProps) {
  const [deviceDropdown, setDeviceDropdown] = useState(false);
  const [presetDropdown, setPresetDropdown] = useState(false);
  const [editingW, setEditingW] = useState(false);
  const [editingH, setEditingH] = useState(false);

  const w = viewport.device ? (viewport.rotated ? viewport.device.height : viewport.device.width) : viewport.customWidth;
  const h = viewport.device ? (viewport.rotated ? viewport.device.width : viewport.device.height) : viewport.customHeight;

  const selectDevice = (d: DevicePreset) => {
    onViewportChange({ ...viewport, device: d, rotated: false });
    setDeviceDropdown(false);
  };

  const setDimension = (dim: "w" | "h", val: string) => {
    const n = parseInt(val, 10);
    if (isNaN(n) || n < 100) return;
    onViewportChange({
      ...viewport,
      device: null,
      customWidth: dim === "w" ? n : w,
      customHeight: dim === "h" ? n : h,
    });
  };

  const categories: { key: DevicePreset["category"]; label: string }[] = [
    { key: "phone", label: "Phones" },
    { key: "tablet", label: "Tablets" },
    { key: "desktop", label: "Desktops" },
  ];

  return (
    <div className="h-11 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4 gap-3 shrink-0">
      {/* Device selector */}
      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setDeviceDropdown(!deviceDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-sm text-[var(--fg)] transition-colors"
        >
          {viewport.device ? (
            <>
              {viewport.device.category === "phone" && <Smartphone className="w-3.5 h-3.5 text-[var(--muted)]" />}
              {viewport.device.category === "tablet" && <Tablet className="w-3.5 h-3.5 text-[var(--muted)]" />}
              {viewport.device.category === "desktop" && <Monitor className="w-3.5 h-3.5 text-[var(--muted)]" />}
              <span className="max-w-[120px] truncate text-xs">{viewport.device.name}</span>
            </>
          ) : (
            <>
              <Monitor className="w-3.5 h-3.5 text-[var(--muted)]" />
              <span className="text-xs">Responsive</span>
            </>
          )}
          <ChevronDown className="w-3 h-3 text-[var(--muted)]" />
        </button>

        <Dropdown open={deviceDropdown} onClose={() => setDeviceDropdown(false)}>
          <div className="max-h-80 overflow-y-auto p-1.5">
            <button
              onClick={() => { onViewportChange({ device: null, customWidth: 0, customHeight: 0, rotated: false }); setDeviceDropdown(false); }}
              className={cn("w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors", !viewport.device ? "bg-indigo-600/20 text-indigo-400" : "text-[var(--fg)] hover:bg-[var(--surface-2)]")}
            >
              Responsive (Full)
            </button>
            {categories.map((cat) => (
              <div key={cat.key}>
                <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">{cat.label}</p>
                {devicePresets.filter((d) => d.category === cat.key).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => selectDevice(d)}
                    className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors", viewport.device?.id === d.id ? "bg-indigo-600/20 text-indigo-400" : "text-[var(--fg)] hover:bg-[var(--surface-2)]")}
                  >
                    <span className="truncate">{d.name}</span>
                    <span className="text-[11px] text-[var(--muted)] font-mono ml-3 shrink-0">{d.width}x{d.height}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </Dropdown>

        {viewport.device && (
          <button onClick={() => onViewportChange({ ...viewport, device: null, customWidth: w, customHeight: h })} className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--fg)]" title="Clear device">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dimensions */}
      <div className="flex items-center gap-1.5">
        <DimensionInput value={w} editing={editingW} onEdit={setEditingW} onChange={(v) => setDimension("w", v)} />
        <span className="text-[var(--muted)] text-xs">x</span>
        <DimensionInput value={h} editing={editingH} onEdit={setEditingH} onChange={(v) => setDimension("h", v)} />
        {viewport.device && (
          <button
            onClick={() => onViewportChange({ ...viewport, rotated: !viewport.rotated })}
            className={cn("p-1 rounded-md transition-colors", viewport.rotated ? "text-indigo-400 bg-indigo-500/10" : "text-[var(--muted)] hover:text-[var(--fg)]")}
            title="Rotate"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Quick sizes */}
        {[{ l: "Mobile", w: 375, h: 812 }, { l: "Tablet", w: 768, h: 1024 }, { l: "Desktop", w: 1280, h: 800 }].map((qs) => (
          <button
            key={qs.l}
            onClick={() => onViewportChange({ device: null, customWidth: qs.w, customHeight: qs.h, rotated: false })}
            className="px-2 py-1 rounded-md text-[11px] text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] transition-colors"
          >
            {qs.l}
          </button>
        ))}

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        {/* Reset - prominent */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-orange-400 hover:bg-orange-500/10 transition-colors"
          title="Reset all styles"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>

        {/* Save - prominent */}
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 transition-colors"
          title="Save preset"
        >
          <Save className="w-3.5 h-3.5" />
          Save
        </button>

        {/* Presets dropdown */}
        {presets.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setPresetDropdown(!presetDropdown)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] transition-colors"
            >
              Presets ({presets.length})
              <ChevronDown className="w-3 h-3" />
            </button>
            <Dropdown open={presetDropdown} onClose={() => setPresetDropdown(false)}>
              <div className="max-h-60 overflow-y-auto p-1.5">
                {presets.map((p) => (
                  <div key={p.id} className="flex items-center gap-1">
                    <button
                      onClick={() => { onLoadPreset(p); setPresetDropdown(false); }}
                      className="flex-1 text-left px-3 py-2 rounded-lg text-sm text-[var(--fg)] hover:bg-[var(--surface-2)] transition-colors truncate"
                    >
                      {p.name}
                    </button>
                    <button
                      onClick={() => onDeletePreset(p.id)}
                      className="p-1.5 rounded-md text-[var(--muted)] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <div className="border-t border-[var(--border)] mt-1 pt-1">
                  <button
                    onClick={() => { onExportPresets(); setPresetDropdown(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export all presets
                  </button>
                </div>
              </div>
            </Dropdown>
          </div>
        )}
      </div>
    </div>
  );
}

function DimensionInput({ value, editing, onEdit, onChange }: { value: number; editing: boolean; onEdit: (b: boolean) => void; onChange: (v: string) => void }) {
  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        defaultValue={value || ""}
        onBlur={(e) => { onChange(e.target.value); onEdit(false); }}
        onKeyDown={(e) => { if (e.key === "Enter") { onChange((e.target as HTMLInputElement).value); onEdit(false); } }}
        className="w-16 h-6 px-2 bg-transparent border border-indigo-500 rounded text-xs text-[var(--fg)] font-mono text-center outline-none"
      />
    );
  }
  return (
    <button
      onClick={() => onEdit(true)}
      className="w-16 h-6 px-2 rounded bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--muted)] font-mono text-center cursor-text hover:border-indigo-500/50 transition-colors"
    >
      {value || "auto"}
    </button>
  );
}
