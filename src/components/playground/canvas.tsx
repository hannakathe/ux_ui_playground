"use client";

import { motion } from "framer-motion";
import type { ElementStyles } from "@/hooks/use-playground-store";
import type { ViewportConfig } from "@/components/layout/viewport-toolbar";

interface CanvasProps {
  styles: ElementStyles;
  viewport: ViewportConfig;
}

export function Canvas({ styles, viewport }: CanvasProps) {
  const w = viewport.device
    ? viewport.rotated ? viewport.device.height : viewport.device.width
    : viewport.customWidth;
  const h = viewport.device
    ? viewport.rotated ? viewport.device.width : viewport.device.height
    : viewport.customHeight;

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
    border: styles.borderWidth > 0 ? `${styles.borderWidth}px solid ${styles.borderColor}` : "none",
    boxShadow: styles.shadow !== "none" ? styles.shadow : undefined,
    opacity: styles.opacity / 100,
  };

  return (
    <div className="flex-1 bg-[var(--bg)] overflow-auto flex items-center justify-center p-10">
      <div
        className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] flex items-center justify-center"
        style={{
          width: w > 0 ? `${w}px` : "100%",
          height: h > 0 ? `${h}px` : undefined,
          minHeight: 400,
          maxWidth: "100%",
        }}
      >
        <div className="relative">
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
          <motion.div
            layout
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            style={containerStyle}
            className="relative"
          >
            {styles.padding > 0 && (
              <div
                className="absolute inset-0 border border-dashed border-green-400/20 pointer-events-none"
                style={{ borderRadius: `${styles.borderRadius}px` }}
              />
            )}
            <span className="select-none">Content</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
