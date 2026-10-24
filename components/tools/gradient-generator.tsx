"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "../copy-button";

type Stop = { color: string; position: number };
type Mode = "linear" | "radial" | "mesh";

const DEFAULT_STOPS: Stop[] = [
  { color: "#2563eb", position: 0 },
  { color: "#7c3aed", position: 50 },
  { color: "#db2777", position: 100 },
];

export function GradientGenerator() {
  const [mode, setMode] = useState<Mode>("linear");
  const [stops, setStops] = useState<Stop[]>(DEFAULT_STOPS);
  const [angle, setAngle] = useState(135);
  const [radialPos, setRadialPos] = useState("center");

  const sorted = useMemo(() => [...stops].sort((a, b) => a.position - b.position), [stops]);

  const css = useMemo(() => {
    const list = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
    if (mode === "linear") return `background: linear-gradient(${angle}deg, ${list});`;
    if (mode === "radial") return `background: radial-gradient(circle at ${radialPos}, ${list});`;
    // Mesh: layered radial gradients, one blob per stop, spread across the surface.
    const anchors = ["0% 0%", "100% 0%", "0% 100%", "100% 100%", "50% 50%"];
    const layers = sorted.map(
      (s, i) => `radial-gradient(circle at ${anchors[i % anchors.length]}, ${s.color} 0%, transparent 70%)`
    );
    return `background:\n  ${layers.join(",\n  ")};`;
  }, [mode, sorted, angle, radialPos]);

  const previewStyle = useMemo(() => {
    const list = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
    if (mode === "linear") return { background: `linear-gradient(${angle}deg, ${list})` };
    if (mode === "radial") return { background: `radial-gradient(circle at ${radialPos}, ${list})` };
    const anchors = ["0% 0%", "100% 0%", "0% 100%", "100% 100%", "50% 50%"];
    return {
      background: sorted
        .map((s, i) => `radial-gradient(circle at ${anchors[i % anchors.length]}, ${s.color} 0%, transparent 70%)`)
        .join(", "),
      backgroundColor: "#0a0a0b",
    };
  }, [mode, sorted, angle, radialPos]);

  const updateStop = (index: number, patch: Partial<Stop>) => {
    setStops((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {(["linear", "radial", "mesh"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium capitalize transition-all ${
              mode === m
                ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {m === "mesh" ? "Mesh-style" : m}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-5 rounded-xl border border-zinc-800 bg-[#121316] p-5">
          <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-400">Color stops</h3>
          {stops.map((stop, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(i, { color: e.target.value })}
                className="h-9 w-12 shrink-0 cursor-pointer rounded border border-zinc-700 bg-transparent"
              />
              <span className="w-20 font-mono text-xs text-zinc-400">{stop.color}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={stop.position}
                onChange={(e) => updateStop(i, { position: Number(e.target.value) })}
                className="min-w-0 flex-1 accent-blue-400"
              />
              <span className="w-10 text-right font-mono text-xs text-blue-400">{stop.position}%</span>
              {stops.length > 2 && (
                <button
                  onClick={() => setStops((prev) => prev.filter((_, j) => j !== i))}
                  className="rounded-lg border border-zinc-700 px-2 py-1 font-mono text-xs text-zinc-400 hover:border-rose-500/50 hover:text-rose-300"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {stops.length < 5 && (
            <button
              onClick={() => setStops((prev) => [...prev, { color: "#10b981", position: 100 }])}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-200 hover:border-zinc-600 transition-all"
            >
              + Add stop
            </button>
          )}

          {mode === "linear" && (
            <div>
              <div className="flex justify-between font-mono text-xs text-zinc-300">
                <span>Angle</span>
                <span className="text-blue-400">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="mt-2 w-full accent-blue-400"
              />
            </div>
          )}
          {mode === "radial" && (
            <label className="flex flex-col gap-1.5 font-mono text-xs text-zinc-400">
              Position
              <select
                value={radialPos}
                onChange={(e) => setRadialPos(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-200 outline-none"
              >
                {["center", "top", "bottom", "left", "right", "top left", "top right", "bottom left", "bottom right"].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          )}
          {mode === "mesh" && (
            <p className="font-mono text-[11px] leading-relaxed text-zinc-500">
              Mesh-style here is a layered-radial-gradient approximation: one soft radial blob per stop, blended over a dark base. True mesh gradients are not pure CSS — this is the closest CSS-only equivalent.
            </p>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div
            className="flex min-h-[220px] flex-1 items-center justify-center rounded-xl border border-zinc-800 p-8"
            style={previewStyle}
          >
            <span className="rounded-lg bg-black/30 px-3 py-1.5 font-mono text-xs font-semibold text-white">
              Live preview
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-400">Generated CSS</span>
              <CopyButton value={css} />
            </div>
            <pre className="overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-blue-300">
              {css}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
