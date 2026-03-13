// Multi-language code generation for all playground areas

export interface StyleConfig {
  [key: string]: string | number | undefined;
}

export function generateHTMLCode(tag: string, classes: string, content: string, styles?: StyleConfig): string {
  let styleAttr = "";
  if (styles && Object.keys(styles).length > 0) {
    const entries = Object.entries(styles).filter(([, v]) => v !== undefined && v !== "");
    if (entries.length > 0) {
      styleAttr = ` style="${entries.map(([k, v]) => `${toKebab(k)}: ${typeof v === "number" ? v + "px" : v}`).join("; ")}"`;
    }
  }
  const classAttr = classes ? ` class="${classes}"` : "";
  return `<${tag}${classAttr}${styleAttr}>\n  ${content}\n</${tag}>`;
}

export function generateCSSCode(selector: string, props: Record<string, string | number | undefined>): string {
  const lines = Object.entries(props)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `  ${toKebab(k)}: ${typeof v === "number" ? v + "px" : v};`);
  return `.${selector} {\n${lines.join("\n")}\n}`;
}

export function generateReactCode(props: Record<string, string | number | undefined>, content: string): string {
  const entries = Object.entries(props).filter(([, v]) => v !== undefined && v !== "");
  const styleLines = entries.map(([k, v]) => `    ${k}: ${typeof v === "number" ? v : `"${v}"`},`);
  return `<div\n  style={{\n${styleLines.join("\n")}\n  }}\n>\n  ${content}\n</div>`;
}

export function generateTailwindCode(classes: string[], content: string): string {
  return `<div className="${classes.join(" ")}">\n  ${content}\n</div>`;
}

export function generateJSCode(varName: string, props: Record<string, string | number | undefined>): string {
  const entries = Object.entries(props).filter(([, v]) => v !== undefined && v !== "");
  const lines = entries.map(([k, v]) => `  ${JSON.stringify(toKebab(k))}: ${typeof v === "number" ? `"${v}px"` : JSON.stringify(v)},`);
  return `const ${varName} = document.querySelector('.element');\nObject.assign(${varName}.style, {\n${lines.join("\n")}\n});`;
}

export function generateSCSSCode(selector: string, props: Record<string, string | number | undefined>): string {
  const lines = Object.entries(props)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `  ${toKebab(k)}: ${typeof v === "number" ? v + "px" : v};`);
  return `.${selector} {\n${lines.join("\n")}\n}`;
}

function toKebab(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

export type CodeLanguage = "html" | "css" | "javascript" | "react" | "tailwind" | "scss";

export interface CodeOutput {
  language: CodeLanguage;
  label: string;
  code: string;
  syntaxLang: string;
}
