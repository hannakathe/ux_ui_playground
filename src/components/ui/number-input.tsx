"use client";

import { useState, useRef, useEffect } from "react";

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  unit = "px",
  className = "",
}: NumberInputProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(String(value));
  }, [value, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const n = parseFloat(draft);
    if (!isNaN(n)) {
      onChange(Math.min(max, Math.max(min, n)));
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={draft}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
        className={`w-16 h-6 px-1.5 bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-100 border border-indigo-500 rounded text-xs text-center font-mono outline-none ${className}`}
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={`h-6 px-2 rounded text-[11px] font-mono cursor-text transition-colors
        bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]
        hover:border-indigo-500/50 hover:text-[var(--fg)] ${className}`}
    >
      {value}{unit}
    </button>
  );
}
