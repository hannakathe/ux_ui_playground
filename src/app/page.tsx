"use client";

import { useState } from "react";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { ViewportToolbar } from "@/components/layout/viewport-toolbar";
import { PropertyEditor } from "@/components/panels/property-editor";
import { CodePanel } from "@/components/panels/code-panel";
import { Canvas } from "@/components/playground/canvas";
import { ComponentExplorer } from "@/components/playground/component-explorer";
import { ColorPalette } from "@/components/playground/color-palette";
import { LayoutPlayground } from "@/components/playground/layout-playground";
import { SpacingVisualizer } from "@/components/playground/spacing-visualizer";
import { TypographyExplorer } from "@/components/playground/typography-explorer";
import { ShadowExplorer } from "@/components/playground/shadow-explorer";
import { GridPlayground } from "@/components/playground/grid-playground";
import { AnimationExplorer } from "@/components/playground/animation-explorer";
import { MobileUI } from "@/components/playground/mobile-ui";
import { InteractionsExplorer } from "@/components/playground/interactions-explorer";
import { DesignTokensEditor } from "@/components/playground/design-tokens";
import { usePlaygroundStore } from "@/hooks/use-playground-store";

export default function Home() {
  const store = usePlaygroundStore();

  const showPropertyPanel = store.activeTab === "playground";
  const showCodePanel = store.activeTab === "playground";

  const handleSave = () => {
    const name = prompt("Preset name:");
    if (name) store.savePreset(name);
  };

  const renderContent = () => {
    switch (store.activeTab) {
      case "playground":
        return (
          <Canvas styles={store.styles} viewportSize={store.viewportSize} />
        );
      case "components":
        return <ComponentExplorer />;
      case "layout":
        return <LayoutPlayground />;
      case "spacing":
        return <SpacingVisualizer />;
      case "colors":
        return <ColorPalette />;
      case "typography":
        return <TypographyExplorer />;
      case "shadows":
        return <ShadowExplorer />;
      case "grid":
        return <GridPlayground />;
      case "animations":
        return <AnimationExplorer />;
      case "mobile":
        return <MobileUI />;
      case "interactions":
        return <InteractionsExplorer />;
      case "tokens":
        return <DesignTokensEditor />;
      default:
        return (
          <Canvas styles={store.styles} viewportSize={store.viewportSize} />
        );
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <LeftSidebar
        activeTab={store.activeTab}
        onTabChange={store.setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ViewportToolbar
          viewportSize={store.viewportSize}
          onViewportChange={store.setViewportSize}
          onReset={store.resetStyles}
          onSave={handleSave}
        />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex overflow-hidden">
              {renderContent()}
            </div>
            {showCodePanel && (
              <div className="h-52">
                <CodePanel styles={store.styles} />
              </div>
            )}
          </div>

          {showPropertyPanel && (
            <PropertyEditor
              styles={store.styles}
              onUpdateStyle={store.updateStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
