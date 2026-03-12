"use client";

import { useState, useCallback } from "react";

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
  name: string;
  styles: ElementStyles;
}

export function usePlaygroundStore() {
  const [styles, setStyles] = useState<ElementStyles>(defaultStyles);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [activeComponent, setActiveComponent] = useState<string>("box");
  const [activeTab, setActiveTab] = useState<string>("playground");
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop");

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
      setPresets((prev) => [...prev, { name, styles: { ...styles } }]);
    },
    [styles]
  );

  const loadPreset = useCallback((preset: Preset) => {
    setStyles(preset.styles);
  }, []);

  const deletePreset = useCallback((name: string) => {
    setPresets((prev) => prev.filter((p) => p.name !== name));
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
    activeComponent,
    setActiveComponent,
    activeTab,
    setActiveTab,
    viewportSize,
    setViewportSize,
  };
}
