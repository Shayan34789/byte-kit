"use client";

import { useState } from "react";
import { IMAGE_ACCEPT, downloadBlob, drawToCanvas, formatBytes, loadImageFile } from "./image-utils";

const SIZES = [16, 32, 48] as const;

/** Build a .ico file from PNG blobs (Vista+ supports PNG-compressed entries). */
async function buildIco(pngBlobs: { size: number; blob: Blob }[]): Promise<Blob> {
  const buffers = await Promise.all(
    pngBlobs.map(async (p) => new Uint8Array(await p.blob.arrayBuffer()))
  );
  const headerSize = 6 + 16 * pngBlobs.length;
  const total = headerSize + buffers.reduce((n, b) => n + b.length, 0);
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type = icon
  view.setUint16(4, pngBlobs.length, true); // count
  let offset = headerSize;
  pngBlobs.forEach((p, i) => {
    const entry = 6 + i * 16;
    out[entry] = p.size >= 256 ? 0 : p.size; // width (0 = 256)
    out[entry + 1] = p.size >= 256 ? 0 : p.size; // height
    out[entry + 2] = 0; // color count
    out[entry + 3] = 0; // reserved
    view.setUint16(entry + 4, 1, true); // planes
    view.setUint16(entry + 6, 32, true); // bit count
    view.setUint32(entry + 8, buffers[i].length, true); // bytes in res
    view.setUint32(entry + 12, offset, true); // image offset
    out.set(buffers[i], offset);
    offset += buffers[i].length;
  });
  return new Blob([out.buffer as ArrayBuffer], { type: "image/x-icon" });
}

export function FaviconGenerator() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([]);
  const [icoUrl, setIcoUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  const loadFile = async (file: File | undefined) => {
    setError("");
    setPreviews([]);
    setIcoUrl(null);
    if (!file) return;
    try {
      const { url } = await loadImageFile(file);
      if (srcUrl) URL.revokeObjectURL(srcUrl);
      setSrcUrl(url);
      setFileName(file.name);
      setFileSize(file.size);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  };

  const generate = async () => {
    if (!srcUrl || working) return;
    setWorking(true);
    setError("");
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not decode the image."));
        img.src = srcUrl as string;
      });
      const pngs: { size: number; blob: Blob }[] = [];
      const prevs: { size: number; url: string }[] = [];
      for (const size of SIZES) {
        const canvas = drawToCanvas(img, size, size);
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("PNG encoding failed."))),
            "image/png"
          );
        });
        pngs.push({ size, blob });
        prevs.push({ size, url: URL.createObjectURL(blob) });
      }
      const ico = await buildIco(pngs);
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      if (icoUrl) URL.revokeObjectURL(icoUrl);
      setPreviews(prevs);
      setIcoUrl(URL.createObjectURL(ico));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Favicon generation failed.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-[#121316] p-8 text-center transition-colors hover:border-blue-500/50">
        <span className="font-mono text-xs text-zinc-300">
          {fileName || "Drop a square logo or image here, or click to browse"}
        </span>
        {fileName && (
          <span className="font-mono text-[11px] text-zinc-500">{formatBytes(fileSize)}</span>
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
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#121316] p-4">
          <span className="font-mono text-xs text-zinc-400">
            Generates 16, 32, and 48px PNGs bundled into one{" "}
            <code className="text-blue-300">favicon.ico</code>
          </span>
          <button
            onClick={generate}
            disabled={working}
            className="rounded-lg border border-blue-500/40 bg-blue-500/20 px-4 py-1.5 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-40"
          >
            {working ? "Generating…" : "Generate favicon"}
          </button>
        </div>
      )}

      {previews.length > 0 && (
        <div className="space-y-4 rounded-xl border border-zinc-800 bg-[#121316] p-5">
          <div className="flex flex-wrap items-end gap-6">
            {previews.map((p) => (
              <div key={p.size} className="flex flex-col items-center gap-2">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={`${p.size}px favicon preview`}
                    width={p.size}
                    height={p.size}
                    style={{ imageRendering: p.size <= 16 ? "pixelated" : "auto" }}
                  />
                </div>
                <span className="font-mono text-[11px] text-zinc-500">{p.size}px</span>
                <a
                  href={p.url}
                  download={`favicon-${p.size}x${p.size}.png`}
                  className="font-mono text-[11px] text-blue-400 hover:text-blue-300"
                >
                  PNG ↓
                </a>
              </div>
            ))}
          </div>
          {icoUrl && (
            <a
              href={icoUrl}
              download="favicon.ico"
              className="inline-block rounded-lg bg-blue-500 px-4 py-2 font-mono text-xs font-bold text-zinc-950 transition-all hover:bg-blue-400"
            >
              Download favicon.ico
            </a>
          )}
        </div>
      )}
    </div>
  );
}
