"use client";

import { Monitor, Tablet, Smartphone, RotateCcw, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewportToolbarProps {
  viewportSize: "desktop" | "tablet" | "mobile";
  onViewportChange: (size: "desktop" | "tablet" | "mobile") => void;
  onReset: () => void;
  onSave: () => void;
}

const viewports = [
  { id: "desktop" as const, icon: Monitor, label: "Desktop", width: "100%" },
  { id: "tablet" as const, icon: Tablet, label: "Tablet", width: "768px" },
  { id: "mobile" as const, icon: Smartphone, label: "Mobile", width: "375px" },
];

export function ViewportToolbar({
  viewportSize,
  onViewportChange,
  onReset,
  onSave,
}: ViewportToolbarProps) {
  return (
    <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-1">
        {viewports.map((vp) => {
          const Icon = vp.icon;
          return (
            <button
              key={vp.id}
              onClick={() => onViewportChange(vp.id)}
              className={cn(
                "p-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors",
                viewportSize === vp.id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
              title={vp.label}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{vp.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onReset}
          className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onSave}
          className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Save Preset"
        >
          <Save className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
