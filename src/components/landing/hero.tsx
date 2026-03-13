"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Box,
  Palette,
  Layers,
  Sparkles,
  ArrowRight,
  Grid3X3,
  Smartphone,
  MousePointerClick,
  Component,
  Type,
  SlidersHorizontal,
} from "lucide-react";

function FloatingIcon({
  icon: Icon,
  delay,
  x,
  y,
  color,
}: {
  icon: React.ElementType;
  delay: number;
  x: number;
  y: number;
  color: string;
}) {
  return (
    <motion.div
      className="absolute hidden md:block"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.5, 0.5, 0],
        scale: [0.5, 1, 1, 0.5],
        y: [0, -20, -20, 0],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut",
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/5"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </motion.div>
  );
}

function GradientOrb({
  color,
  size,
  x,
  y,
  delay,
}: {
  color: string;
  size: number;
  x: number;
  y: number;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
      }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -30, 20, 0],
        scale: [1, 1.2, 0.9, 1],
      }}
      transition={{ duration: 12, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-colors cursor-default"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
      <p className="text-zinc-500 text-xs leading-relaxed">{description}</p>
    </motion.div>
  );
}

function TypewriterText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    if (!deleting && displayed.length < current.length) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === current.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }
  }, [displayed, deleting, index, texts]);

  return (
    <span className="text-indigo-400">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[2px] h-[1em] bg-indigo-400 ml-0.5 align-middle"
      />
    </span>
  );
}

interface HeroProps {
  onEnter: () => void;
}

export function Hero({ onEnter }: HeroProps) {
  const features = [
    { icon: Component, title: "Component Explorer", description: "Browse, customize and preview UI components with live controls", color: "#818cf8" },
    { icon: Palette, title: "Color Palette Generator", description: "Generate beautiful color palettes with multiple harmony algorithms", color: "#f472b6" },
    { icon: Layers, title: "Layout Playground", description: "Visually experiment with Flexbox, CSS Grid and responsive layouts", color: "#34d399" },
    { icon: Sparkles, title: "Animation Studio", description: "Explore Framer Motion presets with spring and tween controls", color: "#fbbf24" },
    { icon: Smartphone, title: "Mobile UI Patterns", description: "Preview mobile navigation, bottom sheets, FABs and gestures", color: "#22d3ee" },
    { icon: SlidersHorizontal, title: "Design Tokens", description: "Edit and export color, spacing, typography and shadow tokens", color: "#a78bfa" },
  ];

  return (
    <div className="relative min-h-screen bg-[#09090b] flex flex-col items-center justify-center overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <GradientOrb color="#6366f1" size={600} x={20} y={10} delay={0} />
      <GradientOrb color="#ec4899" size={400} x={70} y={60} delay={3} />
      <GradientOrb color="#06b6d4" size={500} x={50} y={30} delay={6} />

      <FloatingIcon icon={Box} delay={0} x={10} y={15} color="#818cf8" />
      <FloatingIcon icon={Palette} delay={1.5} x={85} y={20} color="#f472b6" />
      <FloatingIcon icon={Grid3X3} delay={3} x={15} y={70} color="#34d399" />
      <FloatingIcon icon={Type} delay={4.5} x={80} y={65} color="#fbbf24" />
      <FloatingIcon icon={MousePointerClick} delay={2} x={90} y={45} color="#22d3ee" />
      <FloatingIcon icon={Layers} delay={5} x={5} y={45} color="#a78bfa" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-zinc-400">Interactive UI/UX Exploration Platform</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold text-white tracking-tight mb-6"
        >
          UX/UI{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Playground
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-xl text-zinc-400 mb-4 max-w-2xl mx-auto leading-relaxed"
        >
          Explore, experiment and build with{" "}
          <TypewriterText
            texts={[
              "interactive components",
              "color palettes",
              "Flexbox & Grid layouts",
              "Framer Motion animations",
              "mobile UI patterns",
              "design tokens",
            ]}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-sm text-zinc-600 mb-12 max-w-lg mx-auto"
        >
          A visual workspace for designers and developers to manipulate UI
          elements, generate code, and craft beautiful interfaces in real time.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <motion.button
            onClick={onEnter}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors flex items-center gap-2.5 text-sm shadow-lg shadow-indigo-600/20"
          >
            Open Playground
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={0.8 + i * 0.1} />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-16 mb-8"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={onEnter}
          >
            <span className="text-xs text-zinc-600">Click to start exploring</span>
            <div className="w-5 h-8 rounded-full border border-zinc-700 flex items-start justify-center p-1.5">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-1 rounded-full bg-zinc-500"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
