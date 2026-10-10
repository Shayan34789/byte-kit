"use client";

import { useState } from "react";
import {
  IMAGE_ACCEPT,
  canvasToBlob,
  drawToCanvas,
  formatBytes,
  loadImageFile,
} from "./image-utils";

type Format = "avif" | "png" | "jpeg" | "webp";

export function AvifConverter() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [format, setFormat] = useState<Format>("avif");
  const [quality, setQuality] = useState(0.8);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState(0);
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
      setFileSize(file.size);
      setDims({ w: width, h: height });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  };

  const convert = async () => {
    setError("");
    if (!srcUrl) return;
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not decode the image."));
        img.src = srcUrl as string;
      });
      const canvas = drawToCanvas(
        img,
        img.naturalWidth,
        img.naturalHeight,
        format === "jpeg" ? "#ffffff" : undefined
      );
      const blob = await canvasToBlob(canvas, `image/${format}`, quality);
      if (outUrl) URL.revokeObjectURL(outUrl);
      setOutUrl(URL.createObjectURL(blob));
      setOutSize(blob.size);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Conversion failed — your browser may not support AVIF encoding."
      );
    }
  };

  const outName = fileName
    ? fileName.replace(/\.[^.]+$/, "") + `.${format === "jpeg" ? "jpg" : format}`
    : `converted.${format === "jpeg" ? "jpg" : format}`;

  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-[#121316] p-8 text-center transition-colors hover:border-blue-500/50">
        <span className="font-mono text-xs text-zinc-300">
          {fileName || "Drop a PNG, JPG, WebP, or AVIF image here, or click to browse"}
        </span>
        {dims.w > 0 && (
          <span className="font-mono text-[11px] text-zinc-500">
            {dims.w}×{dims.h}px · {formatBytes(fileSize)}
          </span>
        )}
        <input
          type="file"
          accept={`${IMAGE_ACCEPT},image/avif`}
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
        <div className="space-y-4 rounded-xl border border-zinc-800 bg-[#121316] p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-zinc-400">Target:</span>
            {(["avif", "png", "jpeg", "webp"] as const).map((f) => (
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
              className="ml-auto rounded-lg border border-blue-500/40 bg-blue-500/20 px-4 py-1.5 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-500/30 active:scale-[0.98] transition-all"
            >
              Convert
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
                  {dims.w}×{dims.h}px · {formatBytes(fileSize)} →{" "}
                  <span className="text-blue-400 font-semibold">{formatBytes(outSize)}</span>
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
        </div>
      )}
    </div>
  );
}
