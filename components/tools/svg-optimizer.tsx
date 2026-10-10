"use client";

import { useState } from "react";
import { CopyButton } from "../copy-button";
import { downloadBlob, formatBytes } from "./image-utils";

function minifySvg(input: string): string {
  let out = input;
  // Remove XML comments
  out = out.replace(/<!--[\s\S]*?-->/g, "");
  // Remove editor metadata blocks and editor namespaces
  out = out.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
  out = out.replace(/\s+xmlns:(inkscape|sodipodi|dc|cc|rdf)="[^"]*"/g, "");
  out = out.replace(/\s+(inkscape|sodipodi):[a-zA-Z-]+="[^"]*"/g, "");
  // Collapse whitespace between tags, trim
  out = out.replace(/>\s+</g, "><").trim();
  // Collapse repeated spaces inside tags
  out = out.replace(/\s{2,}/g, " ");
  return out;
}

export function SvgOptimizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<{ before: number; after: number } | null>(null);
  const [error, setError] = useState("");

  const optimize = () => {
    setError("");
    if (!input.trim()) {
      setError("Paste some SVG markup first.");
      return;
    }
    if (!/<svg[\s>]/i.test(input)) {
      setError("That doesn't look like SVG markup.");
      return;
    }
    const min = minifySvg(input);
    setOutput(min);
    setStats({
      before: new Blob([input]).size,
      after: new Blob([min]).size,
    });
  };

  const loadFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInput(reader.result as string);
    reader.readAsText(file);
  };

  const saved = stats ? Math.round((1 - stats.after / stats.before) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
          SVG input
        </span>
        <label className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-200 hover:border-zinc-600 transition-all">
          Load .svg file
          <input
            type="file"
            accept="image/svg+xml,.svg"
            className="hidden"
            onChange={(e) => loadFile(e.target.files?.[0])}
          />
        </label>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='<svg xmlns="http://www.w3.org/2000/svg" …>'
        spellCheck={false}
        className="min-h-[220px] w-full resize-y rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-blue-500/50"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={optimize}
          className="rounded-lg border border-blue-500/40 bg-blue-500/20 px-4 py-1.5 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-500/30 active:scale-[0.98] transition-all"
        >
          Optimize
        </button>
        {stats && (
          <span className="font-mono text-[11px] text-zinc-500">
            {formatBytes(stats.before)} →{" "}
            <span className="text-blue-400 font-semibold">{formatBytes(stats.after)}</span>{" "}
            · {saved}% smaller
          </span>
        )}
      </div>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-mono text-xs text-rose-300">
          {error}
        </p>
      )}

      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Optimized output
            </span>
            <div className="flex gap-2">
              <CopyButton value={output} />
              <button
                onClick={() => downloadBlob(new Blob([output], { type: "image/svg+xml" }), "optimized.svg")}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-200 hover:border-zinc-600 transition-all"
              >
                Download .svg
              </button>
            </div>
          </div>
          <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-blue-300">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
