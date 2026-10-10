"use client";

import { useEffect, useState } from "react";
import {
  cleanupInput,
  formatBytes,
  formatTime,
  getEngine,
  readOutputFile,
  writeInputFile,
} from "./ffmpeg";
import { VIDEO_OPS, type OptValues, type OptionField } from "./ops";

function Field({ field, value, onChange }: { field: OptionField; value: string | number; onChange: (v: string | number) => void }) {
  if (field.type === "select") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{field.label}</span>
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-[#101012] px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-zinc-600"
        >
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    );
  }
  if (field.type === "number") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{field.label}</span>
        <input
          type="number"
          value={Number(value)}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="rounded-lg border border-zinc-800 bg-[#101012] px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-zinc-600"
        />
      </label>
    );
  }
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{field.label}</span>
      <input
        type="text"
        value={String(value)}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-zinc-800 bg-[#101012] px-3 py-2 font-mono text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-zinc-600"
      />
    </label>
  );
}

export function VideoTool({ op: opId }: { op: string }) {
  const op = VIDEO_OPS[opId];
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ duration: number; width: number; height: number } | null>(null);
  const [opts, setOpts] = useState<OptValues>(() => {
    const d: OptValues = {};
    for (const f of op.options) d[f.key] = f.default;
    return d;
  });
  const [phase, setPhase] = useState<"idle" | "loading" | "working" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  // FFmpeg's multithreaded engine needs SharedArrayBuffer, which browsers only
  // enable when the host sends COOP/COEP headers (GitHub Pages does not).
  const [isolated] = useState(
    () => typeof window !== "undefined" && window.crossOriginIsolated === true
  );

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [fileUrl, outputUrl]);

  const selectFile = (f: File | undefined) => {
    setError("");
    setOutputUrl(null);
    setPhase("idle");
    setProgress(0);
    setMeta(null);
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    if (!f) {
      setFile(null);
      setFileUrl(null);
      return;
    }
    const url = URL.createObjectURL(f);
    setFile(f);
    setFileUrl(url);
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.onloadedmetadata = () => {
      setMeta({
        duration: probe.duration,
        width: probe.videoWidth,
        height: probe.videoHeight,
      });
      URL.revokeObjectURL(probe.src);
    };
    probe.onerror = () => setMeta(null);
    probe.src = url;
  };

  const pushLog = (message: string) => {
    const line = message.trim();
    if (!line) return;
    setLogs((prev) => [...prev.slice(-49), line]);
  };

  const convert = async () => {
    if (!file || phase === "loading" || phase === "working") return;
    setError("");
    setOutputUrl(null);
    setLogs([]);
    setProgress(0);
    setPhase("loading");
    const inputName = `input.${op.inputExt}`;
    const outputName = `output.${op.outputExt}`;
    let engine: Awaited<ReturnType<typeof getEngine>> | null = null;
    try {
      engine = await getEngine({
        onProgress: (r) => setProgress(r),
        onLog: (m) => pushLog(m),
      });
      setPhase("working");
      await writeInputFile(engine, inputName, file);
      try {
        await op.run(engine, opts, inputName, outputName);
      } finally {
        await cleanupInput(engine, inputName);
      }
      const blob = await readOutputFile(engine, outputName, op.outputMime);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      setProgress(1);
      setPhase("done");
    } catch (e) {
      if (engine) {
        await cleanupInput(engine, inputName).catch(() => {});
        await cleanupInput(engine, outputName).catch(() => {});
      }
      const detail =
        e instanceof Error
          ? e.message
          : typeof e === "string"
            ? e
            : `Conversion failed (${JSON.stringify(e) || "unknown error"}). Try different settings or a smaller file.`;
      console.error("[VideoTool]", e);
      setError(detail);
      setPhase("error");
    }
  };

  const outName = file
    ? file.name.replace(/\.[^.]+$/, "") + `${op.outputSuffix}.${op.outputExt}`
    : `output.${op.outputExt}`;

  const busy = phase === "loading" || phase === "working";

  if (!isolated) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-[#101012] p-6">
        <p className="text-sm font-medium text-zinc-200">
          Video processing isn&apos;t available on this host
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          These tools run a video engine in your browser that requires
          cross-origin isolation headers, which this host doesn&apos;t send.
          Everything else on Byte-Kit works normally here. To use the video
          tools, the site needs hosting that supports those headers — such as
          Cloudflare Pages, Netlify, or Vercel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-[#101012] p-8 text-center transition-colors hover:border-zinc-500">
        <span className="text-sm text-zinc-200">
          {file ? file.name : "Drop a video file here, or click to browse"}
        </span>
        <span className="font-mono text-[11px] text-zinc-500">{op.hint}</span>
        {file && meta && (
          <span className="font-mono text-[11px] text-zinc-500">
            {meta.width}×{meta.height} · {formatTime(meta.duration)} · {formatBytes(file.size)}
          </span>
        )}
        <input
          type="file"
          accept={op.accept}
          className="hidden"
          onChange={(e) => selectFile(e.target.files?.[0])}
        />
      </label>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {file && (
        <div className="space-y-4 rounded-xl border border-zinc-800 bg-[#101012] p-5">
          {op.options.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {op.options.map((field) => (
                <Field
                  key={field.key}
                  field={field}
                  value={opts[field.key] ?? field.default}
                  onChange={(v) => setOpts((prev) => ({ ...prev, [field.key]: v }))}
                />
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={convert}
              disabled={busy}
              className="rounded-lg bg-zinc-100 px-5 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:opacity-40"
            >
              {phase === "loading"
                ? "Loading video engine…"
                : phase === "working"
                  ? `Converting… ${Math.round(progress * 100)}%`
                  : "Convert"}
            </button>
            {(phase === "loading" || phase === "working") && (
              <div className="h-1.5 min-w-40 flex-1 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-zinc-100 transition-[width] duration-200"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            )}
            {phase === "loading" && (
              <span className="font-mono text-[11px] text-zinc-500">
                One-time engine download (~24 MB, cached afterwards)
              </span>
            )}
          </div>

          {phase === "done" && outputUrl && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3">
              <span className="font-mono text-xs text-zinc-400">
                Done · {formatBytes(file.size)} →{" "}
                <span className="font-semibold text-zinc-100">{formatBytes(outputSize)}</span>
              </span>
              <a
                href={outputUrl}
                download={outName}
                className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
              >
                Download {op.outputExt.toUpperCase()}
              </a>
            </div>
          )}

          {logs.length > 0 && (
            <details className="rounded-lg border border-zinc-800 px-4 py-2.5">
              <summary className="cursor-pointer font-mono text-[11px] text-zinc-500">
                Engine log ({logs.length} lines)
              </summary>
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-zinc-500">
                {logs.slice(-15).join("\n")}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
