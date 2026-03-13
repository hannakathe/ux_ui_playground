"use client";

import type { ElementStyles } from "@/hooks/use-playground-store";
import type { CodeOutput } from "@/lib/code-generators";

export function generatePlaygroundCode(s: ElementStyles): CodeOutput[] {
  const flexProps = s.display === "flex" || s.display === "inline-flex";

  const htmlStyle = [
    `width: ${s.width}px`, `height: ${s.height}px`, `padding: ${s.padding}px`,
    s.margin > 0 && `margin: ${s.margin}px`, `border-radius: ${s.borderRadius}px`,
    `background-color: ${s.backgroundColor}`, `color: ${s.textColor}`,
    `font-size: ${s.fontSize}px`, `font-weight: ${s.fontWeight}`, `display: ${s.display}`,
    flexProps && `flex-direction: ${s.flexDirection}`, flexProps && `justify-content: ${s.justifyContent}`,
    flexProps && `align-items: ${s.alignItems}`, flexProps && `gap: ${s.gap}px`,
    s.borderWidth > 0 && `border: ${s.borderWidth}px solid ${s.borderColor}`,
    s.shadow !== "none" && `box-shadow: ${s.shadow}`, s.opacity < 100 && `opacity: ${s.opacity / 100}`,
  ].filter(Boolean).join("; ");

  const cssLines = [
    `  width: ${s.width}px;`, `  height: ${s.height}px;`, `  padding: ${s.padding}px;`,
    s.margin > 0 && `  margin: ${s.margin}px;`, `  border-radius: ${s.borderRadius}px;`,
    `  background-color: ${s.backgroundColor};`, `  color: ${s.textColor};`,
    `  font-size: ${s.fontSize}px;`, `  font-weight: ${s.fontWeight};`, `  display: ${s.display};`,
    flexProps && `  flex-direction: ${s.flexDirection};`, flexProps && `  justify-content: ${s.justifyContent};`,
    flexProps && `  align-items: ${s.alignItems};`, flexProps && `  gap: ${s.gap}px;`,
    s.borderWidth > 0 && `  border: ${s.borderWidth}px solid ${s.borderColor};`,
    s.shadow !== "none" && `  box-shadow: ${s.shadow};`, s.opacity < 100 && `  opacity: ${s.opacity / 100};`,
  ].filter(Boolean).join("\n");

  const reactProps = [
    `    width: ${s.width},`, `    height: ${s.height},`, `    padding: ${s.padding},`,
    s.margin > 0 && `    margin: ${s.margin},`, `    borderRadius: ${s.borderRadius},`,
    `    backgroundColor: "${s.backgroundColor}",`, `    color: "${s.textColor}",`,
    `    fontSize: ${s.fontSize},`, `    fontWeight: ${s.fontWeight},`, `    display: "${s.display}",`,
    flexProps && `    flexDirection: "${s.flexDirection}",`, flexProps && `    justifyContent: "${s.justifyContent}",`,
    flexProps && `    alignItems: "${s.alignItems}",`, flexProps && `    gap: ${s.gap},`,
    s.borderWidth > 0 && `    border: "${s.borderWidth}px solid ${s.borderColor}",`,
    s.shadow !== "none" && `    boxShadow: "${s.shadow}",`, s.opacity < 100 && `    opacity: ${s.opacity / 100},`,
  ].filter(Boolean).join("\n");

  const twCls: string[] = [`w-[${s.width}px]`, `h-[${s.height}px]`, `p-[${s.padding}px]`];
  if (s.margin > 0) twCls.push(`m-[${s.margin}px]`);
  twCls.push(`rounded-[${s.borderRadius}px]`, `bg-[${s.backgroundColor}]`, `text-[${s.textColor}]`, `text-[${s.fontSize}px]`);
  if (s.fontWeight >= 700) twCls.push("font-bold");
  else if (s.fontWeight >= 600) twCls.push("font-semibold");
  else if (s.fontWeight >= 500) twCls.push("font-medium");
  twCls.push(s.display);
  if (flexProps) {
    if (s.flexDirection === "column") twCls.push("flex-col");
    const jm: Record<string, string> = { "flex-start": "justify-start", center: "justify-center", "flex-end": "justify-end", "space-between": "justify-between" };
    twCls.push(jm[s.justifyContent] || "justify-start");
    const am: Record<string, string> = { "flex-start": "items-start", center: "items-center", "flex-end": "items-end", stretch: "items-stretch" };
    twCls.push(am[s.alignItems] || "items-start");
    twCls.push(`gap-[${s.gap}px]`);
  }
  if (s.borderWidth > 0) twCls.push(`border-[${s.borderWidth}px]`, `border-[${s.borderColor}]`);
  if (s.opacity < 100) twCls.push(`opacity-[${s.opacity / 100}]`);

  const jsProps = [
    `  width: "${s.width}px",`, `  height: "${s.height}px",`, `  padding: "${s.padding}px",`,
    s.margin > 0 && `  margin: "${s.margin}px",`, `  borderRadius: "${s.borderRadius}px",`,
    `  backgroundColor: "${s.backgroundColor}",`, `  color: "${s.textColor}",`,
    `  fontSize: "${s.fontSize}px",`, `  fontWeight: "${s.fontWeight}",`, `  display: "${s.display}",`,
    flexProps && `  flexDirection: "${s.flexDirection}",`, flexProps && `  justifyContent: "${s.justifyContent}",`,
    flexProps && `  alignItems: "${s.alignItems}",`, flexProps && `  gap: "${s.gap}px",`,
    s.borderWidth > 0 && `  border: "${s.borderWidth}px solid ${s.borderColor}",`,
    s.shadow !== "none" && `  boxShadow: "${s.shadow}",`, s.opacity < 100 && `  opacity: "${s.opacity / 100}",`,
  ].filter(Boolean).join("\n");

  return [
    { language: "html", label: "HTML", syntaxLang: "html", code: `<div style="${htmlStyle}">\n  Content\n</div>` },
    { language: "css", label: "CSS", syntaxLang: "css", code: `.element {\n${cssLines}\n}` },
    { language: "javascript", label: "JavaScript", syntaxLang: "javascript", code: `const el = document.querySelector('.element');\nObject.assign(el.style, {\n${jsProps}\n});` },
    { language: "react", label: "React", syntaxLang: "jsx", code: `<div\n  style={{\n${reactProps}\n  }}\n>\n  Content\n</div>` },
    { language: "tailwind", label: "Tailwind", syntaxLang: "jsx", code: `<div className="${twCls.join(" ")}">\n  Content\n</div>` },
    { language: "scss", label: "SCSS", syntaxLang: "scss", code: `.element {\n${cssLines}\n}` },
  ];
}
