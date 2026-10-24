"use client";

import { useMemo, useState } from "react";
import { format } from "sql-formatter";
import { CopyButton } from "../copy-button";

const DIALECTS = [
  { id: "postgresql", label: "PostgreSQL" },
  { id: "mysql", label: "MySQL" },
  { id: "sqlite", label: "SQLite" },
  { id: "bigquery", label: "BigQuery" },
] as const;

type Dialect = (typeof DIALECTS)[number]["id"];

const SAMPLE = `select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id = u.id where u.created_at >= '2026-01-01' and o.status in ('paid','shipped') group by u.id, u.name having count(o.id) > 2 order by orders desc limit 20;`;

function minifySql(input: string): string {
  return input
    .replace(/--[^\n]*\n/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")")
    .replace(/\s*;\s*/g, "; ")
    .trim();
}

export function SqlFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [dialect, setDialect] = useState<Dialect>("postgresql");
  const [mode, setMode] = useState<"format" | "minify">("format");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      if (mode === "minify") return minifySql(input);
      return format(input, { language: dialect });
    } catch (err) {
      return `Error: ${err instanceof Error ? err.message : "Could not parse this SQL."}`;
    }
  }, [input, dialect, mode]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {DIALECTS.map((d) => (
          <button
            key={d.id}
            onClick={() => setDialect(d.id)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              dialect === d.id
                ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {d.label}
          </button>
        ))}
        <span className="mx-1 hidden h-5 w-px bg-zinc-800 sm:block" />
        {(["format", "minify"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium capitalize transition-all ${
              mode === m
                ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {m === "format" ? "Format" : "Minify"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              SQL input
            </label>
            <span className="font-mono text-[11px] text-zinc-600">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="Paste SQL here..."
            className="min-h-[260px] w-full resize-y rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {mode === "format" ? "Formatted SQL" : "Minified SQL"}
            </label>
            <CopyButton value={output} />
          </div>
          <pre className="min-h-[260px] overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200">
            {output || <span className="text-zinc-600">Output will appear here...</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
