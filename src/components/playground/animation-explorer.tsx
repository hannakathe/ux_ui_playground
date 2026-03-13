"use client";

import { useState, useMemo } from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { NumberInput } from "@/components/ui/number-input";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import type { CodeOutput } from "@/lib/code-generators";

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

function generateFramerCode(
  preset: AnimationPreset,
  type: "spring" | "tween",
  duration: number,
  delay: number,
  bounce: number
): string {
  const initial = JSON.stringify(preset.variants.initial, null, 2);
  const animate = JSON.stringify(preset.variants.animate, null, 2);

  const transitionProps =
    type === "spring"
      ? `    type: "spring",\n    duration: ${duration},\n    delay: ${delay},\n    bounce: ${bounce},`
      : `    type: "tween",\n    duration: ${duration},\n    delay: ${delay},\n    ease: "easeOut",`;

  return `import { motion } from "framer-motion";

export function AnimatedElement() {
  return (
    <motion.div
      initial={${initial.replace(/\n/g, "\n      ")}}
      animate={${animate.replace(/\n/g, "\n      ")}}
      transition={{
${transitionProps}
      }}
    >
      {/* content */}
    </motion.div>
  );
}`;
}

function generateCSSKeyframes(
  preset: AnimationPreset,
  duration: number,
  delay: number
): string {
  const initial = preset.variants.initial as Record<string, unknown>;
  const animate = preset.variants.animate as Record<string, unknown>;

  const toCSSProp = (key: string, val: unknown): string => {
    switch (key) {
      case "opacity":
        return `opacity: ${val}`;
      case "x":
        return `transform: translateX(${val}px)`;
      case "y":
        return `transform: translateY(${val}px)`;
      case "scale":
        return `transform: scale(${val})`;
      case "rotate":
        return `transform: rotate(${val}deg)`;
      case "rotateY":
        return `transform: rotateY(${val}deg)`;
      default:
        return "";
    }
  };

  // Merge transforms for from/to
  const buildBlock = (obj: Record<string, unknown>) => {
    const transforms: string[] = [];
    const props: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      if (k === "opacity") {
        props.push(`  opacity: ${v};`);
      } else {
        const css = toCSSProp(k, v);
        if (css.startsWith("transform:")) {
          transforms.push(css.replace("transform: ", ""));
        }
      }
    }
    if (transforms.length > 0) {
      props.push(`  transform: ${transforms.join(" ")};`);
    }
    return props.join("\n");
  };

  const fromBlock = buildBlock(initial);
  const toBlock = buildBlock(animate);

  return `@keyframes ${preset.id} {
  from {
${fromBlock}
  }
  to {
${toBlock}
  }
}

.animated-element {
  animation: ${preset.id} ${duration}s ease-out ${delay}s both;
}`;
}

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

  const codeOutputs = useMemo<CodeOutput[]>(() => {
    return [
      {
        language: "react",
        label: "React (Framer Motion)",
        code: generateFramerCode(selected, type, duration, delay, bounce),
        syntaxLang: "tsx",
      },
      {
        language: "css",
        label: "CSS @keyframes",
        code: generateCSSKeyframes(selected, duration, delay),
        syntaxLang: "css",
      },
    ];
  }, [selected, type, duration, delay, bounce]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Preview + Controls */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview area */}
        <div className="flex-1 bg-[var(--bg)] flex items-center justify-center p-10">
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

        {/* Right side panel */}
        <div className="w-72 bg-[var(--surface)] border-l border-[var(--border)] overflow-y-auto p-5 space-y-6">
          {/* Presets */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80">
              Presets
            </h3>
            <div className="space-y-1">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedId(p.id);
                    setKey((k) => k + 1);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    selectedId === p.id
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]"
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80">
              Transition
            </h3>

            {/* Spring / Tween toggle */}
            <div className="space-y-2">
              <label className="text-xs text-[var(--fg)] font-medium">Type</label>
              <div className="flex gap-1">
                {(["spring", "tween"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={cn(
                      "flex-1 py-2 text-xs rounded-md transition-colors capitalize",
                      type === t
                        ? "bg-indigo-600 text-white"
                        : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--fg)]"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[var(--fg)] font-medium">Duration</label>
                <NumberInput
                  value={parseFloat(duration.toFixed(1))}
                  onChange={(v) => setDuration(v)}
                  min={0.1}
                  max={3}
                  step={0.1}
                  unit="s"
                />
              </div>
              <Slider
                value={[duration * 10]}
                min={1}
                max={30}
                onValueChange={([v]) => setDuration(v / 10)}
              />
            </div>

            {/* Delay */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[var(--fg)] font-medium">Delay</label>
                <NumberInput
                  value={parseFloat(delay.toFixed(1))}
                  onChange={(v) => setDelay(v)}
                  min={0}
                  max={2}
                  step={0.1}
                  unit="s"
                />
              </div>
              <Slider
                value={[delay * 10]}
                min={0}
                max={20}
                onValueChange={([v]) => setDelay(v / 10)}
              />
            </div>

            {/* Bounce (spring only) */}
            {type === "spring" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[var(--fg)] font-medium">Bounce</label>
                  <NumberInput
                    value={parseFloat(bounce.toFixed(2))}
                    onChange={(v) => setBounce(v)}
                    min={0}
                    max={1}
                    step={0.01}
                    unit=""
                  />
                </div>
                <Slider
                  value={[bounce * 100]}
                  min={0}
                  max={100}
                  onValueChange={([v]) => setBounce(v / 100)}
                />
              </div>
            )}
          </div>

          {/* Replay button */}
          <button
            onClick={replay}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Replay
          </button>
        </div>
      </div>

      {/* Code output */}
      <CodeBlock outputs={codeOutputs} />
    </div>
  );
}
