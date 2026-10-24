"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "../copy-button";

// Spacing scale: Tailwind unit -> px
const SCALE: Record<string, number> = {
  "0": 0, px: 1, "0.5": 2, "1": 4, "1.5": 6, "2": 8, "2.5": 10, "3": 12, "3.5": 14,
  "4": 16, "5": 20, "6": 24, "7": 28, "8": 32, "9": 36, "10": 40, "11": 44, "12": 48,
  "14": 56, "16": 64, "20": 80, "24": 96, "28": 112, "32": 128, "36": 144, "40": 160,
  "48": 192, "56": 224, "64": 256, "72": 288, "80": 320, "96": 384,
};
const PX_TO_UNIT: Record<number, string> = Object.fromEntries(
  Object.entries(SCALE).map(([unit, px]) => [px, unit])
);

const FONT_SIZES: Record<string, string> = {
  "12px": "text-xs", "14px": "text-sm", "16px": "text-base", "18px": "text-lg",
  "20px": "text-xl", "24px": "text-2xl", "30px": "text-3xl", "36px": "text-4xl",
  "48px": "text-5xl", "60px": "text-6xl", "72px": "text-7xl",
};
const FONT_WEIGHTS: Record<string, string> = {
  "100": "font-thin", "200": "font-extralight", "300": "font-light", "400": "font-normal",
  "500": "font-medium", "600": "font-semibold", "700": "font-bold", "800": "font-extrabold",
  "900": "font-black", normal: "font-normal", bold: "font-bold",
};
const FRACTIONS: Record<string, string> = {
  "25%": "1/4", "33.333333%": "1/3", "50%": "1/2", "66.666667%": "2/3",
  "75%": "3/4", "100%": "full",
};

function spacingClass(prefix: string, value: string): string | null {
  const m = value.match(/^(-?)(\d+(?:\.\d+)?)px$/);
  if (m) {
    const px = Number(m[2]);
    const unit = PX_TO_UNIT[px];
    return `${m[1]}${prefix}-${unit ?? `[${value}]`}`;
  }
  if (/^-?\d+(\.\d+)?rem$/.test(value)) {
    const px = Math.round(parseFloat(value) * 16);
    const unit = PX_TO_UNIT[px];
    return `${value.startsWith("-") ? "-" : ""}${prefix}-${unit ?? `[${value}]`}`;
  }
  return null;
}

function cssToTailwind(css: string): { classes: string; unmapped: string[] } {
  const classes: string[] = [];
  const unmapped: string[] = [];
  const decls = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/[{}]/g, " ").split(";");
  for (const decl of decls) {
    const colon = decl.indexOf(":");
    if (colon < 0) continue;
    const prop = decl.slice(0, colon).trim().toLowerCase();
    const val = decl.slice(colon + 1).trim();
    if (!val) continue;
    const push = (c: string | null) => {
      if (c) classes.push(c);
      else unmapped.push(`${prop}: ${val}`);
    };
    switch (prop) {
      case "display":
        push(["flex", "block", "grid", "inline-block", "inline-flex", "hidden", "inline", "table"].includes(val) ? val : null);
        break;
      case "flex-direction":
        push(val === "row" ? "flex-row" : val === "column" ? "flex-col" : null);
        break;
      case "flex-wrap":
        push(val === "wrap" ? "flex-wrap" : val === "nowrap" ? "flex-nowrap" : null);
        break;
      case "align-items":
        push({ center: "items-center", "flex-start": "items-start", "flex-end": "items-end", baseline: "items-baseline", stretch: "items-stretch" }[val] ?? null);
        break;
      case "justify-content":
        push({ center: "justify-center", "flex-start": "justify-start", "flex-end": "justify-end", "space-between": "justify-between", "space-around": "justify-around", "space-evenly": "justify-evenly" }[val] ?? null);
        break;
      case "margin": push(spacingClass("m", val)); break;
      case "margin-top": push(spacingClass("mt", val)); break;
      case "margin-right": push(spacingClass("mr", val)); break;
      case "margin-bottom": push(spacingClass("mb", val)); break;
      case "margin-left": push(spacingClass("ml", val)); break;
      case "padding": push(spacingClass("p", val)); break;
      case "padding-top": push(spacingClass("pt", val)); break;
      case "padding-right": push(spacingClass("pr", val)); break;
      case "padding-bottom": push(spacingClass("pb", val)); break;
      case "padding-left": push(spacingClass("pl", val)); break;
      case "gap": push(spacingClass("gap", val)); break;
      case "width":
        push(FRACTIONS[val] ? `w-${FRACTIONS[val]}` : spacingClass("w", val) ?? (val === "auto" ? "w-auto" : null));
        break;
      case "height":
        push(FRACTIONS[val] ? `h-${FRACTIONS[val]}` : spacingClass("h", val) ?? (val === "auto" ? "h-auto" : null));
        break;
      case "font-size":
        push(FONT_SIZES[val] ?? (/\d+px$/.test(val) ? `text-[${val}]` : null));
        break;
      case "font-weight":
        push(FONT_WEIGHTS[val] ?? null);
        break;
      case "color":
        push(/^#[0-9a-fA-F]{3,8}$/.test(val) ? `text-[${val}]` : null);
        break;
      case "background-color":
        push(/^#[0-9a-fA-F]{3,8}$/.test(val) ? `bg-[${val}]` : null);
        break;
      case "text-align":
        push(["left", "center", "right", "justify"].includes(val) ? `text-${val}` : null);
        break;
      case "border-radius": {
        const radiusMap: Record<string, string> = {
          "0px": "rounded-none", "0": "rounded-none", "2px": "rounded-sm", "4px": "rounded",
          "6px": "rounded-md", "8px": "rounded-lg", "12px": "rounded-xl", "16px": "rounded-2xl",
          "24px": "rounded-3xl", "9999px": "rounded-full",
        };
        push(radiusMap[val] ?? (/^\d+px$/.test(val) ? `rounded-[${val}]` : null));
        break;
      }
      case "position":
        push(["absolute", "relative", "fixed", "sticky", "static"].includes(val) ? val : null);
        break;
      case "overflow":
        push(["hidden", "auto", "scroll", "visible"].includes(val) ? `overflow-${val}` : null);
        break;
      case "cursor":
        push(["pointer", "default", "wait", "not-allowed"].includes(val) ? `cursor-${val}` : null);
        break;
      case "text-transform":
        push(val === "uppercase" ? "uppercase" : val === "lowercase" ? "lowercase" : val === "capitalize" ? "capitalize" : null);
        break;
      case "line-height":
        push(/^\d+(\.\d+)?$/.test(val) ? `leading-[${val}]` : null);
        break;
      default:
        unmapped.push(`${prop}: ${val}`);
    }
  }
  return { classes: classes.join(" "), unmapped };
}

const UTIL_TO_CSS: Record<string, string> = {
  block: "display: block;", flex: "display: flex;", grid: "display: grid;",
  "inline-block": "display: inline-block;", "inline-flex": "display: inline-flex;",
  hidden: "display: none;", "flex-row": "flex-direction: row;", "flex-col": "flex-direction: column;",
  "flex-wrap": "flex-wrap: wrap;", "flex-nowrap": "flex-wrap: nowrap;",
  "items-center": "align-items: center;", "items-start": "align-items: flex-start;",
  "items-end": "align-items: flex-end;", "items-baseline": "align-items: baseline;",
  "items-stretch": "align-items: stretch;", "justify-center": "justify-content: center;",
  "justify-start": "justify-content: flex-start;", "justify-end": "justify-content: flex-end;",
  "justify-between": "justify-content: space-between;", "justify-around": "justify-content: space-around;",
  "justify-evenly": "justify-content: space-evenly;", absolute: "position: absolute;",
  relative: "position: relative;", fixed: "position: fixed;", sticky: "position: sticky;",
  uppercase: "text-transform: uppercase;", lowercase: "text-transform: lowercase;",
  capitalize: "text-transform: capitalize;", "text-left": "text-align: left;",
  "text-center": "text-align: center;", "text-right": "text-align: right;",
  "text-justify": "text-align: justify;", "font-thin": "font-weight: 100;",
  "font-extralight": "font-weight: 200;", "font-light": "font-weight: 300;",
  "font-normal": "font-weight: 400;", "font-medium": "font-weight: 500;",
  "font-semibold": "font-weight: 600;", "font-bold": "font-weight: 700;",
  "font-extrabold": "font-weight: 800;", "font-black": "font-weight: 900;",
  "text-xs": "font-size: 12px;", "text-sm": "font-size: 14px;", "text-base": "font-size: 16px;",
  "text-lg": "font-size: 18px;", "text-xl": "font-size: 20px;", "text-2xl": "font-size: 24px;",
  "text-3xl": "font-size: 30px;", "text-4xl": "font-size: 36px;", "text-5xl": "font-size: 48px;",
  "text-6xl": "font-size: 60px;", "text-7xl": "font-size: 72px;",
  "rounded-none": "border-radius: 0;", "rounded-full": "border-radius: 9999px;",
  "rounded-sm": "border-radius: 2px;", rounded: "border-radius: 4px;",
  "rounded-md": "border-radius: 6px;", "rounded-lg": "border-radius: 8px;",
  "rounded-xl": "border-radius: 12px;", "rounded-2xl": "border-radius: 16px;",
  "rounded-3xl": "border-radius: 24px;",
};
const SPACING_PREFIX: Record<string, string> = {
  m: "margin", mt: "margin-top", mr: "margin-right", mb: "margin-bottom", ml: "margin-left",
  mx: "margin-left, margin-right", my: "margin-top, margin-bottom",
  p: "padding", pt: "padding-top", pr: "padding-right", pb: "padding-bottom", pl: "padding-left",
  px: "padding-left, padding-right", py: "padding-top, padding-bottom",
  gap: "gap", w: "width", h: "height",
};
const PALETTE: Record<string, string> = {
  "red-500": "#ef4444", "blue-500": "#3b82f6", "blue-600": "#2563eb", "green-500": "#22c55e",
  "amber-500": "#f59e0b", "slate-500": "#64748b", "zinc-500": "#71717a", "white": "#ffffff",
  "black": "#000000", "emerald-500": "#10b981", "violet-500": "#8b5cf6", "rose-500": "#f43f5e",
};

function tailwindToCss(input: string): { css: string; unmapped: string[] } {
  const lines: string[] = [];
  const unmapped: string[] = [];
  const tokens = input.split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    if (UTIL_TO_CSS[token]) {
      lines.push(UTIL_TO_CSS[token]);
      continue;
    }
    const arb = token.match(/^(text|bg|w|h|m|mt|mr|mb|ml|mx|my|p|pt|pr|pb|pl|px|py|gap|rounded|leading)-\[(.+)\]$/);
    if (arb) {
      const [, prefix, value] = arb;
      const prop =
        prefix === "text" ? "color" : prefix === "bg" ? "background-color" :
        prefix === "rounded" ? "border-radius" : prefix === "leading" ? "line-height" :
        SPACING_PREFIX[prefix] ?? prefix;
      for (const p of prop.split(", ")) lines.push(`${p}: ${value};`);
      continue;
    }
    const sp = token.match(/^(-)?(m|mt|mr|mb|ml|mx|my|p|pt|pr|pb|pl|px|py|gap|w|h)-(.+)$/);
    if (sp) {
      const [, neg, prefix, unit] = sp;
      const px = SCALE[unit];
      if (px !== undefined) {
        const value = `${neg ? "-" : ""}${px}px`;
        for (const p of SPACING_PREFIX[prefix].split(", ")) lines.push(`${p}: ${value};`);
        continue;
      }
      const frac = Object.entries(FRACTIONS).find(([, f]) => f === unit);
      if (frac && (prefix === "w" || prefix === "h")) {
        lines.push(`${prefix === "w" ? "width" : "height"}: ${frac[0]};`);
        continue;
      }
    }
    const color = token.match(/^(text|bg)-(.+)$/);
    if (color && PALETTE[color[2]]) {
      lines.push(`${color[1] === "text" ? "color" : "background-color"}: ${PALETTE[color[2]]};`);
      continue;
    }
    const op = token.match(/^opacity-(\d+)$/);
    if (op) {
      lines.push(`opacity: ${Number(op[1]) / 100};`);
      continue;
    }
    unmapped.push(token);
  }
  return { css: lines.join("\n"), unmapped };
}

const CSS_SAMPLE = `display: flex;
align-items: center;
justify-content: space-between;
padding: 16px 24px;
gap: 12px;
background-color: #2563eb;
color: #ffffff;
font-size: 16px;
font-weight: 600;
border-radius: 8px;`;
const TW_SAMPLE = "flex items-center justify-between px-6 py-4 gap-3 bg-blue-600 text-white text-base font-semibold rounded-lg";

export function TailwindCssConverter() {
  const [direction, setDirection] = useState<"css-tw" | "tw-css">("css-tw");
  const [input, setInput] = useState(CSS_SAMPLE);

  const { output, unmapped } = useMemo(() => {
    if (direction === "css-tw") {
      const r = cssToTailwind(input);
      return { output: r.classes, unmapped: r.unmapped };
    }
    const r = tailwindToCss(input);
    return { output: r.css, unmapped: r.unmapped };
  }, [input, direction]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => { setDirection("css-tw"); setInput(CSS_SAMPLE); }}
          className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
            direction === "css-tw"
              ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
              : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          CSS → Tailwind
        </button>
        <button
          onClick={() => { setDirection("tw-css"); setInput(TW_SAMPLE); }}
          className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
            direction === "tw-css"
              ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
              : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Tailwind → CSS
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {direction === "css-tw" ? "CSS declarations" : "Tailwind classes"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder={direction === "css-tw" ? "display: flex; ..." : "flex items-center ..."}
            className="min-h-[260px] w-full resize-y rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {direction === "css-tw" ? "Tailwind classes" : "CSS output"}
            </label>
            <CopyButton value={output} />
          </div>
          <pre className="min-h-[260px] overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200">
            {output || <span className="text-zinc-600">Output will appear here...</span>}
          </pre>
          {unmapped.length > 0 && (
            <p className="font-mono text-[11px] leading-relaxed text-amber-400/90">
              Not converted (outside the common-property coverage): {unmapped.join(", ")}
            </p>
          )}
        </div>
      </div>
      <p className="font-mono text-[11px] leading-relaxed text-zinc-500">
        Coverage is deliberately scoped to common layout, spacing, typography, color, and radius utilities — not arbitrary CSS. Anything outside that scope is listed above instead of silently dropped or guessed.
      </p>
    </div>
  );
}
