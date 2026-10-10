"use client";

import { useState } from "react";
import heic2any from "heic2any";
import {
  canvasToBlob,
  drawToCanvas,
  formatBytes,
} from "./image-utils";

type Format = "jpeg" | "png" | "webp";

export function HeicConverter() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [format, setFormat] = useState<Format>("jpeg");
  const [quality, setQuality] = useState(0.92);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState(0);
  const [outDims, setOutDims] = useState({ w: 0, h: 0 });
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [heicBlob, setHeicBlob] = useState<Blob | null>(null);

  const loadFile = (file: File | undefined) => {
    setError("");
    setOutUrl(null);
    setHeicBlob(null);
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith(".heic") && !name.endsWith(".heif") && file.type !== "image/heic" && file.type !== "image/heif") {
      setError("Please choose a .heic or .heif file.");
      return;
    }
    setHeicBlob(file);
    setFileName(file.name);
    setFileSize(file.size);
  };

  const convert = async () => {
    if (!heicBlob || working) return;
    setWorking(true);
    setError("");
    setOutUrl(null);
    try {
      const converted = await heic2any({
        blob: heicBlob,
        toType: `image/${format}`,
        quality,
      });
      const blob = Array.isArray(converted) ? converted[0] : (converted as Blob);
      // Draw through canvas to normalize + get dimensions
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Decoded image could not be rendered."));
        img.src = url;
      });
      const canvas = drawToCanvas(
        img,
        img.naturalWidth,
        img.naturalHeight,
        format === "jpeg" ? "#ffffff" : undefined
      );
      URL.revokeObjectURL(url);
      const finalBlob = await canvasToBlob(canvas, `image/${format}`, quality);
      if (outUrl) URL.revokeObjectURL(outUrl);
      setOutUrl(URL.createObjectURL(finalBlob));
      setOutSize(finalBlob.size);
      setOutDims({ w: canvas.width, h: canvas.height });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "HEIC conversion failed in this browser."
      );
    } finally {
      setWorking(false);
    }
  };

  const outName = fileName
    ? fileName.replace(/\.[^.]+$/, "") + `.${format === "jpeg" ? "jpg" : format}`
    : `converted.${format === "jpeg" ? "jpg" : format}`;

  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-[#121316] p-8 text-center transition-colors hover:border-blue-500/50">
        <span className="font-mono text-xs text-zinc-300">
          {fileName || "Drop a .heic / .heif photo here, or click to browse"}
        </span>
        {fileName && (
          <span className="font-mono text-[11px] text-zinc-500">{formatBytes(fileSize)}</span>
        )}
        <input
          type="file"
          accept=".heic,.heif,image/heic,image/heif"
          className="hidden"
          onChange={(e) => loadFile(e.target.files?.[0])}
        />
      </label>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-mono text-xs text-rose-300">
          {error}
        </p>
      )}

      {heicBlob && (
        <div className="space-y-4 rounded-xl border border-zinc-800 bg-[#121316] p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-zinc-400">Convert to:</span>
            {(["jpeg", "png", "webp"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
                  format === f
                    ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                    : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {f === "jpeg" ? "JPG" : f.toUpperCase()}
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
            <button
              onClick={convert}
              disabled={working}
              className="ml-auto rounded-lg border border-blue-500/40 bg-blue-500/20 px-4 py-1.5 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {working ? "Converting…" : "Convert"}
            </button>
          </div>

          {outUrl && (
            <div className="flex flex-col gap-3">
              <div className="flex min-h-[200px] items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={outUrl} alt="Converted preview" className="max-h-64 object-contain" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-zinc-500">
                  {outDims.w}×{outDims.h}px · {formatBytes(outSize)}
                </span>
                <a
                  href={outUrl}
                  download={outName}
                  className="rounded-lg bg-blue-500 px-4 py-1.5 font-mono text-xs font-bold text-zinc-950 transition-all hover:bg-blue-400"
                >
                  Download {format === "jpeg" ? "JPG" : format.toUpperCase()}
                </a>
              </div>
            </div>
          )}
          {working && (
            <p className="font-mono text-xs text-zinc-500">
              Decoding HEIC — this can take a few seconds for large photos…
            </p>
          )}
        </div>
      )}
    </div>
  );
}
