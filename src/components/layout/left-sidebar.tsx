"use client";

import {
  Box,
  Type,
  Palette,
  Layout,
  Layers,
  Grid3X3,
  Smartphone,
  Component,
  Columns3,
  SlidersHorizontal,
  Sparkles,
  MousePointerClick,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LeftSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "playground", label: "Playground", icon: Box },
  { id: "components", label: "Components", icon: Component },
  { id: "layout", label: "Layout", icon: Columns3 },
  { id: "spacing", label: "Spacing", icon: SlidersHorizontal },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "shadows", label: "Shadows", icon: Layers },
  { id: "grid", label: "CSS Grid", icon: Grid3X3 },
  { id: "animations", label: "Animations", icon: Sparkles },
  { id: "mobile", label: "Mobile UI", icon: Smartphone },
  { id: "interactions", label: "Interactions", icon: MousePointerClick },
  { id: "tokens", label: "Tokens", icon: Layout },
];

export function LeftSidebar({ activeTab, onTabChange }: LeftSidebarProps) {
  return (
    <aside className="w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-zinc-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Box className="w-4 h-4 text-white" />
          </div>
          UX/UI Lab
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Interactive Playground</p>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors relative",
                isActive
                  ? "text-white bg-zinc-800"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-zinc-800 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
