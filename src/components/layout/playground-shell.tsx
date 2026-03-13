"use client";

import { ResizablePanel } from "@/components/ui/resizable-panel";
import { CodeBlock } from "@/components/ui/code-block";
import type { CodeOutput } from "@/lib/code-generators";

interface PlaygroundShellProps {
  configPanel: React.ReactNode;
  codeOutputs: CodeOutput[];
  children: React.ReactNode;
}

export function PlaygroundShell({ configPanel, codeOutputs, children }: PlaygroundShellProps) {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Config panel — left side */}
      <ResizablePanel
        side="left"
        defaultWidth={260}
        minWidth={200}
        maxWidth={400}
        tabLabel="Conf"
      >
        <div className="h-full overflow-y-auto p-5 space-y-6 bg-[var(--surface)]">
          {configPanel}
        </div>
      </ResizablePanel>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      {/* Code panel — right side */}
      <ResizablePanel
        side="right"
        defaultWidth={340}
        minWidth={240}
        maxWidth={600}
        tabLabel="Code"
      >
        <CodeBlock outputs={codeOutputs} layout="vertical" />
      </ResizablePanel>
    </div>
  );
}
