"use client";

import { useState } from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface AnimationPreset {
  id: string;
  name: string;
  variants: {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
  };
}

const presets: AnimationPreset[] = [
  {
    id: "fade-in",
    name: "Fade In",
    variants: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  },
  {
    id: "slide-up",
    name: "Slide Up",
    variants: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
  },
  {
    id: "slide-down",
    name: "Slide Down",
    variants: { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
  },
  {
    id: "slide-left",
    name: "Slide Left",
    variants: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
  },
  {
    id: "slide-right",
    name: "Slide Right",
    variants: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
  },
  {
    id: "scale",
    name: "Scale",
    variants: { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 } },
  },
  {
    id: "rotate",
    name: "Rotate",
    variants: { initial: { opacity: 0, rotate: -180 }, animate: { opacity: 1, rotate: 0 } },
  },
  {
    id: "flip",
    name: "Flip",
    variants: { initial: { opacity: 0, rotateY: 90 }, animate: { opacity: 1, rotateY: 0 } },
  },
  {
    id: "bounce",
    name: "Bounce",
    variants: { initial: { opacity: 0, y: -60 }, animate: { opacity: 1, y: 0 } },
  },
  {
    id: "zoom-rotate",
    name: "Zoom Rotate",
    variants: { initial: { opacity: 0, scale: 0, rotate: 180 }, animate: { opacity: 1, scale: 1, rotate: 0 } },
  },
];

export function AnimationExplorer() {
  const [selectedId, setSelectedId] = useState("fade-in");
  const [duration, setDuration] = useState(0.5);
  const [delay, setDelay] = useState(0);
  const [type, setType] = useState<"spring" | "tween">("spring");
  const [bounce, setBounce] = useState(0.25);
  const [key, setKey] = useState(0);

  const selected = presets.find((p) => p.id === selectedId)!;

  const replay = () => setKey((k) => k + 1);

  const transition =
    type === "spring"
      ? { type: "spring" as const, duration, delay, bounce }
      : { type: "tween" as const, duration, delay, ease: "easeOut" as const };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-64 bg-zinc-950 border-r border-zinc-800 p-4 space-y-4 overflow-y-auto">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Animations</h3>
          <p className="text-xs text-zinc-500">Explore Framer Motion presets</p>
        </div>

        <div className="space-y-1">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                setKey((k) => k + 1);
              }}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                selectedId === p.id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="pt-3 border-t border-zinc-800 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Settings</p>
          <div className="flex gap-1">
            {(["spring", "tween"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "flex-1 py-1.5 text-xs rounded-md transition-colors capitalize",
                  type === t ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Duration</label>
              <span className="text-xs text-zinc-500 font-mono">{duration.toFixed(1)}s</span>
            </div>
            <Slider value={[duration * 10]} min={1} max={30} onValueChange={([v]) => setDuration(v / 10)} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-400">Delay</label>
              <span className="text-xs text-zinc-500 font-mono">{delay.toFixed(1)}s</span>
            </div>
            <Slider value={[delay * 10]} min={0} max={20} onValueChange={([v]) => setDelay(v / 10)} />
          </div>
          {type === "spring" && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs text-zinc-400">Bounce</label>
                <span className="text-xs text-zinc-500 font-mono">{bounce.toFixed(2)}</span>
              </div>
              <Slider value={[bounce * 100]} min={0} max={100} onValueChange={([v]) => setBounce(v / 100)} />
            </div>
          )}
        </div>

        <button
          onClick={replay}
          className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          Replay
        </button>
      </div>

      <div className="flex-1 bg-zinc-900 flex items-center justify-center">
        <motion.div
          key={key}
          initial={selected.variants.initial}
          animate={selected.variants.animate}
          transition={transition}
          className="w-48 h-48 bg-indigo-600 rounded-xl flex items-center justify-center"
        >
          <span className="text-white font-medium">{selected.name}</span>
        </motion.div>
      </div>
    </div>
  );
}
