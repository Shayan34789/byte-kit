"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "./copy-button";
import {
  CheckCircle,
  WarningCircle,
  Sparkle,
  ArrowsInLineHorizontal,
} from "@phosphor-icons/react";

const starter = `{
  "protocol": "Byte-Kit/v1",
  "isolated": true,
  "runtime": "node:v8-browser",
  "limits": {
    "maxPayloadBytes": 1048576,
    "corsPolicy": "strict-same-origin"
  },
  "modules": ["crypto", "encoding", "css-parser"]
}`;

export function JsonFormatter() {
  const [input, setInput] = useState(starter);
  const [mode, setMode] = useState<"pretty" | "minify">("pretty");

  const result = useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(input);
      const output =
        mode === "pretty"
          ? JSON.stringify(parsed, null, 2)
          : JSON.stringify(parsed);
      return { output, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "SyntaxError: Invalid JSON structure";
      return { output: "", error: message };
    }
  }, [input, mode]);

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-800 bg-[#121316]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-5 py-3">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold">
          {result.error ? (
            <span className="inline-flex items-center gap-1.5 text-rose-400">
              <WarningCircle size={15} weight="bold" />
              Malformed JSON
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-blue-400">
              <CheckCircle size={15} weight="fill" />
              Valid JSON Structure
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("pretty")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              mode === "pretty"
                ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkle size={13} />
            Beautify (2-space)
          </button>
          <button
            type="button"
            onClick={() => setMode("minify")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              mode === "minify"
                ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ArrowsInLineHorizontal size={13} />
            Minify (Compact)
          </button>
          <CopyButton value={result.output} />
        </div>
      </div>

      <div className="grid md:grid-cols-2">
        <div className="border-b border-zinc-800 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-900/60 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            <span>Buffer In</span>
            <span>{input.length} bytes</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-[440px] w-full resize-y bg-transparent p-4 font-mono text-xs leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-600 focus:bg-zinc-950/40"
            placeholder="Paste raw JSON string..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-900/60 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            <span>Buffer Out</span>
            <span className={result.error ? "text-rose-400" : "text-blue-400"}>
              {result.error ? "Parse Error" : `${result.output.length} bytes`}
            </span>
          </div>
          <pre
            className={`min-h-[440px] overflow-auto whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed ${
              result.error ? "text-rose-300 bg-rose-950/10" : "text-zinc-200"
            }`}
          >
            {result.error ?? result.output}
          </pre>
        </div>
      </div>
    </section>
  );
}
