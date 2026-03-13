"use client";

import {
  Box,
  Type,
  Palette,
  Layers,
  Grid3X3,
  Smartphone,
  Component,
  Columns3,
  SlidersHorizontal,
  Sparkles,
  MousePointerClick,
  Monitor,
  Layout,
  Image,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Theme } from "@/hooks/use-theme";

interface LeftSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

interface NavCategory {
  label: string;
  id: string;
  items: { id: string; label: string; icon: React.ElementType }[];
}

const categories: NavCategory[] = [
  {
    label: "Shared",
    id: "shared",
    items: [
      { id: "playground", label: "Playground", icon: Box },
      { id: "components", label: "Components", icon: Component },
      { id: "colors", label: "Colors", icon: Palette },
      { id: "typography", label: "Typography", icon: Type },
      { id: "shadows", label: "Shadows", icon: Layers },
      { id: "animations", label: "Animations", icon: Sparkles },
      { id: "tokens", label: "Design Tokens", icon: Layout },
      { id: "images", label: "Image Upload", icon: Image },
    ],
  },
  {
    label: "Web",
    id: "web",
    items: [
      { id: "layout", label: "Layout", icon: Columns3 },
      { id: "spacing", label: "Spacing", icon: SlidersHorizontal },
      { id: "grid", label: "CSS Grid", icon: Grid3X3 },
      { id: "interactions", label: "Interactions", icon: MousePointerClick },
    ],
  },
  {
    label: "Mobile",
    id: "mobile-cat",
    items: [
      { id: "mobile", label: "Mobile UI", icon: Smartphone },
    ],
  },
  {
    label: "Desktop",
    id: "desktop-cat",
    items: [
      { id: "desktop-patterns", label: "Desktop Patterns", icon: Monitor },
    ],
  },
];

function CategorySection({
  category,
  activeTab,
  onTabChange,
  defaultOpen = true,
}: {
  category: NavCategory;
  activeTab: string;
  onTabChange: (tab: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const hasActiveItem = category.items.some((i) => i.id === activeTab);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
      >
        <span className={hasActiveItem ? "text-indigo-400" : ""}>{category.label}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", !open && "-rotate-90")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 space-y-0.5">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all relative",
                      isActive
                        ? "text-[var(--fg)]"
                        : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-indigo-600/15 border border-indigo-500/20 rounded-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <Icon className={cn("w-4 h-4 relative z-10", isActive && "text-indigo-400")} />
                    <span className="relative z-10 truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LeftSidebar({ activeTab, onTabChange, theme, onToggleTheme }: LeftSidebarProps) {
  return (
    <div className="h-full flex flex-col bg-[var(--surface)] overflow-hidden">
      <div className="px-4 py-4 border-b border-[var(--border)]">
        <button onClick={() => onTabChange("home")} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:shadow-indigo-600/40 transition-shadow">
            <Box className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--fg)]">UX/UI Lab</h1>
            <p className="text-[10px] text-[var(--muted)]">Playground</p>
          </div>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 space-y-1">
        {categories.map((cat) => (
          <CategorySection
            key={cat.id}
            category={cat}
            activeTab={activeTab}
            onTabChange={onTabChange}
            defaultOpen={cat.id === "shared" || cat.id === "web"}
          />
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-[var(--border)]">
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] transition-colors"
        >
          {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </div>
  );
}
