"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "./copy-button";
import { ArrowsLeftRight } from "@phosphor-icons/react";

export function PxToRem() {
  const [value, setValue] = useState("16");
  const [base, setBase] = useState("16");

  const result = useMemo(() => {
    const pixels = Number(value);
    const root = Number(base);
    if (!Number.isFinite(pixels) || !Number.isFinite(root) || root <= 0) return "";
    return `${Number((pixels / root).toFixed(4))}rem`;
  }, [value, base]);

  return (
    <section className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <div className="space-y-2">
          <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Source Pixels
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.25"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-[#121316] px-4 py-3.5 pr-12 font-mono text-2xl font-bold text-zinc-100 outline-none transition focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
            />
            <span className="absolute right-4 top-4 font-mono text-xs font-semibold text-zinc-500">
              PX
            </span>
          </div>
        </div>

        <div className="hidden pb-4 text-zinc-600 md:block">
          <ArrowsLeftRight size={20} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Calculated REM Unit
            </label>
            <CopyButton value={result} />
          </div>
          <div className="flex h-[58px] items-center rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 font-mono text-2xl font-bold text-teal-300">
            {result || "—"}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <span>Root Base Size:</span>
          <div className="relative">
            <input
              type="number"
              min="1"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              className="w-20 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-right font-mono text-xs text-zinc-200 outline-none"
            />
            <span className="ml-1 text-zinc-500">px</span>
          </div>
        </div>
        <span className="text-[11px] text-zinc-500">
          Evaluated as <code className="text-zinc-300">px / rootFontSize = rem</code>
        </span>
      </div>
    </section>
  );
}
