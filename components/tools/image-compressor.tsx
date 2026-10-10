"use client";

import { useState } from "react";
import {
  IMAGE_ACCEPT,
  canvasToBlob,
  drawToCanvas,
  fitWithin,
  formatBytes,
  loadImageFile,
} from "./image-utils";

type Format = "jpeg" | "webp" | "png";

export function ImageCompressor() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [origSize, setOrigSize] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [format, setFormat] = useState<Format>("webp");
  const [quality, setQuality] = useState(0.8);
  const [maxDim, setMaxDim] = useState(1920);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState(0);
  const [outDims, setOutDims] = useState({ w: 0, h: 0 });
  const [error, setError] = useState("");

  const loadFile = async (file: File | undefined) => {
    setError("");
    setOutUrl(null);
    if (!file) return;
    try {
      const { url, width, height } = await loadImageFile(file);
      if (srcUrl) URL.revokeObjectURL(srcUrl);
      setSrcUrl(url);
      setFileName(file.name);
      setOrigSize(file.size);
      setDims({ w: width, h: height });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  };

  const compress = async () => {
    setError("");
    if (!srcUrl) return;
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not decode the image."));
        img.src = srcUrl as string;
      });
      const target = fitWithin(img.naturalWidth, img.naturalHeight, maxDim);
      const canvas = drawToCanvas(
        img,
        target.width,
        target.height,
        format === "jpeg" ? "#ffffff" : undefined
      );
      const blob = await canvasToBlob(canvas, `image/${format}`, quality);
      if (outUrl) URL.revokeObjectURL(outUrl);
      setOutUrl(URL.createObjectURL(blob));
      setOutSize(blob.size);
      setOutDims({ w: canvas.width, h: canvas.height });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed.");
    }
  };

  const saved = origSize > 0 && outSize > 0 ? Math.round((1 - outSize / origSize) * 100) : 0;
  const outName = fileName
    ? fileName.replace(/\.[^.]+$/, "") + `-compressed.${format === "jpeg" ? "jpg" : format}`
    : `compressed.${format === "jpeg" ? "jpg" : format}`;

  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-[#121316] p-8 text-center transition-colors hover:border-blue-500/50">
        <span className="font-mono text-xs text-zinc-300">
          {fileName || "Drop an image here, or click to browse"}
        </span>
        {dims.w > 0 && (
          <span className="font-mono text-[11px] text-zinc-500">
            {dims.w}×{dims.h}px · {formatBytes(origSize)}
          </span>
        )}
        <input
          type="file"
          accept={IMAGE_ACCEPT}
          className="hidden"
          onChange={(e) => loadFile(e.target.files?.[0])}
        />
      </label>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-mono text-xs text-rose-300">
          {error}
        </p>
      )}

      {srcUrl && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Original
              </span>
              <div className="flex min-h-[200px] items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={srcUrl} alt="Original preview" className="max-h-56 object-contain" />
              </div>
              <p className="font-mono text-[11px] text-zinc-500">
                {dims.w}×{dims.h}px · {formatBytes(origSize)}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                  Compressed
                </span>
                {outUrl && (
                  <a
                    href={outUrl}
                    download={outName}
                    className="rounded-lg border border-blue-500/40 bg-blue-500/20 px-3.5 py-1.5 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-500/30 transition-all"
                  >
                    Download
                  </a>
                )}
              </div>
              <div className="flex min-h-[200px] items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                {outUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={outUrl} alt="Compressed preview" className="max-h-56 object-contain" />
                ) : (
                  <span className="font-mono text-xs text-zinc-600">
                    Press Compress to render output…
                  </span>
                )}
              </div>
              {outUrl && (
                <p className="font-mono text-[11px] text-zinc-500">
                  {outDims.w}×{outDims.h}px · {formatBytes(outSize)} ·{" "}
                  <span className="text-blue-400 font-semibold">{saved}% smaller</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-800 bg-[#121316] p-4">
            <span className="font-mono text-xs text-zinc-400">Format:</span>
            {(["jpeg", "webp", "png"] as const).map((f) => (
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
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              <span>Max size</span>
              <input
                type="range"
                min="320"
                max="4096"
                step="32"
                value={maxDim}
                onChange={(e) => setMaxDim(Number(e.target.value))}
                className="w-24 accent-blue-400"
              />
              <span className="text-blue-400">{maxDim}px</span>
            </div>
            <button
              onClick={compress}
              className="ml-auto rounded-lg border border-blue-500/40 bg-blue-500/20 px-4 py-1.5 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-500/30 active:scale-[0.98] transition-all"
            >
              Compress
            </button>
          </div>
        </>
      )}
    </div>
  );
}
