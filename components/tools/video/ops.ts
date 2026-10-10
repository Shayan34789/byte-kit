"use client";

import type { FFmpegInstance as FFmpeg } from "./ffmpeg";

export type OptValues = Record<string, string | number>;

export type OptionField =
  | {
      key: string;
      label: string;
      type: "select";
      options: { value: string; label: string }[];
      default: string;
    }
  | {
      key: string;
      label: string;
      type: "number";
      default: number;
      min: number;
      max: number;
      step: number;
    }
  | {
      key: string;
      label: string;
      type: "text";
      default: string;
      placeholder?: string;
    };

export type VideoOp = {
  id: string;
  accept: string;
  inputExt: string;
  outputExt: string;
  outputMime: string;
  outputSuffix: string;
  hint: string;
  options: OptionField[];
  run: (engine: FFmpeg, opts: OptValues, input: string, output: string) => Promise<void>;
};

async function execChecked(engine: FFmpeg, args: string[]): Promise<void> {
  const code = await engine.exec(args);
  if (code !== 0) {
    throw new Error(`Conversion failed (exit code ${code}).`);
  }
}

const REMUX = (input: string, output: string) => [
  "-i", input,
  "-c", "copy",
  "-movflags", "+faststart",
  output,
];

const REENCODE_MP4 = (input: string, output: string) => [
  "-i", input,
  "-c:v", "libx264",
  "-preset", "veryfast",
  "-crf", "23",
  "-c:a", "aac",
  "-b:a", "128k",
  "-movflags", "+faststart",
  output,
];

const methodField = (def: string): OptionField => ({
  key: "method",
  label: "Method",
  type: "select",
  default: def,
  options: [
    { value: "auto", label: "Auto (lossless when possible)" },
    { value: "remux", label: "Lossless remux only" },
    { value: "reencode", label: "Re-encode (H.264)" },
  ],
});

async function remuxOrReencode(
  engine: FFmpeg,
  method: string | number,
  input: string,
  output: string
): Promise<void> {
  if (method === "reencode") {
    await execChecked(engine, REENCODE_MP4(input, output));
    return;
  }
  try {
    await execChecked(engine, REMUX(input, output));
  } catch (err) {
    if (method === "remux") throw err;
    // Auto: fall back to re-encoding when the streams can't be copied.
    await execChecked(engine, REENCODE_MP4(input, output));
  }
}

const qualityField = (def: string): OptionField => ({
  key: "quality",
  label: "Quality",
  type: "select",
  default: def,
  options: [
    { value: "high", label: "High quality (larger file)" },
    { value: "medium", label: "Balanced" },
    { value: "small", label: "Small file" },
  ],
});

const CRF: Record<string, string> = { high: "20", medium: "26", small: "32" };

export const VIDEO_OPS: Record<string, VideoOp> = {
  "mov-to-mp4": {
    id: "mov-to-mp4",
    accept: ".mov,.mp4,.m4v,video/quicktime,video/mp4",
    inputExt: "mov",
    outputExt: "mp4",
    outputMime: "video/mp4",
    outputSuffix: "-converted",
    hint: "QuickTime MOV in, universally playable MP4 out.",
    options: [methodField("auto")],
    run: (engine, opts, input, output) =>
      remuxOrReencode(engine, opts.method, input, output),
  },
  "mkv-to-mp4": {
    id: "mkv-to-mp4",
    accept: ".mkv,.mp4,video/x-matroska,video/mp4",
    inputExt: "mkv",
    outputExt: "mp4",
    outputMime: "video/mp4",
    outputSuffix: "-converted",
    hint: "Matroska MKV in, MP4 out. Streams are copied untouched when compatible.",
    options: [methodField("auto")],
    run: (engine, opts, input, output) =>
      remuxOrReencode(engine, opts.method, input, output),
  },
  "webm-to-mp4": {
    id: "webm-to-mp4",
    accept: ".webm,video/webm",
    inputExt: "webm",
    outputExt: "mp4",
    outputMime: "video/mp4",
    outputSuffix: "-converted",
    hint: "WebM (VP8/VP9) re-encoded to H.264 MP4 for maximum compatibility.",
    options: [qualityField("medium")],
    run: (engine, opts, input, output) =>
      execChecked(engine, [
        "-i", input,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", CRF[String(opts.quality)] ?? "26",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        output,
      ]),
  },
  "mp4-to-webm": {
    id: "mp4-to-webm",
    accept: ".mp4,.m4v,video/mp4",
    inputExt: "mp4",
    outputExt: "webm",
    outputMime: "video/webm",
    outputSuffix: "-converted",
    hint: "MP4 re-encoded to WebM (VP8 + Opus) for compact, web-ready video.",
    options: [qualityField("medium")],
    run: (engine, opts, input, output) =>
      execChecked(engine, [
        "-i", input,
        "-c:v", "libvpx",
        "-b:v", "0",
        "-crf", { high: "28", medium: "33", small: "38" }[String(opts.quality)] ?? "33",
        "-deadline", "realtime",
        "-cpu-used", "8",
        "-threads", "2",
        "-c:a", "libopus",
        "-b:a", "96k",
        output,
      ]),
  },
  "video-to-gif": {
    id: "video-to-gif",
    accept: "video/*,.mp4,.mov,.webm,.mkv",
    inputExt: "mp4",
    outputExt: "gif",
    outputMime: "image/gif",
    outputSuffix: "-animated",
    hint: "Two-pass palette conversion for crisp, small GIFs.",
    options: [
      {
        key: "fps",
        label: "Frames / second",
        type: "select",
        default: "10",
        options: [
          { value: "5", label: "5 fps" },
          { value: "10", label: "10 fps" },
          { value: "15", label: "15 fps" },
        ],
      },
      {
        key: "width",
        label: "Width",
        type: "select",
        default: "480",
        options: [
          { value: "320", label: "320 px" },
          { value: "480", label: "480 px" },
          { value: "640", label: "640 px" },
        ],
      },
    ],
    run: async (engine, opts, input, output) => {
      const fps = String(opts.fps);
      const width = String(opts.width);
      const palette = "palette.png";
      await execChecked(engine, [
        "-i", input,
        "-vf", `fps=${fps},scale=${width}:-1:flags=lanczos,palettegen`,
        palette,
      ]);
      try {
        await execChecked(engine, [
          "-i", input,
          "-i", palette,
          "-lavfi", `fps=${fps},scale=${width}:-1:flags=lanczos[x];[x][1:v]paletteuse`,
          output,
        ]);
      } finally {
        try {
          await engine.deleteFile(palette);
        } catch {
          /* ignore */
        }
      }
    },
  },
  "gif-to-mp4": {
    id: "gif-to-mp4",
    accept: ".gif,image/gif",
    inputExt: "gif",
    outputExt: "mp4",
    outputMime: "video/mp4",
    outputSuffix: "-converted",
    hint: "Animated GIFs become compact, silent H.264 MP4 videos.",
    options: [
      {
        key: "scale",
        label: "Size",
        type: "select",
        default: "original",
        options: [
          { value: "original", label: "Original size" },
          { value: "720", label: "Max 720 px wide" },
          { value: "480", label: "Max 480 px wide" },
        ],
      },
    ],
    run: (engine, opts, input, output) => {
      const vf =
        opts.scale === "original"
          ? "scale=trunc(iw/2)*2:trunc(ih/2)*2"
          : `scale=min(${opts.scale}\\,iw):-2`;
      return execChecked(engine, [
        "-i", input,
        "-movflags", "faststart",
        "-pix_fmt", "yuv420p",
        "-vf", vf,
        output,
      ]);
    },
  },
  "video-compressor": {
    id: "video-compressor",
    accept: "video/*,.mp4,.mov,.webm,.mkv",
    inputExt: "mp4",
    outputExt: "mp4",
    outputMime: "video/mp4",
    outputSuffix: "-compressed",
    hint: "Re-encodes to H.264 MP4 at a smaller size. Output is always MP4.",
    options: [
      {
        key: "resolution",
        label: "Resolution",
        type: "select",
        default: "720",
        options: [
          { value: "original", label: "Keep original" },
          { value: "1080", label: "1080p" },
          { value: "720", label: "720p" },
          { value: "480", label: "480p" },
        ],
      },
      qualityField("medium"),
    ],
    run: (engine, opts, input, output) =>
      execChecked(engine, [
        "-i", input,
        "-vf",
        opts.resolution === "original"
          ? "scale=trunc(iw/2)*2:trunc(ih/2)*2"
          : `scale=-2:'min(${opts.resolution},ih)'`,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", CRF[String(opts.quality)] ?? "28",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        output,
      ]),
  },
  "video-trimmer": {
    id: "video-trimmer",
    accept: "video/*,.mp4,.mov,.webm,.mkv",
    inputExt: "mp4",
    outputExt: "mp4",
    outputMime: "video/mp4",
    outputSuffix: "-trimmed",
    hint: "Cut a time range. Times accept seconds (90) or mm:ss (1:30).",
    options: [
      { key: "start", label: "Start time", type: "text", default: "0", placeholder: "0" },
      { key: "end", label: "End time (blank = to end)", type: "text", default: "", placeholder: "1:30" },
      {
        key: "mode",
        label: "Mode",
        type: "select",
        default: "lossless",
        options: [
          { value: "lossless", label: "Lossless (fast, cut on keyframes)" },
          { value: "precise", label: "Precise (re-encode, slower)" },
        ],
      },
    ],
    run: (engine, opts, input, output) => {
      const start = String(opts.start || "0").trim() || "0";
      const end = String(opts.end || "").trim();
      if (opts.mode === "precise") {
        const args = ["-ss", start, "-i", input];
        if (end) args.push("-to", end);
        return execChecked(engine, [
          ...args,
          "-c:v", "libx264",
          "-preset", "veryfast",
          "-crf", "23",
          "-c:a", "aac",
          "-movflags", "+faststart",
          output,
        ]);
      }
      const args = ["-ss", start];
      if (end) args.push("-to", end);
      return execChecked(engine, [
        ...args,
        "-i", input,
        "-c", "copy",
        "-movflags", "+faststart",
        output,
      ]);
    },
  },
};

export const VIDEO_OP_IDS = Object.keys(VIDEO_OPS);
