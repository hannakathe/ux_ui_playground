"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, X, AlertTriangle, Info, User } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import type { CodeOutput } from "@/lib/code-generators";

interface ComponentConfig {
  id: string;
  name: string;
  category: string;
  render: (props: Record<string, unknown>) => React.ReactNode;
  code: (props: Record<string, unknown>) => string;
  defaultProps: Record<string, unknown>;
  controls: {
    key: string;
    label: string;
    type: "slider" | "select" | "color" | "text" | "boolean";
    options?: string[];
    min?: number;
    max?: number;
  }[];
}

const components: ComponentConfig[] = [
  {
    id: "button",
    name: "Button",
    category: "Inputs",
    defaultProps: { variant: "primary", size: "md", label: "Click me", rounded: 8 },
    controls: [
      { key: "variant", label: "Variant", type: "select", options: ["primary", "secondary", "outline", "ghost", "destructive"] },
      { key: "size", label: "Size", type: "select", options: ["sm", "md", "lg"] },
      { key: "label", label: "Label", type: "text" },
      { key: "rounded", label: "Border Radius", type: "slider", min: 0, max: 24 },
    ],
    render: (props) => {
      const variants: Record<string, string> = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
        secondary: "bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--fg)]",
        outline: "border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--fg)]",
        ghost: "hover:bg-[var(--surface-2)] text-[var(--muted)]",
        destructive: "bg-red-600 hover:bg-red-700 text-white",
      };
      const sizes: Record<string, string> = { sm: "px-3 py-1 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
      return (
        <button className={cn("font-medium transition-colors", variants[props.variant as string], sizes[props.size as string])} style={{ borderRadius: `${props.rounded}px` }}>
          {props.label as string}
        </button>
      );
    },
    code: (props) => `<Button variant="${props.variant}" size="${props.size}">\n  ${props.label}\n</Button>`,
  },
  {
    id: "input",
    name: "Input",
    category: "Inputs",
    defaultProps: { placeholder: "Enter text...", variant: "default", size: "md" },
    controls: [
      { key: "placeholder", label: "Placeholder", type: "text" },
      { key: "variant", label: "Variant", type: "select", options: ["default", "filled", "underline"] },
      { key: "size", label: "Size", type: "select", options: ["sm", "md", "lg"] },
    ],
    render: (props) => {
      const sizes: Record<string, string> = { sm: "h-8 text-xs px-2", md: "h-10 text-sm px-3", lg: "h-12 text-base px-4" };
      const variants: Record<string, string> = {
        default: "border border-[var(--border)] bg-[var(--surface)] rounded-md",
        filled: "bg-[var(--surface-2)] border-none rounded-md",
        underline: "border-b border-[var(--border)] bg-transparent rounded-none",
      };
      return (
        <input
          placeholder={props.placeholder as string}
          className={cn("text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64", sizes[props.size as string], variants[props.variant as string])}
        />
      );
    },
    code: (props) => `<Input placeholder="${props.placeholder}" variant="${props.variant}" size="${props.size}" />`,
  },
  {
    id: "card",
    name: "Card",
    category: "Display",
    defaultProps: { title: "Card Title", description: "Card description text", shadow: "md", rounded: 12 },
    controls: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "text" },
      { key: "shadow", label: "Shadow", type: "select", options: ["none", "sm", "md", "lg"] },
      { key: "rounded", label: "Border Radius", type: "slider", min: 0, max: 24 },
    ],
    render: (props) => {
      const shadows: Record<string, string> = { none: "", sm: "shadow-sm", md: "shadow-md", lg: "shadow-lg" };
      return (
        <div className={cn("bg-[var(--surface-2)] border border-[var(--border)] p-6 w-72", shadows[props.shadow as string])} style={{ borderRadius: `${props.rounded}px` }}>
          <h3 className="text-[var(--fg)] font-semibold text-lg">{props.title as string}</h3>
          <p className="text-[var(--muted)] text-sm mt-2">{props.description as string}</p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors">Action</button>
        </div>
      );
    },
    code: (props) => `<Card shadow="${props.shadow}" rounded={${props.rounded}}>\n  <CardTitle>${props.title}</CardTitle>\n  <CardDescription>${props.description}</CardDescription>\n  <Button>Action</Button>\n</Card>`,
  },
  {
    id: "badge",
    name: "Badge",
    category: "Display",
    defaultProps: { label: "Badge", variant: "default" },
    controls: [
      { key: "label", label: "Label", type: "text" },
      { key: "variant", label: "Variant", type: "select", options: ["default", "success", "warning", "error", "info"] },
    ],
    render: (props) => {
      const variants: Record<string, string> = {
        default: "bg-[var(--surface-2)] text-[var(--fg)]",
        success: "bg-green-900/50 text-green-400 border border-green-800",
        warning: "bg-yellow-900/50 text-yellow-400 border border-yellow-800",
        error: "bg-red-900/50 text-red-400 border border-red-800",
        info: "bg-blue-900/50 text-blue-400 border border-blue-800",
      };
      return <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", variants[props.variant as string])}>{props.label as string}</span>;
    },
    code: (props) => `<Badge variant="${props.variant}">${props.label}</Badge>`,
  },
  {
    id: "alert",
    name: "Alert",
    category: "Feedback",
    defaultProps: { title: "Alert Title", description: "Something happened.", variant: "info" },
    controls: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "text" },
      { key: "variant", label: "Variant", type: "select", options: ["info", "success", "warning", "error"] },
    ],
    render: (props) => {
      const variants: Record<string, { bg: string; border: string; icon: React.ReactNode }> = {
        info: { bg: "bg-blue-900/20", border: "border-blue-800", icon: <Info className="w-4 h-4 text-blue-400" /> },
        success: { bg: "bg-green-900/20", border: "border-green-800", icon: <Check className="w-4 h-4 text-green-400" /> },
        warning: { bg: "bg-yellow-900/20", border: "border-yellow-800", icon: <AlertTriangle className="w-4 h-4 text-yellow-400" /> },
        error: { bg: "bg-red-900/20", border: "border-red-800", icon: <X className="w-4 h-4 text-red-400" /> },
      };
      const v = variants[props.variant as string];
      return (
        <div className={cn("flex items-start gap-3 p-4 rounded-lg border w-80", v.bg, v.border)}>
          <div className="mt-0.5">{v.icon}</div>
          <div>
            <p className="text-[var(--fg)] text-sm font-medium">{props.title as string}</p>
            <p className="text-[var(--muted)] text-xs mt-1">{props.description as string}</p>
          </div>
        </div>
      );
    },
    code: (props) => `<Alert variant="${props.variant}">\n  <AlertTitle>${props.title}</AlertTitle>\n  <AlertDescription>${props.description}</AlertDescription>\n</Alert>`,
  },
  {
    id: "avatar",
    name: "Avatar",
    category: "Display",
    defaultProps: { size: "md", initials: "JD", bgColor: "#6366f1" },
    controls: [
      { key: "size", label: "Size", type: "select", options: ["sm", "md", "lg", "xl"] },
      { key: "initials", label: "Initials", type: "text" },
      { key: "bgColor", label: "Color", type: "color" },
    ],
    render: (props) => {
      const sizes: Record<string, string> = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-lg" };
      return (
        <div className={cn("rounded-full flex items-center justify-center text-white font-semibold", sizes[props.size as string])} style={{ backgroundColor: props.bgColor as string }}>
          {props.initials as string}
        </div>
      );
    },
    code: (props) => `<Avatar size="${props.size}" color="${props.bgColor}">\n  ${props.initials}\n</Avatar>`,
  },
  {
    id: "tooltip",
    name: "Tooltip",
    category: "Overlay",
    defaultProps: { label: "Hover me", tooltip: "Tooltip content", position: "top" },
    controls: [
      { key: "label", label: "Trigger Text", type: "text" },
      { key: "tooltip", label: "Tooltip Text", type: "text" },
      { key: "position", label: "Position", type: "select", options: ["top", "bottom", "left", "right"] },
    ],
    render: (props) => {
      const positions: Record<string, string> = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
      };
      return (
        <div className="relative group">
          <button className="px-4 py-2 bg-[var(--surface-2)] text-[var(--fg)] text-sm rounded-md border border-[var(--border)] hover:bg-[var(--border)] transition-colors">
            {props.label as string}
          </button>
          <div className={cn("absolute hidden group-hover:block px-3 py-1.5 bg-[var(--surface-2)] text-[var(--fg)] text-xs rounded-md whitespace-nowrap z-10 border border-[var(--border)]", positions[props.position as string])}>
            {props.tooltip as string}
          </div>
        </div>
      );
    },
    code: (props) => `<Tooltip content="${props.tooltip}" position="${props.position}">\n  <Button>${props.label}</Button>\n</Tooltip>`,
  },
  {
    id: "tabs",
    name: "Tabs",
    category: "Navigation",
    defaultProps: { variant: "default" },
    controls: [
      { key: "variant", label: "Variant", type: "select", options: ["default", "pills", "underline"] },
    ],
    render: (props) => {
      const items = ["Overview", "Settings", "Analytics"];
      const variants: Record<string, { container: string; active: string; inactive: string }> = {
        default: { container: "bg-[var(--surface)] rounded-lg p-1", active: "bg-[var(--surface-2)] text-[var(--fg)] rounded-md", inactive: "text-[var(--muted)]" },
        pills: { container: "gap-2", active: "bg-indigo-600 text-white rounded-full", inactive: "text-[var(--muted)] hover:text-[var(--fg)]" },
        underline: { container: "border-b border-[var(--border)] gap-4", active: "text-[var(--fg)] border-b-2 border-indigo-500 -mb-px", inactive: "text-[var(--muted)] pb-px" },
      };
      const v = variants[props.variant as string];
      return (
        <div className={cn("flex items-center", v.container)}>
          {items.map((item, i) => (
            <button key={item} className={cn("px-3 py-1.5 text-sm font-medium transition-colors", i === 0 ? v.active : v.inactive)}>
              {item}
            </button>
          ))}
        </div>
      );
    },
    code: (props) => `<Tabs variant="${props.variant}">\n  <Tab>Overview</Tab>\n  <Tab>Settings</Tab>\n  <Tab>Analytics</Tab>\n</Tabs>`,
  },
];

const categoriesList = Array.from(new Set(components.map((c) => c.category)));

export function ComponentExplorer() {
  const [selectedId, setSelectedId] = useState("button");
  const [componentProps, setComponentProps] = useState<Record<string, Record<string, unknown>>>(
    Object.fromEntries(components.map((c) => [c.id, { ...c.defaultProps }]))
  );

  const selected = components.find((c) => c.id === selectedId)!;
  const props = componentProps[selectedId];

  const updateProp = (key: string, value: unknown) => {
    setComponentProps((prev) => ({
      ...prev,
      [selectedId]: { ...prev[selectedId], [key]: value },
    }));
  };

  const code = selected.code(props);

  const codeOutputs: CodeOutput[] = [
    { language: "react", label: "React", syntaxLang: "jsx", code },
    { language: "html", label: "HTML", syntaxLang: "html", code: `<!-- ${selected.name} Component -->\n${code}` },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Component list */}
        <div className="w-48 bg-[var(--surface)] border-r border-[var(--border)] overflow-y-auto shrink-0">
          {categoriesList.map((cat) => (
            <div key={cat}>
              <p className="px-4 pt-4 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-400/80">{cat}</p>
              {components.filter((c) => c.category === cat).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm transition-colors",
                    selectedId === c.id ? "text-[var(--fg)] bg-indigo-600/10 border-r-2 border-indigo-500" : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="flex-1 bg-[var(--bg)] flex items-center justify-center p-10 overflow-auto">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {selected.render(props)}
          </motion.div>
        </div>

        {/* Right controls */}
        <aside className="w-72 bg-[var(--surface)] border-l border-[var(--border)] overflow-y-auto p-5 space-y-6">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80 mb-4">Controls</h3>
            <div className="space-y-4">
              {selected.controls.map((ctrl) => (
                <div key={ctrl.key} className="space-y-2">
                  <label className="text-xs text-[var(--fg)] font-medium">{ctrl.label}</label>
                  {ctrl.type === "text" && (
                    <input
                      type="text"
                      value={props[ctrl.key] as string}
                      onChange={(e) => updateProp(ctrl.key, e.target.value)}
                      className="w-full h-8 px-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--fg)] focus:outline-none focus:border-indigo-500"
                    />
                  )}
                  {ctrl.type === "select" && (
                    <select
                      value={props[ctrl.key] as string}
                      onChange={(e) => updateProp(ctrl.key, e.target.value)}
                      className="w-full h-8 px-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--fg)]"
                    >
                      {ctrl.options!.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  )}
                  {ctrl.type === "slider" && (
                    <Slider
                      value={[props[ctrl.key] as number]}
                      min={ctrl.min || 0}
                      max={ctrl.max || 100}
                      onValueChange={([v]) => updateProp(ctrl.key, v)}
                    />
                  )}
                  {ctrl.type === "color" && (
                    <input
                      type="color"
                      value={props[ctrl.key] as string}
                      onChange={(e) => updateProp(ctrl.key, e.target.value)}
                      className="w-full h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <CodeBlock outputs={codeOutputs} />
    </div>
  );
}
