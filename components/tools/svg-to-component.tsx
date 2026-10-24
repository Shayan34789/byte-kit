"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "../copy-button";

const ATTR_MAP: Record<string, string> = {
  class: "className",
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "fill-rule": "fillRule",
  "fill-opacity": "fillOpacity",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-opacity": "strokeOpacity",
  "stroke-miterlimit": "strokeMiterlimit",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "text-anchor": "textAnchor",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "xlink:href": "xlinkHref",
  "xmlns:xlink": "xmlnsXlink",
  "xml:space": "xmlSpace",
};

function toJsx(svg: string, stripSize: boolean): string {
  let out = svg.replace(/<\?xml[^>]*\?>/g, "").replace(/<!--[\s\S]*?-->/g, "").trim();
  out = out.replace(/([a-zA-Z-]+)="([^"]*)"/g, (m, name: string, value: string) => {
    if (stripSize && (name === "width" || name === "height")) return "";
    const mapped = ATTR_MAP[name] ?? (name.includes("-") ? name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()) : name);
    return `${mapped}="${value}"`;
  });
  out = out.replace(/\s{2,}/g, " ").replace(/\s+>/g, ">");
  return out;
}

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
  <circle cx="12" cy="12" r="10" />
  <path d="M12 8v4l3 3" />
</svg>`;

export function SvgToComponent() {
  const [input, setInput] = useState(SAMPLE);
  const [target, setTarget] = useState<"react" | "vue">("react");
  const [componentName, setComponentName] = useState("Icon");
  const [stripSize, setStripSize] = useState(true);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    if (!/<svg[\s>]/i.test(input)) return "Error: that doesn't look like SVG markup.";
    const jsx = toJsx(input, stripSize);
    const name = /^[A-Z][A-Za-z0-9]*$/.test(componentName) ? componentName : "Icon";
    if (target === "react") {
      const inner = jsx
        .replace(/^<svg/, "<svg {...props}")
        .replace(/<\/svg>\s*$/, "</svg>");
      return `import type { SVGProps } from "react";\n\nexport function ${name}(props: SVGProps<SVGSVGElement>) {\n  return (\n    ${inner}\n  );\n}`;
    }
    return `<template>\n  ${jsx}\n</template>\n\n<script setup lang="ts">\n// Use as <${name} /> — pass class, width, height, or style as attributes.\n</script>`;
  }, [input, target, componentName, stripSize]);

  const loadFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInput(reader.result as string);
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["react", "vue"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTarget(t)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              target === t
                ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t === "react" ? "React (TSX)" : "Vue SFC"}
          </button>
        ))}
        <input
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
          placeholder="Component name"
          className="w-40 rounded-lg border border-zinc-800 bg-[#121316] px-3 py-1.5 font-mono text-xs text-zinc-200 outline-none focus:border-blue-500/40"
        />
        <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-zinc-400">
          <input
            type="checkbox"
            checked={stripSize}
            onChange={(e) => setStripSize(e.target.checked)}
            className="accent-blue-400"
          />
          Strip width/height
        </label>
        <label className="ml-auto cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-200 hover:border-zinc-600 transition-all">
          Load .svg file
          <input
            type="file"
            accept="image/svg+xml,.svg"
            className="hidden"
            onChange={(e) => loadFile(e.target.files?.[0])}
          />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
            SVG markup
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="<svg ...>...</svg>"
            className="min-h-[260px] w-full resize-y rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {target === "react" ? "React component" : "Vue component"}
            </label>
            <CopyButton value={output} />
          </div>
          <pre className="min-h-[260px] overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200">
            {output || <span className="text-zinc-600">Component output will appear here...</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
