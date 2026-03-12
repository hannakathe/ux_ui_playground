"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, ChevronRight, X, Bell, AlertTriangle, Info, User, Search, Menu, Heart, Star, ArrowRight, Plus, Settings, Mail } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

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
        secondary: "bg-zinc-700 hover:bg-zinc-600 text-white",
        outline: "border border-zinc-600 hover:bg-zinc-800 text-white",
        ghost: "hover:bg-zinc-800 text-zinc-300",
        destructive: "bg-red-600 hover:bg-red-700 text-white",
      };
      const sizes: Record<string, string> = { sm: "px-3 py-1 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
      return (
        <button
          className={cn("font-medium transition-colors", variants[props.variant as string], sizes[props.size as string])}
          style={{ borderRadius: `${props.rounded}px` }}
        >
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
        default: "border border-zinc-700 bg-zinc-900 rounded-md",
        filled: "bg-zinc-800 border-none rounded-md",
        underline: "border-b border-zinc-700 bg-transparent rounded-none",
      };
      return (
        <input
          placeholder={props.placeholder as string}
          className={cn("text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64", sizes[props.size as string], variants[props.variant as string])}
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
        <div className={cn("bg-zinc-800 border border-zinc-700 p-6 w-72", shadows[props.shadow as string])} style={{ borderRadius: `${props.rounded}px` }}>
          <h3 className="text-white font-semibold text-lg">{props.title as string}</h3>
          <p className="text-zinc-400 text-sm mt-2">{props.description as string}</p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors">
            Action
          </button>
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
        default: "bg-zinc-700 text-zinc-200",
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
            <p className="text-white text-sm font-medium">{props.title as string}</p>
            <p className="text-zinc-400 text-xs mt-1">{props.description as string}</p>
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
          <button className="px-4 py-2 bg-zinc-800 text-white text-sm rounded-md border border-zinc-700 hover:bg-zinc-700 transition-colors">
            {props.label as string}
          </button>
          <div className={cn("absolute hidden group-hover:block px-3 py-1.5 bg-zinc-700 text-white text-xs rounded-md whitespace-nowrap z-10", positions[props.position as string])}>
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
        default: { container: "bg-zinc-900 rounded-lg p-1", active: "bg-zinc-800 text-white rounded-md", inactive: "text-zinc-400" },
        pills: { container: "gap-2", active: "bg-indigo-600 text-white rounded-full", inactive: "text-zinc-400 hover:text-white" },
        underline: { container: "border-b border-zinc-800 gap-4", active: "text-white border-b-2 border-indigo-500 -mb-px", inactive: "text-zinc-400 pb-px" },
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

const categories = Array.from(new Set(components.map((c) => c.category)));

export function ComponentExplorer() {
  const [selectedId, setSelectedId] = useState("button");
  const [componentProps, setComponentProps] = useState<Record<string, Record<string, unknown>>>(
    Object.fromEntries(components.map((c) => [c.id, { ...c.defaultProps }]))
  );
  const [copiedCode, setCopiedCode] = useState(false);

  const selected = components.find((c) => c.id === selectedId)!;
  const props = componentProps[selectedId];

  const updateProp = (key: string, value: unknown) => {
    setComponentProps((prev) => ({
      ...prev,
      [selectedId]: { ...prev[selectedId], [key]: value },
    }));
  };

  const code = selected.code(props);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Component list */}
      <div className="w-52 bg-zinc-950 border-r border-zinc-800 overflow-y-auto">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {cat}
            </p>
            {components
              .filter((c) => c.category === cat)
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "w-full text-left px-4 py-1.5 text-sm transition-colors",
                    selectedId === c.id
                      ? "text-white bg-zinc-800"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  {c.name}
                </button>
              ))}
          </div>
        ))}
      </div>

      {/* Preview + Controls */}
      <div className="flex-1 flex flex-col">
        {/* Preview */}
        <div className="flex-1 bg-zinc-900 flex items-center justify-center p-8">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {selected.render(props)}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="h-56 bg-zinc-950 border-t border-zinc-800 flex">
          <div className="w-64 border-r border-zinc-800 p-4 overflow-y-auto">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Controls
            </p>
            <div className="space-y-3">
              {selected.controls.map((ctrl) => (
                <div key={ctrl.key} className="space-y-1">
                  <label className="text-xs text-zinc-400">{ctrl.label}</label>
                  {ctrl.type === "text" && (
                    <input
                      type="text"
                      value={props[ctrl.key] as string}
                      onChange={(e) => updateProp(ctrl.key, e.target.value)}
                      className="w-full h-7 px-2 rounded bg-zinc-800 border border-zinc-700 text-xs text-white"
                    />
                  )}
                  {ctrl.type === "select" && (
                    <select
                      value={props[ctrl.key] as string}
                      onChange={(e) => updateProp(ctrl.key, e.target.value)}
                      className="w-full h-7 px-2 rounded bg-zinc-800 border border-zinc-700 text-xs text-white"
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
                      className="w-full h-7 rounded bg-zinc-800 border border-zinc-700 cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto relative">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Code
            </p>
            <button
              onClick={copyCode}
              className="absolute top-4 right-4 p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <SyntaxHighlighter
              language="jsx"
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: "8px",
                fontSize: "12px",
                background: "#18181b",
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
}
