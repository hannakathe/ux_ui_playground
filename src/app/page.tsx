"use client";

import { useState, useMemo } from "react";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { ViewportToolbar, type ViewportConfig } from "@/components/layout/viewport-toolbar";
import { PropertyEditor } from "@/components/panels/property-editor";
import { generatePlaygroundCode } from "@/components/panels/code-panel";
import { Canvas } from "@/components/playground/canvas";
import { PlaygroundShell } from "@/components/layout/playground-shell";
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
import { ImageUpload } from "@/components/playground/image-upload";
import { DesktopPatterns } from "@/components/playground/desktop-patterns";
import { Hero } from "@/components/landing/hero";
import { ResizablePanel } from "@/components/ui/resizable-panel";
import { usePlaygroundStore } from "@/hooks/use-playground-store";
import { useTheme } from "@/hooks/use-theme";

export default function Home() {
  const store = usePlaygroundStore();
  const { theme, toggleTheme } = useTheme();
  const [viewport, setViewport] = useState<ViewportConfig>({
    device: null,
    customWidth: 0,
    customHeight: 0,
    rotated: false,
  });

  const showToolbar = store.activeTab !== "home";

  const handleSave = () => {
    const name = prompt("Preset name:");
    if (name) store.savePreset(name);
  };

  // Show hero landing for "home" tab
  if (store.activeTab === "home") {
    return <Hero onEnter={() => store.setActiveTab("playground")} />;
  }

  const playgroundCodeOutputs = useMemo(
    () => generatePlaygroundCode(store.styles),
    [store.styles]
  );

  const renderContent = () => {
    switch (store.activeTab) {
      case "playground":
        return (
          <PlaygroundShell
            configPanel={
              <PropertyEditor
                styles={store.styles}
                onUpdateStyle={store.updateStyle}
              />
            }
            codeOutputs={playgroundCodeOutputs}
          >
            <Canvas styles={store.styles} viewport={viewport} />
          </PlaygroundShell>
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
      case "images":
        return <ImageUpload />;
      case "desktop-patterns":
        return <DesktopPatterns />;
      default:
        return (
          <PlaygroundShell
            configPanel={
              <PropertyEditor
                styles={store.styles}
                onUpdateStyle={store.updateStyle}
              />
            }
            codeOutputs={playgroundCodeOutputs}
          >
            <Canvas styles={store.styles} viewport={viewport} />
          </PlaygroundShell>
        );
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--bg)]">
      {/* Left Sidebar - resizable */}
      <ResizablePanel side="left" defaultWidth={240} minWidth={180} maxWidth={360} tabLabel="Menu">
        <LeftSidebar
          activeTab={store.activeTab}
          onTabChange={store.setActiveTab}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </ResizablePanel>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Viewport toolbar */}
        {showToolbar && (
          <ViewportToolbar
            viewport={viewport}
            onViewportChange={setViewport}
            onReset={store.resetStyles}
            onSave={handleSave}
            presets={store.presets}
            onLoadPreset={store.loadPreset}
            onDeletePreset={store.deletePreset}
            onExportPresets={store.exportPresets}
          />
        )}

        {/* Content area — each component manages its own Conf + Code panels via PlaygroundShell */}
        <div className="flex-1 flex overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
