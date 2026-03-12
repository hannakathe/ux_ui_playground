"use client";

import { motion } from "framer-motion";
import type { ElementStyles } from "@/hooks/use-playground-store";

interface CanvasProps {
  styles: ElementStyles;
  viewportSize: "desktop" | "tablet" | "mobile";
}

const viewportWidths = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export function Canvas({ styles, viewportSize }: CanvasProps) {
  const containerStyle: React.CSSProperties = {
    display: styles.display,
    ...(styles.display === "flex" && {
      flexDirection: styles.flexDirection as React.CSSProperties["flexDirection"],
      justifyContent: styles.justifyContent,
      alignItems: styles.alignItems,
      flexWrap: styles.flexWrap as React.CSSProperties["flexWrap"],
      gap: `${styles.gap}px`,
    }),
    ...(styles.display === "grid" && {
      gridTemplateColumns: `repeat(${styles.gridCols}, 1fr)`,
      gridTemplateRows: `repeat(${styles.gridRows}, 1fr)`,
      gap: `${styles.gridGap}px`,
    }),
    padding: `${styles.padding}px`,
    margin: `${styles.margin}px`,
    width: `${styles.width}px`,
    height: `${styles.height}px`,
    borderRadius: `${styles.borderRadius}px`,
    backgroundColor: styles.backgroundColor,
    color: styles.textColor,
    fontSize: `${styles.fontSize}px`,
    fontWeight: styles.fontWeight,
    border:
      styles.borderWidth > 0
        ? `${styles.borderWidth}px solid ${styles.borderColor}`
        : "none",
    boxShadow: styles.shadow,
    opacity: styles.opacity / 100,
  };

  return (
    <div className="flex-1 bg-zinc-900 overflow-auto flex items-center justify-center p-8">
      <div
        className="bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-center justify-center min-h-[400px]"
        style={{
          width: viewportWidths[viewportSize],
          maxWidth: "100%",
        }}
      >
        {/* Spacing visualizer overlay */}
        <div className="relative">
          {/* Margin indicator */}
          {styles.margin > 0 && (
            <div
              className="absolute border border-dashed border-orange-400/30 pointer-events-none"
              style={{
                top: -styles.margin,
                left: -styles.margin,
                right: -styles.margin,
                bottom: -styles.margin,
                borderRadius: `${styles.borderRadius + styles.margin}px`,
              }}
            />
          )}

          {/* The actual element */}
          <motion.div
            layout
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            style={containerStyle}
            className="relative"
          >
            {/* Padding indicator */}
            {styles.padding > 0 && (
              <div
                className="absolute inset-0 border border-dashed border-green-400/20 pointer-events-none"
                style={{
                  borderRadius: `${styles.borderRadius}px`,
                }}
              />
            )}
            <span className="select-none">Content</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
