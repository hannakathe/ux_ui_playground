"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Copy, Check, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { NumberInput } from "@/components/ui/number-input";
import { CodeBlock } from "@/components/ui/code-block";
import type { CodeOutput } from "@/lib/code-generators";

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
}

export function ImageUpload() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selected, setSelected] = useState<UploadedImage | null>(null);
  const [borderRadius, setBorderRadius] = useState(0);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [objectFit, setObjectFit] = useState<string>("cover");
  const [opacity, setOpacity] = useState(100);
  const [shadow, setShadow] = useState("none");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      const img: UploadedImage = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        file,
        url,
        name: file.name,
      };
      setImages((prev) => [...prev, img]);
      if (!selected) setSelected(img);
    });
  }, [selected]);

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
    if (selected?.id === id) setSelected(images.find((i) => i.id !== id) || null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const shadowOptions = [
    { value: "none", label: "None" },
    { value: "0 4px 6px -1px rgb(0 0 0 / 0.1)", label: "Small" },
    { value: "0 10px 15px -3px rgb(0 0 0 / 0.1)", label: "Medium" },
    { value: "0 20px 25px -5px rgb(0 0 0 / 0.1)", label: "Large" },
    { value: "0 25px 50px -12px rgb(0 0 0 / 0.25)", label: "XL" },
  ];

  const codeOutputs: CodeOutput[] = selected ? [
    {
      language: "html",
      label: "HTML",
      syntaxLang: "html",
      code: `<img\n  src="${selected.name}"\n  alt="Image"\n  style="width: ${width}px; height: ${height}px; border-radius: ${borderRadius}px; object-fit: ${objectFit}; opacity: ${opacity / 100};${shadow !== "none" ? ` box-shadow: ${shadow};` : ""}"\n/>`,
    },
    {
      language: "css",
      label: "CSS",
      syntaxLang: "css",
      code: `.image {\n  width: ${width}px;\n  height: ${height}px;\n  border-radius: ${borderRadius}px;\n  object-fit: ${objectFit};\n  opacity: ${opacity / 100};${shadow !== "none" ? `\n  box-shadow: ${shadow};` : ""}\n}`,
    },
    {
      language: "react",
      label: "React",
      syntaxLang: "jsx",
      code: `<img\n  src="${selected.name}"\n  alt="Image"\n  style={{\n    width: ${width},\n    height: ${height},\n    borderRadius: ${borderRadius},\n    objectFit: "${objectFit}",\n    opacity: ${opacity / 100},${shadow !== "none" ? `\n    boxShadow: "${shadow}",` : ""}\n  }}\n/>`,
    },
    {
      language: "tailwind",
      label: "Tailwind",
      syntaxLang: "jsx",
      code: `<img\n  src="${selected.name}"\n  alt="Image"\n  className="w-[${width}px] h-[${height}px] rounded-[${borderRadius}px] object-${objectFit} opacity-[${opacity / 100}]"\n/>`,
    },
  ] : [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <h2 className="text-xl font-bold text-[var(--fg)]">Image Upload</h2>
                <p className="text-sm text-[var(--muted)] mt-1">Upload images and customize their display properties</p>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-[var(--border)] rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors"
              >
                <Upload className="w-10 h-10 text-[var(--muted)] mx-auto mb-4" />
                <p className="text-sm text-[var(--fg)] font-medium">Drop images here or click to upload</p>
                <p className="text-xs text-[var(--muted)] mt-1">PNG, JPG, GIF, SVG, WEBP</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {/* Thumbnails */}
              {images.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setSelected(img)}
                      className={cn(
                        "relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-colors group",
                        selected?.id === img.id ? "border-indigo-500" : "border-[var(--border)] hover:border-[var(--border-light)]"
                      )}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Preview */}
              {selected && (
                <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-8 flex items-center justify-center min-h-[300px]">
                  <img
                    src={selected.url}
                    alt={selected.name}
                    style={{
                      width,
                      height,
                      borderRadius: borderRadius,
                      objectFit: objectFit as React.CSSProperties["objectFit"],
                      opacity: opacity / 100,
                      boxShadow: shadow !== "none" ? shadow : undefined,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Code output */}
          {selected && <CodeBlock outputs={codeOutputs} />}
        </div>

        {/* Right panel - controls */}
        {selected && (
          <aside className="w-72 bg-[var(--surface)] border-l border-[var(--border)] overflow-y-auto p-5 space-y-6">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400/80 mb-4">Image Settings</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-[var(--fg)] font-medium">Width</label>
                    <NumberInput value={width} onChange={setWidth} min={50} max={1200} />
                  </div>
                  <Slider value={[width]} min={50} max={1200} onValueChange={([v]) => setWidth(v)} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-[var(--fg)] font-medium">Height</label>
                    <NumberInput value={height} onChange={setHeight} min={50} max={800} />
                  </div>
                  <Slider value={[height]} min={50} max={800} onValueChange={([v]) => setHeight(v)} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-[var(--fg)] font-medium">Border Radius</label>
                    <NumberInput value={borderRadius} onChange={setBorderRadius} max={200} />
                  </div>
                  <Slider value={[borderRadius]} min={0} max={200} onValueChange={([v]) => setBorderRadius(v)} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-[var(--fg)] font-medium">Opacity</label>
                    <NumberInput value={opacity} onChange={setOpacity} max={100} unit="%" />
                  </div>
                  <Slider value={[opacity]} min={0} max={100} onValueChange={([v]) => setOpacity(v)} />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[var(--fg)] font-medium">Object Fit</label>
                  <div className="flex gap-1 flex-wrap">
                    {["cover", "contain", "fill", "none"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setObjectFit(f)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-xs capitalize transition-colors",
                          objectFit === f ? "bg-indigo-600 text-white" : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--fg)]"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[var(--fg)] font-medium">Shadow</label>
                  <div className="space-y-1">
                    {shadowOptions.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setShadow(s.value)}
                        className={cn(
                          "w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors",
                          shadow === s.value ? "bg-indigo-600/20 text-indigo-400" : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
