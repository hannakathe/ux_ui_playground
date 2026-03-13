"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Demo = "drag" | "hover" | "tap" | "scroll" | "gestures" | "swipe";

const demos: { id: Demo; label: string }[] = [
  { id: "drag", label: "Drag" },
  { id: "hover", label: "Hover Effects" },
  { id: "tap", label: "Tap / Press" },
  { id: "scroll", label: "Scroll Animate" },
  { id: "gestures", label: "Gesture Chain" },
  { id: "swipe", label: "Swipe Cards" },
];

function DragDemo() {
  return (
    <div className="relative w-80 h-80 bg-[var(--surface-2)] rounded-xl border border-dashed border-[var(--border-light)] flex items-center justify-center">
      <p className="absolute top-3 left-3 text-xs text-[var(--muted)]">Drag within bounds</p>
      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        dragElastic={0.1}
        whileDrag={{ scale: 1.1 }}
        className="w-20 h-20 bg-indigo-600 rounded-xl cursor-grab active:cursor-grabbing flex items-center justify-center shadow-lg"
      >
        <span className="text-white text-xs font-medium">Drag me</span>
      </motion.div>
    </div>
  );
}

function HoverDemo() {
  const cards = [
    { color: "bg-indigo-600", label: "Scale" },
    { color: "bg-purple-600", label: "Rotate" },
    { color: "bg-cyan-600", label: "Glow" },
    { color: "bg-pink-600", label: "Lift" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          className={cn(
            "w-32 h-32 rounded-xl flex items-center justify-center cursor-pointer",
            card.color
          )}
          whileHover={
            i === 0
              ? { scale: 1.15 }
              : i === 1
              ? { rotate: 10, scale: 1.05 }
              : i === 2
              ? { boxShadow: "0 0 30px rgba(99,102,241,0.5)" }
              : { y: -10, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)" }
          }
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <span className="text-white text-sm font-medium">{card.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

function TapDemo() {
  const [taps, setTaps] = useState(0);
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setTaps((t) => t + 1)}
        className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
      >
        <span className="text-white text-lg font-bold">{taps}</span>
      </motion.button>
      <p className="text-[var(--muted)] text-sm">Tap the circle</p>
      <div className="flex gap-2">
        {[...Array(Math.min(taps, 10))].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 rounded-full bg-indigo-400"
          />
        ))}
      </div>
    </div>
  );
}

function ScrollDemo() {
  return (
    <div className="w-80 h-80 overflow-y-auto bg-[var(--surface-2)] rounded-xl border border-[var(--border)] p-4 space-y-4">
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.1 }}
          className="h-16 bg-[var(--surface)] rounded-lg flex items-center px-4 border border-[var(--border)]"
        >
          <span className="text-[var(--fg)] text-sm">Scroll item {i + 1}</span>
        </motion.div>
      ))}
    </div>
  );
}

function GestureChainDemo() {
  const [step, setStep] = useState(0);
  const steps = ["Hover", "Click", "Drag", "Done!"];
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-2 mb-4">
        {steps.map((s, i) => (
          <div
            key={i}
            className={cn(
              "px-3 py-1 rounded-full text-xs",
              step >= i ? "bg-indigo-600 text-white" : "bg-[var(--surface-2)] text-[var(--muted)]"
            )}
          >
            {s}
          </div>
        ))}
      </div>
      <motion.div
        onHoverStart={() => step === 0 && setStep(1)}
        onClick={() => step === 1 && setStep(2)}
        drag={step === 2}
        dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
        onDragEnd={() => step === 2 && setStep(3)}
        whileHover={step === 0 ? { scale: 1.1, backgroundColor: "#6366f1" } : {}}
        whileTap={step === 1 ? { scale: 0.95 } : {}}
        className={cn(
          "w-32 h-32 rounded-xl flex items-center justify-center cursor-pointer",
          step === 3 ? "bg-green-600" : step >= 2 ? "bg-purple-600" : "bg-[var(--surface-2)]"
        )}
      >
        <span className="text-[var(--fg)] text-sm font-medium">
          {step === 0 ? "Hover" : step === 1 ? "Click" : step === 2 ? "Drag" : "Done!"}
        </span>
      </motion.div>
      {step === 3 && (
        <button
          onClick={() => setStep(0)}
          className="text-xs text-[var(--muted)] hover:text-[var(--fg)]"
        >
          Reset
        </button>
      )}
    </div>
  );
}

function SwipeDemo() {
  const [cards, setCards] = useState([0, 1, 2]);

  const handleDragEnd = (index: number, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > 100) {
      setCards((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const colors = ["bg-indigo-600", "bg-purple-600", "bg-pink-600", "bg-cyan-600"];

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs text-[var(--muted)] mb-2">Swipe cards left or right</p>
      <div className="relative w-64 h-80">
        {cards.map((card, i) => (
          <motion.div
            key={card}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => handleDragEnd(i, info)}
            className={cn(
              "absolute inset-0 rounded-xl p-6 flex flex-col justify-end cursor-grab active:cursor-grabbing",
              colors[card % colors.length]
            )}
            style={{ zIndex: cards.length - i }}
            initial={{ scale: 1 - i * 0.05, y: i * 8 }}
            animate={{ scale: 1 - i * 0.05, y: i * 8 }}
          >
            <h3 className="text-white font-bold text-xl">Card {card + 1}</h3>
            <p className="text-white/70 text-sm mt-1">Swipe to dismiss</p>
          </motion.div>
        ))}
        {cards.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setCards([0, 1, 2])}
              className="px-4 py-2 bg-[var(--surface-2)] text-[var(--fg)] text-sm rounded-lg"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function InteractionsExplorer() {
  const [activeDemo, setActiveDemo] = useState<Demo>("drag");

  const renderDemo = () => {
    switch (activeDemo) {
      case "drag": return <DragDemo />;
      case "hover": return <HoverDemo />;
      case "tap": return <TapDemo />;
      case "scroll": return <ScrollDemo />;
      case "gestures": return <GestureChainDemo />;
      case "swipe": return <SwipeDemo />;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 bg-[var(--bg)] flex items-center justify-center">
        {renderDemo()}
      </div>

      <div className="w-72 bg-[var(--surface)] border-l border-[var(--border)] overflow-y-auto p-5 space-y-6">
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80">
            Interactions
          </h3>
          <div className="space-y-1">
            {demos.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDemo(d.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  activeDemo === d.id
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                    : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
