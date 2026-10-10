"use client";

import { useState } from "react";
import {
  IMAGE_ACCEPT,
  canvasToBlob,
  drawToCanvas,
  formatBytes,
  loadImageFile,
} from "./image-utils";

type Format = "jpeg" | "png";

export function ExifRemover() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [origSize, setOrigSize] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [format, setFormat] = useState<Format>("jpeg");
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
      setOrigSize(file.size);
      setDims({ w: width, h: height });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  };

  const strip = async () => {
    setError("");
    if (!srcUrl) return;
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not decode the image."));
        img.src = srcUrl as string;
      });
      // Re-encoding through canvas drops all EXIF / metadata segments.
      const canvas = drawToCanvas(
        img,
        img.naturalWidth,
        img.naturalHeight,
        format === "jpeg" ? "#ffffff" : undefined
      );
      const blob = await canvasToBlob(canvas, `image/${format}`, 0.95);
      if (outUrl) URL.revokeObjectURL(outUrl);
      setOutUrl(URL.createObjectURL(blob));
      setOutSize(blob.size);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to strip metadata.");
    }
  };

  const outName = fileName
    ? fileName.replace(/\.[^.]+$/, "") + `-clean.${format === "jpeg" ? "jpg" : format}`
    : `clean.${format === "jpeg" ? "jpg" : format}`;

  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-[#121316] p-8 text-center transition-colors hover:border-blue-500/50">
        <span className="font-mono text-xs text-zinc-300">
          {fileName || "Drop a photo here, or click to browse"}
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

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 font-mono text-[11px] leading-relaxed text-zinc-400">
        Photos from phones and cameras often embed hidden EXIF data — GPS location,
        device model, and timestamps. This tool re-encodes the pixels and drops every
        metadata segment, so the download is safe to share.
      </div>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-mono text-xs text-rose-300">
          {error}
        </p>
      )}

      {srcUrl && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-[#121316] p-4">
          <span className="font-mono text-xs text-zinc-400">Output:</span>
          {(["jpeg", "png"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
                format === f
                  ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                  : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {f === "jpeg" ? "JPG" : "PNG"}
            </button>
          ))}
          <button
            onClick={strip}
            className="ml-auto rounded-lg border border-blue-500/40 bg-blue-500/20 px-4 py-1.5 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-500/30 active:scale-[0.98] transition-all"
          >
            Strip metadata
          </button>
        </div>
      )}

      {outUrl && (
        <div className="space-y-3">
          <div className="flex min-h-[200px] items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={outUrl} alt="Cleaned preview" className="max-h-64 object-contain" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-zinc-500">
              {formatBytes(origSize)} → <span className="text-blue-400 font-semibold">{formatBytes(outSize)}</span>{" "}
              · metadata removed
            </span>
            <a
              href={outUrl}
              download={outName}
              className="rounded-lg bg-blue-500 px-4 py-1.5 font-mono text-xs font-bold text-zinc-950 transition-all hover:bg-blue-400"
            >
              Download clean image
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
