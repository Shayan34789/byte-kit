"use client";

import { useState } from "react";
import { CopyButton } from "../copy-button";
import { IMAGE_ACCEPT, downloadBlob, formatBytes } from "./image-utils";

export function ImageBase64() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [dataUrl, setDataUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadFile = (file: File | undefined) => {
    setError("");
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const reader = new FileReader();
    reader.onload = () => {
      setDataUrl(reader.result as string);
      setPreviewUrl(URL.createObjectURL(file));
      setFileName(file.name);
      setFileSize(file.size);
    };
    reader.onerror = () => setError("Could not read that file.");
    reader.readAsDataURL(file);
  };

  const downloadTxt = () => {
    downloadBlob(
      new Blob([dataUrl], { type: "text/plain" }),
      fileName ? fileName.replace(/\.[^.]+$/, "") + ".txt" : "image-base64.txt"
    );
  };

  const shown = dataUrl.length > 120 ? dataUrl.slice(0, 120) + "…" : dataUrl;

  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-[#121316] p-8 text-center transition-colors hover:border-blue-500/50">
        <span className="font-mono text-xs text-zinc-300">
          {fileName || "Drop an image here, or click to browse"}
        </span>
        {fileName && (
          <span className="font-mono text-[11px] text-zinc-500">
            {fileName} · {formatBytes(fileSize)}
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

      {dataUrl && (
        <div className="space-y-4">
          {previewUrl && (
            <div className="flex min-h-[160px] items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Source preview" className="max-h-48 object-contain" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Data URI · {dataUrl.length.toLocaleString()} chars
            </span>
            <div className="flex gap-2">
              <CopyButton value={dataUrl} />
              <button
                onClick={downloadTxt}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-200 hover:border-zinc-600 transition-all"
              >
                Download .txt
              </button>
            </div>
          </div>
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-blue-300">
            {shown}
          </pre>
          <p className="font-mono text-[11px] text-zinc-600">
            Tip: paste the full string into CSS as{" "}
            <code className="text-zinc-400">background-image: url(&quot;…&quot;)</code>.
          </p>
        </div>
      )}
    </div>
  );
}
