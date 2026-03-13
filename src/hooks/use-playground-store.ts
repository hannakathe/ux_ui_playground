"use client";

import { useState, useCallback, useEffect } from "react";

export interface ElementStyles {
  padding: number;
  margin: number;
  gap: number;
  borderRadius: number;
  width: number;
  height: number;
  fontSize: number;
  fontWeight: number;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  shadow: string;
  opacity: number;
  display: string;
  flexDirection: string;
  justifyContent: string;
  alignItems: string;
  flexWrap: string;
  gridCols: number;
  gridRows: number;
  gridGap: number;
}

export const defaultStyles: ElementStyles = {
  padding: 16,
  margin: 0,
  gap: 8,
  borderRadius: 8,
  width: 200,
  height: 100,
  fontSize: 16,
  fontWeight: 400,
  backgroundColor: "#6366f1",
  textColor: "#ffffff",
  borderColor: "#e2e8f0",
  borderWidth: 0,
  shadow: "none",
  opacity: 100,
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "nowrap",
  gridCols: 3,
  gridRows: 2,
  gridGap: 16,
};

export interface Preset {
  id: string;
  name: string;
  styles: ElementStyles;
  createdAt: number;
}

const PRESETS_KEY = "ux-playground-presets";

function loadPresets(): Preset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistPresets(presets: Preset[]) {
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

export function usePlaygroundStore() {
  const [styles, setStyles] = useState<ElementStyles>(defaultStyles);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [activeComponent, setActiveComponent] = useState<string>("box");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Load presets from localStorage on mount
  useEffect(() => {
    setPresets(loadPresets());
  }, []);

  const updateStyle = useCallback(
    <K extends keyof ElementStyles>(key: K, value: ElementStyles[K]) => {
      setStyles((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetStyles = useCallback(() => {
    setStyles(defaultStyles);
  }, []);

  const savePreset = useCallback(
    (name: string) => {
      const preset: Preset = {
        id: Date.now().toString(36),
        name,
        styles: { ...styles },
        createdAt: Date.now(),
      };
      setPresets((prev) => {
        const next = [...prev, preset];
        persistPresets(next);
        return next;
      });
      return preset;
    },
    [styles]
  );

  const loadPreset = useCallback((preset: Preset) => {
    setStyles(preset.styles);
  }, []);

  const deletePreset = useCallback((id: string) => {
    setPresets((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persistPresets(next);
      return next;
    });
  }, []);

  const exportPresets = useCallback(() => {
    const data = JSON.stringify(presets, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ux-playground-presets.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [presets]);

  const importPresets = useCallback((json: string) => {
    try {
      const imported = JSON.parse(json) as Preset[];
      setPresets((prev) => {
        const next = [...prev, ...imported];
        persistPresets(next);
        return next;
      });
    } catch {
      console.error("Invalid preset JSON");
    }
  }, []);

  return {
    styles,
    setStyles,
    updateStyle,
    resetStyles,
    presets,
    savePreset,
    loadPreset,
    deletePreset,
    exportPresets,
    importPresets,
    activeComponent,
    setActiveComponent,
    activeTab,
    setActiveTab,
    viewportSize,
    setViewportSize,
  };
}
