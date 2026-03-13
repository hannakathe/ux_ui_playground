"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Home,
  Settings,
  User,
  Bell,
  Search,
  Menu,
  ChevronRight,
  Mail,
  BarChart3,
  FileText,
  Folder,
  Star,
  X,
  Minus,
  Square,
  Plus,
} from "lucide-react";

type PatternId = "dashboard" | "settings" | "sidebar-nav" | "modal-dialog" | "data-table" | "toolbar";

const patterns: { id: PatternId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "settings", label: "Settings Page" },
  { id: "sidebar-nav", label: "Sidebar Navigation" },
  { id: "modal-dialog", label: "Modal Dialog" },
  { id: "data-table", label: "Data Table" },
  { id: "toolbar", label: "Toolbar" },
];

function WindowFrame({ children, title = "App" }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="w-full max-w-3xl bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl shadow-black/20">
      <div className="h-8 bg-[var(--surface-2)] border-b border-[var(--border)] flex items-center px-3 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-[10px] text-[var(--muted)] ml-2">{title}</span>
      </div>
      {children}
    </div>
  );
}

function DashboardPattern() {
  return (
    <WindowFrame title="Dashboard - App">
      <div className="flex h-80">
        <div className="w-48 border-r border-[var(--border)] p-3 space-y-1">
          {[{ icon: Home, label: "Dashboard", active: true }, { icon: BarChart3, label: "Analytics" }, { icon: Mail, label: "Messages" }, { icon: FileText, label: "Documents" }, { icon: Settings, label: "Settings" }].map((item) => (
            <div key={item.label} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-md text-xs", item.active ? "bg-indigo-600/15 text-indigo-400" : "text-[var(--muted)]")}>
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </div>
          ))}
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Users", value: "2,841", color: "text-indigo-400" }, { label: "Revenue", value: "$12.4k", color: "text-green-400" }, { label: "Orders", value: "384", color: "text-amber-400" }].map((s) => (
              <div key={s.label} className="bg-[var(--surface-2)] rounded-lg p-3">
                <p className="text-[10px] text-[var(--muted)]">{s.label}</p>
                <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-[var(--surface-2)] rounded-lg p-3 flex-1">
            <p className="text-xs text-[var(--muted)] mb-2">Activity</p>
            <div className="flex items-end gap-1 h-20">
              {[40, 60, 30, 80, 50, 70, 90, 45, 65, 55, 75, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-500/30 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

function SettingsPattern() {
  return (
    <WindowFrame title="Settings">
      <div className="flex h-80">
        <div className="w-44 border-r border-[var(--border)] p-3 space-y-0.5">
          {["General", "Appearance", "Notifications", "Privacy", "Account"].map((s, i) => (
            <div key={s} className={cn("px-2 py-1.5 rounded-md text-xs", i === 0 ? "bg-indigo-600/15 text-indigo-400" : "text-[var(--muted)]")}>{s}</div>
          ))}
        </div>
        <div className="flex-1 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--fg)]">General Settings</h3>
          {[{ label: "Language", value: "English" }, { label: "Timezone", value: "UTC-5" }, { label: "Date Format", value: "MM/DD/YYYY" }].map((s) => (
            <div key={s.label} className="flex items-center justify-between py-2 border-b border-[var(--border)]">
              <span className="text-xs text-[var(--fg)]">{s.label}</span>
              <span className="text-xs text-[var(--muted)] bg-[var(--surface-2)] px-2 py-1 rounded">{s.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs text-[var(--fg)]">Dark Mode</span>
              <p className="text-[10px] text-[var(--muted)]">Use dark theme</p>
            </div>
            <div className="w-8 h-4 bg-indigo-600 rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

function DataTablePattern() {
  const rows = [
    { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active" },
    { name: "Bob Wilson", email: "bob@example.com", role: "Viewer", status: "Inactive" },
    { name: "Alice Brown", email: "alice@example.com", role: "Editor", status: "Active" },
  ];
  return (
    <WindowFrame title="Users - Data Table">
      <div className="p-4 space-y-3 h-80 overflow-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[var(--surface-2)] rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span className="text-xs text-[var(--muted)]">Search users...</span>
          </div>
          <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add User
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["Name", "Email", "Role", "Status"].map((h) => (
                <th key={h} className="text-left py-2 text-[var(--muted)] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]">
                <td className="py-2 text-[var(--fg)]">{r.name}</td>
                <td className="py-2 text-[var(--muted)]">{r.email}</td>
                <td className="py-2"><span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[10px]">{r.role}</span></td>
                <td className="py-2"><span className={cn("px-1.5 py-0.5 rounded text-[10px]", r.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-zinc-500/10 text-zinc-400")}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WindowFrame>
  );
}

export function DesktopPatterns() {
  const [active, setActive] = useState<PatternId>("dashboard");

  const renderPattern = () => {
    switch (active) {
      case "dashboard": return <DashboardPattern />;
      case "settings": return <SettingsPattern />;
      case "data-table": return <DataTablePattern />;
      default: return <DashboardPattern />;
    }
  };

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-bold text-[var(--fg)]">Desktop UI Patterns</h2>
          <p className="text-sm text-[var(--muted)] mt-1">Common desktop application interface patterns</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {patterns.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                active === p.id ? "bg-indigo-600 text-white" : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--fg)]"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          {renderPattern()}
        </div>
      </div>
    </div>
  );
}
