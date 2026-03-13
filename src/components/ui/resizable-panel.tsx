"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResizablePanelProps {
  children: React.ReactNode;
  side: "left" | "right";
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  collapsible?: boolean;
  className?: string;
}

export function ResizablePanel({
  children,
  side,
  defaultWidth,
  minWidth,
  maxWidth,
  collapsible = true,
  className = "",
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [collapsed, setCollapsed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startW = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    startX.current = e.clientX;
    startW.current = width;
  }, [width]);

  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e: MouseEvent) => {
      const diff = side === "left"
        ? e.clientX - startX.current
        : startX.current - e.clientX;
      const newW = Math.min(maxWidth, Math.max(minWidth, startW.current + diff));
      setWidth(newW);
    };
    const onMouseUp = () => setDragging(false);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, side, minWidth, maxWidth]);

  const CollapseIcon = side === "left"
    ? (collapsed ? ChevronRight : ChevronLeft)
    : (collapsed ? ChevronLeft : ChevronRight);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 transition-[width] duration-200",
        side === "left" ? "border-r" : "border-l",
        "border-[var(--border)]",
        className
      )}
      style={{ width: collapsed ? 0 : width }}
    >
      {!collapsed && (
        <div className="w-full overflow-hidden flex flex-col">
          {children}
        </div>
      )}

      {/* Resize handle */}
      <div
        className={cn(
          "absolute top-0 bottom-0 w-1 cursor-col-resize z-20 group",
          "hover:bg-indigo-500/30 transition-colors",
          dragging && "bg-indigo-500/40",
          side === "left" ? "right-0" : "left-0"
        )}
        onMouseDown={onMouseDown}
      />

      {/* Collapse toggle */}
      {collapsible && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-30",
            "w-5 h-10 flex items-center justify-center",
            "bg-[var(--surface)] border border-[var(--border)] rounded-md",
            "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]",
            "transition-colors shadow-sm",
            side === "left" ? "-right-3" : "-left-3"
          )}
        >
          <CollapseIcon className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
