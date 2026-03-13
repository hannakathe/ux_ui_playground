"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  Bell,
  User,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Settings,
  ChevronRight,
  ArrowLeft,
  MoreVertical,
  Star,
  MapPin,
  Clock,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Screen = "home" | "bottom-nav" | "fab" | "cards" | "settings" | "bottom-sheet" | "form";

const screens: { id: Screen; label: string }[] = [
  { id: "home", label: "Home Feed" },
  { id: "bottom-nav", label: "Bottom Nav" },
  { id: "fab", label: "FAB" },
  { id: "cards", label: "Cards" },
  { id: "settings", label: "Settings" },
  { id: "bottom-sheet", label: "Bottom Sheet" },
  { id: "form", label: "Mobile Form" },
];

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[375px] h-[812px] bg-zinc-950 rounded-[40px] border-4 border-zinc-700 overflow-hidden relative shadow-2xl">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-zinc-950 rounded-b-2xl z-20" />
      {/* Status bar */}
      <div className="h-12 bg-zinc-950 flex items-end justify-between px-8 pb-1 text-white text-xs">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-2 border border-white rounded-sm">
            <div className="w-2.5 h-full bg-white rounded-sm" />
          </div>
        </div>
      </div>
      <div className="h-[calc(100%-48px)] overflow-hidden relative">{children}</div>
      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-600 rounded-full" />
    </div>
  );
}

function BottomNavScreen() {
  const [active, setActive] = useState(0);
  const items = [
    { icon: Home, label: "Home" },
    { icon: Search, label: "Search" },
    { icon: Plus, label: "Create" },
    { icon: Bell, label: "Alerts" },
    { icon: User, label: "Profile" },
  ];
  return (
    <div className="h-full flex flex-col bg-zinc-900">
      <div className="flex-1 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">{items[active].label} Screen</p>
      </div>
      <div className="h-20 bg-zinc-950 border-t border-zinc-800 flex items-center justify-around px-4 pb-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} onClick={() => setActive(i)} className="flex flex-col items-center gap-1 relative">
              {active === i && (
                <motion.div layoutId="bottomNav" className="absolute -top-3 w-12 h-0.5 bg-indigo-500 rounded-full" />
              )}
              <Icon className={cn("w-5 h-5", active === i ? "text-indigo-500" : "text-zinc-500")} />
              <span className={cn("text-[10px]", active === i ? "text-indigo-500" : "text-zinc-500")}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FABScreen() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="h-full bg-zinc-900 relative">
      <div className="p-4">
        <h2 className="text-white font-semibold">FAB Demo</h2>
        <p className="text-zinc-400 text-sm mt-1">Tap the floating action button</p>
      </div>
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 z-10"
          onClick={() => setExpanded(false)}
        />
      )}
      <div className="absolute bottom-24 right-6 z-20 flex flex-col items-center gap-3">
        {expanded && (
          <>
            {[Camera, MessageCircle, Star].map((Icon, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shadow-lg"
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.button>
            ))}
          </>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded(!expanded)}
          className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center shadow-xl"
        >
          <motion.div animate={{ rotate: expanded ? 45 : 0 }}>
            <Plus className="w-6 h-6 text-white" />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}

function CardsScreen() {
  const cards = [
    { title: "Mountain Retreat", subtitle: "Aspen, Colorado", rating: 4.9, price: "$289" },
    { title: "Beach House", subtitle: "Malibu, California", rating: 4.7, price: "$425" },
    { title: "City Loft", subtitle: "Brooklyn, New York", rating: 4.8, price: "$198" },
  ];
  return (
    <div className="h-full bg-zinc-900 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-white font-semibold text-lg">Discover</h2>
        <p className="text-zinc-400 text-sm">Popular destinations</p>
      </div>
      <div className="px-4 space-y-4 pb-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-800 rounded-xl overflow-hidden"
          >
            <div className="h-40 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 relative">
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">{card.title}</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm text-white">{card.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-zinc-500" />
                <span className="text-xs text-zinc-400">{card.subtitle}</span>
              </div>
              <p className="text-white font-semibold mt-2">
                {card.price} <span className="text-zinc-400 text-xs font-normal">/night</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen() {
  const sections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", value: "John Doe" },
        { icon: Bell, label: "Notifications", value: "On" },
        { icon: Settings, label: "Privacy", value: "" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: Star, label: "Appearance", value: "Dark" },
        { icon: Clock, label: "Language", value: "English" },
      ],
    },
  ];
  return (
    <div className="h-full bg-zinc-900 overflow-y-auto">
      <div className="p-4 flex items-center gap-3">
        <ArrowLeft className="w-5 h-5 text-white" />
        <h2 className="text-white font-semibold text-lg">Settings</h2>
      </div>
      {sections.map((section) => (
        <div key={section.title} className="mb-4">
          <p className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-500">{section.title}</p>
          <div className="bg-zinc-800/50 mx-4 rounded-xl overflow-hidden">
            {section.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button key={i} className="w-full flex items-center justify-between px-4 py-3 border-b border-zinc-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-white">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && <span className="text-xs text-zinc-500">{item.value}</span>}
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function BottomSheetScreen() {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-full bg-zinc-900 relative">
      <div className="p-4">
        <h2 className="text-white font-semibold">Bottom Sheet</h2>
        <button
          onClick={() => setOpen(true)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg"
        >
          Open Sheet
        </button>
      </div>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 z-10"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", bounce: 0.15 }}
            className="absolute bottom-0 left-0 right-0 bg-zinc-800 rounded-t-2xl z-20 p-6"
          >
            <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto mb-6" />
            <h3 className="text-white font-semibold text-lg mb-2">Share</h3>
            <div className="flex gap-4 mb-6">
              {[MessageCircle, Share2, Heart, Star].map((Icon, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] text-zinc-400">Share</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-full py-3 bg-zinc-700 text-white text-sm rounded-xl"
            >
              Cancel
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}

function MobileFormScreen() {
  return (
    <div className="h-full bg-zinc-900 overflow-y-auto">
      <div className="p-4 flex items-center gap-3 border-b border-zinc-800">
        <ArrowLeft className="w-5 h-5 text-white" />
        <h2 className="text-white font-semibold">Create Account</h2>
      </div>
      <div className="p-4 space-y-4">
        {[
          { label: "Full Name", placeholder: "John Doe", type: "text" },
          { label: "Email", placeholder: "john@example.com", type: "email" },
          { label: "Password", placeholder: "********", type: "password" },
        ].map((field) => (
          <div key={field.label} className="space-y-1.5">
            <label className="text-xs text-zinc-400">{field.label}</label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              className="w-full h-12 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        ))}
        <button className="w-full h-12 bg-indigo-600 text-white font-medium rounded-xl mt-4">
          Sign Up
        </button>
        <p className="text-center text-xs text-zinc-500">
          Already have an account? <span className="text-indigo-400">Sign In</span>
        </p>
      </div>
    </div>
  );
}

export function MobileUI() {
  const [activeScreen, setActiveScreen] = useState<Screen>("home");

  const renderScreen = () => {
    switch (activeScreen) {
      case "bottom-nav":
        return <BottomNavScreen />;
      case "fab":
        return <FABScreen />;
      case "cards":
        return <CardsScreen />;
      case "settings":
        return <SettingsScreen />;
      case "bottom-sheet":
        return <BottomSheetScreen />;
      case "form":
        return <MobileFormScreen />;
      default:
        return <CardsScreen />;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Pattern list - right side */}
      <div className="flex-1 bg-[var(--bg)] flex items-center justify-center">
        <PhoneFrame>{renderScreen()}</PhoneFrame>
      </div>

      <div className="w-72 bg-[var(--surface)] border-l border-[var(--border)] overflow-y-auto p-5 space-y-6">
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80">
            Mobile Patterns
          </h3>
          <div className="space-y-1">
            {screens.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveScreen(s.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  activeScreen === s.id
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                    : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
