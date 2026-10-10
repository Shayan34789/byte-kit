"use client";

import { useState } from "react";
import JSZip from "jszip";
import {
  IMAGE_ACCEPT,
  canvasToBlob,
  downloadBlob,
  drawToCanvas,
  formatBytes,
  loadImageFile,
} from "./image-utils";

type Format = "png" | "jpeg" | "webp";

type Job = {
  id: number;
  file: File;
  status: "queued" | "working" | "done" | "error";
  note: string;
  blob?: Blob;
};

let nextId = 1;

export function BatchConverter() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [format, setFormat] = useState<Format>("webp");
  const [quality, setQuality] = useState(0.85);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const fresh: Job[] = Array.from(files).map((file) => ({
      id: nextId++,
      file,
      status: "queued" as const,
      note: formatBytes(file.size),
    }));
    setJobs((prev) => [...prev, ...fresh]);
    setError("");
  };

  const convertAll = async () => {
    if (running || jobs.length === 0) return;
    setRunning(true);
    setError("");
    const updated = [...jobs];
    for (const job of updated) {
      if (job.status === "done") continue;
      job.status = "working";
      job.note = "converting…";
      setJobs([...updated]);
      try {
        const { img, url, width, height } = await loadImageFile(job.file);
        const canvas = drawToCanvas(
          img,
          width,
          height,
          format === "jpeg" ? "#ffffff" : undefined
        );
        URL.revokeObjectURL(url);
        const blob = await canvasToBlob(canvas, `image/${format}`, quality);
        job.status = "done";
        job.note = `${formatBytes(job.file.size)} → ${formatBytes(blob.size)}`;
        job.blob = blob;
      } catch (e) {
        job.status = "error";
        job.note = e instanceof Error ? e.message : "Failed.";
      }
      setJobs([...updated]);
    }
    setRunning(false);
  };

  const downloadZip = async () => {
    const done = jobs.filter((j) => j.status === "done" && j.blob);
    if (done.length === 0) return;
    const zip = new JSZip();
    done.forEach((job) => {
      const base = job.file.name.replace(/\.[^.]+$/, "");
      zip.file(`${base}.${format === "jpeg" ? "jpg" : format}`, job.blob as Blob);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, `byte-kit-batch-${format}.zip`);
  };

  const clearAll = () => {
    setJobs([]);
    setError("");
  };

  const doneCount = jobs.filter((j) => j.status === "done").length;

  return (
    <div className="space-y-5">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-[#121316] p-8 text-center transition-colors hover:border-blue-500/50">
        <span className="font-mono text-xs text-zinc-300">
          Drop multiple images here, or click to browse
        </span>
        <span className="font-mono text-[11px] text-zinc-600">
          PNG, JPG, WebP, SVG, AVIF, BMP
        </span>
        <input
          type="file"
          accept={IMAGE_ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-[#121316] p-4">
        <span className="font-mono text-xs text-zinc-400">Target:</span>
        {(["png", "jpeg", "webp"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              format === f
                ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
        {format !== "png" && (
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span>Quality</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-24 accent-blue-400"
            />
            <span className="text-blue-400">{Math.round(quality * 100)}%</span>
          </div>
        )}
        <div className="ml-auto flex gap-2">
          <button
            onClick={clearAll}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-300 hover:border-zinc-600 transition-all"
          >
            Clear
          </button>
          <button
            onClick={convertAll}
            disabled={running || jobs.length === 0}
            className="rounded-lg border border-blue-500/40 bg-blue-500/20 px-4 py-1.5 font-mono text-xs font-semibold text-blue-300 transition-all hover:bg-blue-500/30 disabled:opacity-40"
          >
            {running ? "Converting…" : `Convert ${jobs.length} file${jobs.length === 1 ? "" : "s"}`}
          </button>
          {doneCount > 0 && !running && (
            <button
              onClick={downloadZip}
              className="rounded-lg bg-blue-500 px-4 py-1.5 font-mono text-xs font-bold text-zinc-950 transition-all hover:bg-blue-400"
            >
              Download ZIP ({doneCount})
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-mono text-xs text-rose-300">
          {error}
        </p>
      )}

      {jobs.length > 0 && (
        <ul className="space-y-2">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-[#121316] px-4 py-2.5"
            >
              <span className="truncate font-mono text-xs text-zinc-200">
                {job.file.name}
              </span>
              <span
                className={`shrink-0 font-mono text-[11px] ${
                  job.status === "done"
                    ? "text-blue-400"
                    : job.status === "error"
                      ? "text-rose-400"
                      : job.status === "working"
                        ? "text-amber-300"
                        : "text-zinc-500"
                }`}
              >
                {job.note}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
