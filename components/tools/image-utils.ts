"use client";

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  if (bytes > 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function loadImageFile(file: File): Promise<{
  img: HTMLImageElement;
  url: string;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        img,
        url,
        width: img.naturalWidth || 0,
        height: img.naturalHeight || 0,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode that image file."));
    };
    img.src = url;
  });
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error(`This browser cannot encode ${type}.`));
      },
      type,
      quality
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function drawToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
  fillBackground?: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  if (fillBackground) {
    ctx.fillStyle = fillBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/** Scale dimensions to fit within maxSize on the longest edge, preserving aspect ratio. */
export function fitWithin(
  width: number,
  height: number,
  maxSize: number
): { width: number; height: number } {
  if (width <= maxSize && height <= maxSize) return { width, height };
  const scale = maxSize / Math.max(width, height);
  return { width: width * scale, height: height * scale };
}

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml,image/avif,image/bmp";
