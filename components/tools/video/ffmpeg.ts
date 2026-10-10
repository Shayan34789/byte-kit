"use client";

/**
 * FFmpeg runs through the UMD build loaded from /ffmpeg/ via a script tag.
 * (The ESM build's `new Worker(new URL(...))` pattern can't be statically
 * resolved by Turbopack, so we keep the library out of the bundle entirely.)
 */

export type FFmpegInstance = {
  load: (config: { coreURL: string; wasmURL: string }) => Promise<void>;
  exec: (args: string[]) => Promise<number>;
  writeFile: (path: string, data: Uint8Array) => Promise<void>;
  readFile: (path: string) => Promise<Uint8Array>;
  deleteFile: (path: string) => Promise<void>;
  on: (event: "log" | "progress", cb: (payload: { message: string; progress: number }) => void) => void;
  terminate: () => void;
};

declare global {
  interface Window {
    FFmpegWASM?: { FFmpeg: new () => FFmpegInstance };
  }
}

let ffmpeg: FFmpegInstance | null = null;
let loadPromise: Promise<FFmpegInstance> | null = null;

// Base path when deployed to a subpath (e.g. GitHub Pages project sites).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export type EngineEvents = {
  onProgress?: (ratio: number) => void;
  onLog?: (message: string) => void;
};

const handlers: EngineEvents = {};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.FFmpegWASM) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Could not load the video engine script.")));
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load the video engine script."));
    document.head.appendChild(script);
  });
}

export async function getEngine(events: EngineEvents = {}): Promise<FFmpegInstance> {
  Object.assign(handlers, { onProgress: undefined, onLog: undefined, ...events });
  if (!ffmpeg) {
    await loadScript(`${basePath}/ffmpeg/ffmpeg.js`);
    const FFmpegClass = window.FFmpegWASM?.FFmpeg;
    if (!FFmpegClass) throw new Error("Video engine failed to initialise.");
    const instance = new FFmpegClass();
    instance.on("progress", ({ progress }) => {
      handlers.onProgress?.(Math.max(0, Math.min(1, progress || 0)));
    });
    instance.on("log", ({ message }) => {
      handlers.onLog?.(message);
    });
    ffmpeg = instance;
  }
  if (!loadPromise) {
    loadPromise = ffmpeg
      .load({
        coreURL: `${basePath}/ffmpeg/ffmpeg-core.js`,
        wasmURL: `${basePath}/ffmpeg/ffmpeg-core.wasm`,
      })
      .then(() => ffmpeg as FFmpegInstance)
      .catch((err) => {
        loadPromise = null;
        throw err;
      });
  }
  return loadPromise;
}

async function fetchFileData(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

export async function writeInputFile(engine: FFmpegInstance, name: string, file: File): Promise<void> {
  await engine.writeFile(name, await fetchFileData(file));
}

export async function readOutputFile(engine: FFmpegInstance, name: string, mime: string): Promise<Blob> {
  const bytes = await engine.readFile(name);
  // Copy out of the WASM heap before deleting the file.
  const copy = new Uint8Array(bytes.length);
  copy.set(bytes);
  try {
    await engine.deleteFile(name);
  } catch {
    /* already gone */
  }
  return new Blob([copy.buffer as ArrayBuffer], { type: mime });
}

export async function cleanupInput(engine: FFmpegInstance, name: string): Promise<void> {
  try {
    await engine.deleteFile(name);
  } catch {
    /* already gone */
  }
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function formatTime(totalSeconds: number): string {
  if (!isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
