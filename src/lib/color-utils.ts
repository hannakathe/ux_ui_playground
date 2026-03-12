export function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generateComplementary(hex: string): string[] {
  const [h, s, l] = hexToHsl(hex);
  return [hex, hslToHex((h + 180) % 360, s, l)];
}

export function generateAnalogous(hex: string): string[] {
  const [h, s, l] = hexToHsl(hex);
  return [
    hslToHex((h - 30 + 360) % 360, s, l),
    hex,
    hslToHex((h + 30) % 360, s, l),
  ];
}

export function generateTriadic(hex: string): string[] {
  const [h, s, l] = hexToHsl(hex);
  return [
    hex,
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l),
  ];
}

export function generateMonochromatic(hex: string): string[] {
  const [h, s, l] = hexToHsl(hex);
  return [
    hslToHex(h, s, Math.max(l - 30, 10)),
    hslToHex(h, s, Math.max(l - 15, 15)),
    hex,
    hslToHex(h, s, Math.min(l + 15, 90)),
    hslToHex(h, s, Math.min(l + 30, 95)),
  ];
}

export function generateSplitComplementary(hex: string): string[] {
  const [h, s, l] = hexToHsl(hex);
  return [
    hex,
    hslToHex((h + 150) % 360, s, l),
    hslToHex((h + 210) % 360, s, l),
  ];
}

export function generateShades(hex: string, count: number = 9): string[] {
  const [h, s] = hexToHsl(hex);
  const shades: string[] = [];
  for (let i = 0; i < count; i++) {
    const l = Math.round(95 - (i * 85) / (count - 1));
    shades.push(hslToHex(h, s, l));
  }
  return shades;
}
