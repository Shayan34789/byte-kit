"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { CopyButton } from "./copy-button";
import {
  FileCode,
  SlidersHorizontal,
  Hash,
  Key,
  ArrowsLeftRight,
  CodeBlock,
  Palette,
  Sparkle,
} from "@phosphor-icons/react";

function ToolLoading() {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-zinc-800 bg-[#121316]">
      <span className="font-mono text-xs text-zinc-500">Loading module…</span>
    </div>
  );
}

const BatchConverter = dynamic(
  () => import("./tools/batch-converter").then((m) => m.BatchConverter),
  { ssr: false, loading: () => <ToolLoading /> }
);
const ImageCompressor = dynamic(
  () => import("./tools/image-compressor").then((m) => m.ImageCompressor),
  { ssr: false, loading: () => <ToolLoading /> }
);
const HeicConverter = dynamic(
  () => import("./tools/heic-converter").then((m) => m.HeicConverter),
  { ssr: false, loading: () => <ToolLoading /> }
);
const AvifConverter = dynamic(
  () => import("./tools/avif-converter").then((m) => m.AvifConverter),
  { ssr: false, loading: () => <ToolLoading /> }
);
const ImageBase64 = dynamic(
  () => import("./tools/image-base64").then((m) => m.ImageBase64),
  { ssr: false, loading: () => <ToolLoading /> }
);
const ExifRemover = dynamic(
  () => import("./tools/exif-remover").then((m) => m.ExifRemover),
  { ssr: false, loading: () => <ToolLoading /> }
);
const SvgOptimizer = dynamic(
  () => import("./tools/svg-optimizer").then((m) => m.SvgOptimizer),
  { ssr: false, loading: () => <ToolLoading /> }
);
const FaviconGenerator = dynamic(
  () => import("./tools/favicon-generator").then((m) => m.FaviconGenerator),
  { ssr: false, loading: () => <ToolLoading /> }
);
const SqlFormatter = dynamic(
  () => import("./tools/sql-formatter").then((m) => m.SqlFormatter),
  { ssr: false, loading: () => <ToolLoading /> }
);
const CurlConverter = dynamic(
  () => import("./tools/curl-converter").then((m) => m.CurlConverter),
  { ssr: false, loading: () => <ToolLoading /> }
);
const GitCommandBuilder = dynamic(
  () => import("./tools/git-command-builder").then((m) => m.GitCommandBuilder),
  { ssr: false, loading: () => <ToolLoading /> }
);
const HashGenerator = dynamic(
  () => import("./tools/hash-generator").then((m) => m.HashGenerator),
  { ssr: false, loading: () => <ToolLoading /> }
);
const BcryptTester = dynamic(
  () => import("./tools/bcrypt-tester").then((m) => m.BcryptTester),
  { ssr: false, loading: () => <ToolLoading /> }
);
const TailwindCssConverter = dynamic(
  () => import("./tools/tailwind-css-converter").then((m) => m.TailwindCssConverter),
  { ssr: false, loading: () => <ToolLoading /> }
);
const SvgToComponent = dynamic(
  () => import("./tools/svg-to-component").then((m) => m.SvgToComponent),
  { ssr: false, loading: () => <ToolLoading /> }
);
const GradientGenerator = dynamic(
  () => import("./tools/gradient-generator").then((m) => m.GradientGenerator),
  { ssr: false, loading: () => <ToolLoading /> }
);
const JsonToTypescript = dynamic(
  () => import("./tools/json-to-typescript").then((m) => m.JsonToTypescript),
  { ssr: false, loading: () => <ToolLoading /> }
);

type Props = { slug: string };

function CodeEditor({
  value,
  onChange,
  placeholder = "Input payload here...",
  readOnly = false,
}: {
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      spellCheck={false}
      placeholder={placeholder}
      className="min-h-[260px] w-full resize-y rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
    />
  );
}

function TwoPaneLayout({
  input,
  setInput,
  output,
  placeholder,
  outputTitle = "Output Result",
  badge,
}: {
  input: string;
  setInput: (value: string) => void;
  output: string;
  placeholder?: string;
  outputTitle?: string;
  badge?: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Source Buffer
          </label>
          <span className="font-mono text-[11px] text-zinc-600">
            {input.length} chars
          </span>
        </div>
        <CodeEditor value={input} onChange={setInput} placeholder={placeholder} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {outputTitle}
            </label>
            {badge && (
              <span className="rounded bg-blue-500/10 px-1.5 py-0.5 font-mono text-[10px] text-blue-400">
                {badge}
              </span>
            )}
          </div>
          <CopyButton value={output} />
        </div>
        <pre className="min-h-[260px] overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200">
          {output || <span className="text-zinc-600">Output will appear here...</span>}
        </pre>
      </div>
    </div>
  );
}

// 1. JSON / YAML / CSV Converter
function JsonYamlCsv() {
  const [input, setInput] = useState(
    JSON.stringify(
      [
        { id: 1, role: "admin", status: "active", latency: 24 },
        { id: 2, role: "member", status: "pending", latency: 42 },
      ],
      null,
      2
    )
  );
  const [format, setFormat] = useState<"yaml" | "csv">("yaml");

  const output = useMemo(() => {
    try {
      const parsed = JSON.parse(input) as unknown;
      if (format === "yaml") {
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) =>
              typeof item === "object" && item !== null
                ? `- ` +
                  Object.entries(item)
                    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
                    .join("\n  ")
                : `- ${String(item)}`
            )
            .join("\n");
        }
        if (typeof parsed === "object" && parsed !== null) {
          return Object.entries(parsed)
            .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
            .join("\n");
        }
      }
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
        const rows = parsed as Record<string, unknown>[];
        const keys = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
        const header = keys.join(",");
        const lines = rows.map((r) =>
          keys.map((k) => JSON.stringify(r[k] ?? "")).join(",")
        );
        return [header, ...lines].join("\n");
      }
      return "Format error: CSV requires an array of non-primitive objects.";
    } catch {
      return "SyntaxError: Enter valid JSON payload.";
    }
  }, [input, format]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {(["yaml", "csv"] as const).map((fmt) => (
          <button
            key={fmt}
            onClick={() => setFormat(fmt)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              format === fmt
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            Emit {fmt.toUpperCase()}
          </button>
        ))}
      </div>
      <TwoPaneLayout
        input={input}
        setInput={setInput}
        output={output}
        placeholder="Paste JSON array or document..."
        outputTitle={`Compiled ${format.toUpperCase()}`}
      />
    </div>
  );
}

// 2. CSS Generators
function CssGenerator({ shadow = false }: { shadow?: boolean }) {
  const [blur, setBlur] = useState(shadow ? "24" : "16");
  const [opacity, setOpacity] = useState(shadow ? "0.35" : "0.2");
  const [color, setColor] = useState(shadow ? "#000000" : "#ffffff");

  const css = shadow
    ? `/* Layered Tactile Shadow */\nbox-shadow: 0 12px ${blur}px rgba(0, 0, 0, ${opacity});`
    : `/* Frosted Glass Refraction */\nbackground: rgba(255, 255, 255, ${opacity});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, 0.12);`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-xl border border-zinc-800 bg-[#121316] p-5">
        <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-400">
          Parameter Controls
        </h3>
        <div>
          <div className="flex justify-between font-mono text-xs text-zinc-300">
            <span>Blur Radius</span>
            <span className="text-blue-400">{blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="64"
            value={blur}
            onChange={(e) => setBlur(e.target.value)}
            className="mt-2 w-full accent-blue-400"
          />
        </div>

        <div>
          <div className="flex justify-between font-mono text-xs text-zinc-300">
            <span>Alpha Opacity</span>
            <span className="text-blue-400">{opacity}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(e.target.value)}
            className="mt-2 w-full accent-blue-400"
          />
        </div>

        <div className="flex items-center justify-between font-mono text-xs text-zinc-300">
          <span>Surface Tint</span>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">{color}</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-7 w-10 cursor-pointer rounded border border-zinc-700 bg-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-zinc-800 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950 p-8">
          <div
            className="flex h-24 w-48 items-center justify-center rounded-xl text-center font-mono text-xs font-semibold text-zinc-100 transition-all"
            style={
              shadow
                ? { boxShadow: `0 12px ${blur}px rgba(0, 0, 0, ${opacity})`, backgroundColor: "#1e2025" }
                : {
                    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
                    backdropFilter: `blur(${blur}px)`,
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  }
            }
          >
            Viewport Surface
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-400">Generated Ruleset</span>
            <CopyButton value={css} />
          </div>
          <pre className="rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-blue-300">
            {css}
          </pre>
        </div>
      </div>
    </div>
  );
}

// 3. Token Counter
function estimateTokens(text: string): number {
  const trimmed = text.trim();
  return trimmed ? Math.ceil(trimmed.length / 3.8) : 0;
}

// Splits pasted chat text into system / user / assistant sections. Accepts
// "system: ...", "### User", "[assistant] ...", and "--- system ---" markers.
// Lines before the first marker are grouped as "text".
function parseRoles(text: string): { role: string; text: string }[] {
  const sections: { role: string; text: string }[] = [];
  let current = { role: "text", text: "" };
  const flush = () => {
    if (current.text.trim()) sections.push(current);
  };
  for (const line of text.split("\n")) {
    const marker = line.match(/^\s*(?:#{1,3}\s*)?(system|user|assistant)\s*:\s*(.*)$/i);
    const bracket = line.match(/^\s*\[(system|user|assistant)\]\s*(.*)$/i);
    const sep = line.match(/^\s*---\s*(system|user|assistant)\s*---\s*$/i);
    if (sep) {
      flush();
      current = { role: sep[1].toLowerCase(), text: "" };
    } else if (bracket) {
      flush();
      current = { role: bracket[1].toLowerCase(), text: bracket[2] ?? "" };
    } else if (marker && marker[1]) {
      flush();
      current = { role: marker[1].toLowerCase(), text: marker[2] ?? "" };
    } else {
      current.text += (current.text ? "\n" : "") + line;
    }
  }
  flush();
  return sections;
}

function TokenCounter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"single" | "breakdown">("single");
  const trimmed = text.trim();
  const tokenEst = estimateTokens(text);
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const byteCount = new TextEncoder().encode(text).length;

  const roles = useMemo(() => parseRoles(text), [text]);
  const roleTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const section of roles) {
      totals.set(section.role, (totals.get(section.role) ?? 0) + estimateTokens(section.text));
    }
    return [...totals.entries()];
  }, [roles]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {(["single", "breakdown"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              mode === m
                ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {m === "single" ? "Single text" : "Prompt breakdown"}
          </button>
        ))}
      </div>
      <CodeEditor
        value={text}
        onChange={setText}
        placeholder={
          mode === "breakdown"
            ? "system: You are a helpful assistant.\nuser: Explain photosynthesis.\nassistant: ..."
            : "Input context payload or agent dialogue..."
        }
      />
      {mode === "single" ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Est. Tokens", val: tokenEst, hint: "~3.8 char ratio" },
            { label: "Char Count", val: text.length, hint: "Total utf-16" },
            { label: "Word Count", val: wordCount, hint: "Whitespace delimited" },
            { label: "Payload Size", val: `${byteCount} B`, hint: "UTF-8 Bytes" },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-zinc-800 bg-[#121316] p-4"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                {m.label}
              </span>
              <div className="mt-1 font-mono text-2xl font-bold text-zinc-100">
                {m.val}
              </div>
              <span className="mt-1 block text-[10px] text-zinc-600">{m.hint}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {roleTotals.map(([role, tokens]) => (
              <div key={role} className="rounded-xl border border-zinc-800 bg-[#121316] p-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  {role} tokens
                </span>
                <div className="mt-1 font-mono text-2xl font-bold text-zinc-100">{tokens}</div>
              </div>
            ))}
            <div className="rounded-xl border border-zinc-800 bg-[#121316] p-4">
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                Total tokens
              </span>
              <div className="mt-1 font-mono text-2xl font-bold text-blue-400">{tokenEst}</div>
            </div>
          </div>
          {roles.length === 0 && (
            <p className="font-mono text-xs text-zinc-500">
              Paste a chat transcript and label sections with system:, user:, or assistant: — or use --- system --- separators — to see per-role token counts.
            </p>
          )}
          {roles.length > 0 && !roles.some((r) => r.role !== "text") && (
            <p className="font-mono text-xs text-amber-400/90">
              No role markers found — everything counted as plain text. Label lines with system:, user:, or assistant: to split it.
            </p>
          )}
          {roles.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-[#121316] p-4 space-y-2">
              {roles.map((section, idx) => (
                <div key={idx} className="flex items-baseline justify-between gap-4 font-mono text-xs">
                  <span className="text-zinc-400">
                    <span className="font-semibold text-zinc-200">{section.role}</span>
                    {" — "}
                    {section.text.trim().slice(0, 60)}
                    {section.text.trim().length > 60 ? "…" : ""}
                  </span>
                  <span className="shrink-0 text-blue-400">{estimateTokens(section.text)} tokens</span>
                </div>
              ))}
            </div>
          )}
          <p className="font-mono text-[11px] leading-relaxed text-zinc-500">
            Per-role counts use the same ~3.8 characters-per-token approximation as the single-text mode, so totals match between modes.
          </p>
        </div>
      )}
    </div>
  );
}

// 4. Unicode / Hidden Char Cleaner
function Cleaner() {
  const [input, setInput] = useState("");
  const output = input.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060\u2066-\u2069\uFEFF]/g,
    ""
  );
  const diff = input.length - output.length;

  return (
    <div className="space-y-4">
      <TwoPaneLayout
        input={input}
        setInput={setInput}
        output={output}
        placeholder="Paste text contaminated with zero-width characters..."
        badge={diff > 0 ? `${diff} zero-width stripped` : "Buffer clean"}
      />
    </div>
  );
}

// 5. JWT Inspector
function JwtDecoder() {
  const [token, setToken] = useState("");
  const parts = token.trim().split(".");

  const decodePart = (b64: string) => {
    try {
      const clean = b64.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.stringify(JSON.parse(atob(clean)), null, 2);
    } catch {
      return "Malformed or missing claims segment.";
    }
  };

  return (
    <div className="space-y-4">
      <CodeEditor
        value={token}
        onChange={setToken}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Header Claims
            </span>
            <span className="font-mono text-[10px] text-blue-400">ALGORITHM / TYP</span>
          </div>
          <pre className="min-h-[180px] overflow-auto rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs text-zinc-300">
            {token ? decodePart(parts[0] || "") : "// Waiting for JWT string..."}
          </pre>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Payload Claims
            </span>
            <span className="font-mono text-[10px] text-blue-400">DATA PAYLOAD</span>
          </div>
          <pre className="min-h-[180px] overflow-auto rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs text-zinc-300">
            {token ? decodePart(parts[1] || "") : "// Waiting for JWT string..."}
          </pre>
        </div>
      </div>
    </div>
  );
}

// 6. Password & UUID Generator
function PasswordUuid() {
  const [length, setLength] = useState(24);
  const [password, setPassword] = useState("");
  const [uuid, setUuid] = useState("");

  const genPass = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+";
    const buf = new Uint32Array(length);
    crypto.getRandomValues(buf);
    setPassword(Array.from(buf, (v) => chars[v % chars.length]).join(""));
  };

  const genUuid = () => setUuid(crypto.randomUUID());

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-[#121316] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="font-mono text-xs text-zinc-400">Entropy Length:</label>
            <input
              type="number"
              min="8"
              max="128"
              value={length}
              onChange={(e) => setLength(Math.max(8, Number(e.target.value)))}
              className="w-16 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-xs text-zinc-200"
            />
          </div>
          <button
            onClick={genPass}
            className="rounded-lg bg-blue-500/20 border border-blue-500/40 px-3.5 py-1.5 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-500/30 active:scale-[0.98] transition-all"
          >
            Sample Entropy Key
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            readOnly
            value={password}
            placeholder="Tap 'Sample Entropy Key' to execute CSPRNG..."
            className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2 font-mono text-xs text-blue-300 outline-none"
          />
          <CopyButton value={password} />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-[#121316] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-zinc-400">RFC 4122 UUID v4</span>
          <button
            onClick={genUuid}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-200 hover:border-zinc-600 active:scale-[0.98] transition-all"
          >
            Generate UUID
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={uuid}
            placeholder="Tap 'Generate UUID'..."
            className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2 font-mono text-xs text-zinc-300 outline-none"
          />
          <CopyButton value={uuid} />
        </div>
      </div>
    </div>
  );
}

// 7. URL / Base64 Codec
function UrlBase64() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"url" | "base64">("url");

  const output = useMemo(() => {
    try {
      return mode === "url"
        ? encodeURIComponent(input)
        : btoa(unescape(encodeURIComponent(input)));
    } catch {
      return "Encoding failed on current codepoints.";
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["url", "base64"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              mode === m
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                : "bg-zinc-800/60 text-zinc-400 border border-zinc-800"
            }`}
          >
            {m === "url" ? "URL Percent-Encode" : "RFC 4648 Base64"}
          </button>
        ))}
      </div>
      <TwoPaneLayout
        input={input}
        setInput={setInput}
        output={output}
        placeholder="Raw string to encode..."
      />
    </div>
  );
}

type ExplainedPart = { token: string; meaning: string };

const ESCAPE_MEANINGS: Record<string, string> = {
  d: "Any digit (0-9)",
  D: "Any character that is not a digit",
  w: "Any word character (letter, digit, or underscore)",
  W: "Any character that is not a word character",
  s: "Any whitespace character (space, tab, newline)",
  S: "Any character that is not whitespace",
  b: "Word boundary — the edge between a word and a non-word character",
  B: "Not a word boundary",
  n: "Newline character",
  t: "Tab character",
  r: "Carriage return",
  "0": "Null character",
};

const FLAG_MEANINGS: Record<string, string> = {
  g: "global — find every match, not just the first",
  i: "case-insensitive — A matches a",
  m: "multiline — ^ and $ match at line boundaries",
  s: "dotAll — . also matches newlines",
  u: "unicode — full Unicode handling, required for \\p{...} classes",
  y: "sticky — matches only from the last match position",
};

// Walks a pattern left to right and explains each piece in plain English.
// It is a best-effort explainer for common syntax, not a full regex parser.
function explainPattern(pattern: string): { parts: ExplainedPart[]; error?: string } {
  try {
    new RegExp(pattern);
  } catch (err) {
    return { parts: [], error: err instanceof Error ? err.message : "Invalid pattern." };
  }
  const parts: ExplainedPart[] = [];
  const push = (token: string, meaning: string) => parts.push({ token, meaning });
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === "\\") {
      const next = pattern[i + 1] ?? "";
      if ((next === "p" || next === "P") && pattern[i + 2] === "{") {
        const close = pattern.indexOf("}", i + 3);
        if (close > i) {
          const name = pattern.slice(i + 3, close);
          push(pattern.slice(i, close + 1), `${next === "p" ? "Any character in Unicode category" : "Any character NOT in Unicode category"} "${name}"`);
          i = close + 1;
          continue;
        }
      }
      push(`\\${next}`, ESCAPE_MEANINGS[next] ?? `Escaped literal "${next}" — matches the character itself`);
      i += 2;
      continue;
    }
    if (ch === "[") {
      let j = i + 1;
      let negated = false;
      if (pattern[j] === "^") {
        negated = true;
        j++;
      }
      if (pattern[j] === "]") j++;
      while (j < pattern.length && pattern[j] !== "]") {
        if (pattern[j] === "\\") j++;
        j++;
      }
      const inner = pattern.slice(i + 1 + (negated ? 1 : 0), j);
      push(
        pattern.slice(i, j + 1),
        negated
          ? `Any single character except: ${inner}`
          : `Any single character from: ${inner}`
      );
      i = j + 1;
      continue;
    }
    if (ch === "(") {
      if (pattern.startsWith("(?<", i) && !pattern.startsWith("(?<=", i) && !pattern.startsWith("(?<!", i)) {
        const end = pattern.indexOf(">", i);
        if (end > i) {
          push(pattern.slice(i, end + 1), `Start of named capture group "${pattern.slice(i + 3, end)}" — its match is saved under that name`);
          i = end + 1;
          continue;
        }
      }
      if (pattern.startsWith("(?:", i)) {
        push("(?:", "Start of a non-capturing group — groups items without saving the match");
        i += 3;
        continue;
      }
      if (pattern.startsWith("(?=", i)) {
        push("(?=", "Start of a positive lookahead — checks what follows without consuming it");
        i += 3;
        continue;
      }
      if (pattern.startsWith("(?!", i)) {
        push("(?!", "Start of a negative lookahead — requires that what follows does NOT match");
        i += 3;
        continue;
      }
      if (pattern.startsWith("(?<=", i)) {
        push("(?<=", "Start of a positive lookbehind — checks what precedes without consuming it");
        i += 4;
        continue;
      }
      if (pattern.startsWith("(?<!", i)) {
        push("(?<!", "Start of a negative lookbehind — requires that what precedes does NOT match");
        i += 4;
        continue;
      }
      push("(", "Start of a capture group — its match is saved and can be referenced as $1, $2, …");
      i++;
      continue;
    }
    if (ch === ")") {
      push(")", "End of group");
      i++;
      continue;
    }
    if (ch === "|") {
      push("|", "Alternation — try the option on the left first, otherwise the option on the right");
      i++;
      continue;
    }
    if (ch === "^") {
      push("^", "Start of the string (or start of a line with the m flag)");
      i++;
      continue;
    }
    if (ch === "$") {
      push("$", "End of the string (or end of a line with the m flag)");
      i++;
      continue;
    }
    if (ch === ".") {
      push(".", "Any single character except a newline (or including newlines with the s flag)");
      i++;
      continue;
    }
    if (ch === "*" || ch === "+" || ch === "?") {
      let meaning =
        ch === "*" ? "Zero or more of the previous item" : ch === "?" ? "Zero or one of the previous item" : "One or more of the previous item";
      let token = ch;
      if (pattern[i + 1] === "?") {
        meaning += " (lazy — match as few as possible)";
        token += "?";
        i++;
      }
      push(token, meaning);
      i++;
      continue;
    }
    if (ch === "{") {
      const close = pattern.indexOf("}", i);
      if (close > i && /^[\d,]+$/.test(pattern.slice(i + 1, close))) {
        const inner = pattern.slice(i + 1, close);
        const [a, b] = inner.split(",");
        let meaning =
          b === undefined
            ? `Exactly ${a} of the previous item`
            : b === ""
              ? `${a} or more of the previous item`
              : `Between ${a} and ${b} of the previous item`;
        let token = pattern.slice(i, close + 1);
        let next = close + 1;
        if (pattern[next] === "?") {
          meaning += " (lazy — match as few as possible)";
          token += "?";
          next++;
        }
        push(token, meaning);
        i = next;
        continue;
      }
      push(ch, `Literal "${ch}"`);
      i++;
      continue;
    }
    push(ch, `Literal "${ch}"`);
    i++;
  }
  return { parts };
}

// 8. Regex Tester
function RegexTester() {
  const [pattern, setPattern] = useState("\\b(?:error|warn|fail)\\w*\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState(
    "2026-10-08 [warn] Socket connection timeout\n2026-10-08 [error] Failed during handshake\n2026-10-08 [info] Retrying transaction"
  );

  const matches = useMemo(() => {
    try {
      const rx = new RegExp(pattern, flags);
      return Array.from(text.matchAll(rx), (m) => m[0]);
    } catch {
      return [];
    }
  }, [pattern, flags, text]);

  const explanation = useMemo(() => explainPattern(pattern), [pattern]);
  const flagNotes = useMemo(
    () =>
      Array.from(new Set(flags.split("")))
        .map((f) => ({ flag: f, meaning: FLAG_MEANINGS[f] ?? `Unknown flag "${f}"` })),
    [flags]
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Regex expression..."
          className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-[#121316] px-4 py-2 font-mono text-xs text-blue-300 outline-none focus:border-blue-500/40"
        />
        <input
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          placeholder="flags"
          className="w-20 rounded-xl border border-zinc-800 bg-[#121316] px-4 py-2 font-mono text-xs text-zinc-300 outline-none text-center"
        />
      </div>

      <CodeEditor value={text} onChange={setText} placeholder="Target corpus..." />

      <div className="rounded-xl border border-zinc-800 bg-[#121316] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            Pattern explained
          </span>
          {flagNotes.length > 0 && (
            <span className="font-mono text-[11px] text-zinc-500">
              Flags: {flagNotes.map((f) => f.flag).join("")}
            </span>
          )}
        </div>
        {explanation.error ? (
          <p className="font-mono text-xs text-rose-300">{explanation.error}</p>
        ) : explanation.parts.length === 0 ? (
          <p className="font-mono text-xs text-zinc-500">Type a pattern to see it explained piece by piece.</p>
        ) : (
          <ol className="space-y-2">
            {explanation.parts.map((part, idx) => (
              <li key={idx} className="flex gap-3 text-xs leading-relaxed">
                <code className="shrink-0 rounded bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] text-blue-300">
                  {part.token}
                </code>
                <span className="text-zinc-400">{part.meaning}</span>
              </li>
            ))}
          </ol>
        )}
        {flagNotes.length > 0 && (
          <ul className="space-y-1 border-t border-zinc-800 pt-3">
            {flagNotes.map((f) => (
              <li key={f.flag} className="flex gap-3 text-xs leading-relaxed">
                <code className="shrink-0 rounded bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
                  {f.flag}
                </code>
                <span className="text-zinc-500">{f.meaning}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-[#121316] p-4 flex items-center justify-between">
        <span className="font-mono text-xs text-zinc-400">
          Match Count: <strong className="text-blue-400">{matches.length}</strong>
        </span>
        <div className="flex flex-wrap gap-1.5 max-w-lg justify-end">
          {matches.slice(0, 10).map((m, i) => (
            <span
              key={i}
              className="rounded bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] text-blue-300"
            >
              {m}
            </span>
          ))}
          {matches.length > 10 && (
            <span className="font-mono text-[10px] text-zinc-500">
              +{matches.length - 10} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// 9. Case Formatter
function CaseConverter() {
  const [input, setInput] = useState("developer_toolbox_modern_utility");

  const results = useMemo(() => {
    const raw = input.trim();
    if (!raw) return "";
    const words = raw
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .split(/\s+/);

    const camel = words
      .map((w, i) =>
        i === 0
          ? w.toLowerCase()
          : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      )
      .join("");
    const kebab = words.map((w) => w.toLowerCase()).join("-");
    const snake = words.map((w) => w.toLowerCase()).join("_");
    const constant = words.map((w) => w.toUpperCase()).join("_");
    const pascal = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("");

    return `camelCase:   ${camel}\nkebab-case:  ${kebab}\nsnake_case:  ${snake}\nSCREAMING:   ${constant}\nPascalCase:  ${pascal}`;
  }, [input]);

  return (
    <TwoPaneLayout
      input={input}
      setInput={setInput}
      output={results}
      placeholder="Type text in any casing..."
      outputTitle="Transformed Casings"
    />
  );
}

// 10. Color Converter
function ColorConverter() {
  const [color, setColor] = useState("#2563eb");
  const hex = color.replace("#", "");
  const rgb =
    hex.length === 6
      ? [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4), 16),
        ]
      : [0, 0, 0];

  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

  const output = `HEX: #${hex.toUpperCase()}\nRGB: rgb(${rgb.join(", ")})\nHSL: ${hsl}\nCSS: color: #${hex};`;

  return (
    <div className="flex flex-col sm:flex-row items-start gap-6">
      <div className="flex flex-col items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-24 w-24 cursor-pointer rounded-2xl border border-zinc-700 bg-transparent"
        />
        <span className="font-mono text-xs text-zinc-400">Pick Swatch</span>
      </div>
      <div className="flex-1 w-full space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase text-zinc-400">
            Color Formats
          </span>
          <CopyButton value={output} />
        </div>
        <pre className="rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200">
          {output}
        </pre>
      </div>
    </div>
  );
}

// 11. HTML Entity Codec
function HtmlEncoder() {
  const [input, setInput] = useState('<div class="badge">&copy; 2026 Byte-Kit</div>');
  const output = useMemo(
    () =>
      input.replace(
        /[&<>"']/g,
        (ch) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          }[ch] ?? ch)
      ),
    [input]
  );

  return (
    <TwoPaneLayout
      input={input}
      setInput={setInput}
      output={output}
      placeholder="Paste HTML markup to escape..."
      outputTitle="Escaped Markup"
    />
  );
}

// 13. Image & SVG Converter
function ImageSvgConverter() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(0.92);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState(0);
  const [outDims, setOutDims] = useState({ w: 0, h: 0 });
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const loadFile = (file: File | undefined) => {
    setError("");
    setOutUrl(null);
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp|svg\+xml)$/.test(file.type)) {
      setError("Unsupported file type. Use PNG, JPG, WebP, or SVG.");
      return;
    }
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || 1024;
      const h = img.naturalHeight || 1024;
      setNatural({ w, h });
      setSrcUrl(url);
      setFileName(file.name);
      setFileSize(file.size);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Could not decode that image file.");
    };
    img.src = url;
  };

  const convert = () => {
    setError("");
    if (!srcUrl) return;
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || natural.w || 1024;
      const h = img.naturalHeight || natural.h || 1024;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Canvas is not available in this browser.");
        return;
      }
      if (format === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError(`This browser cannot encode ${format.toUpperCase()}.`);
            return;
          }
          if (outUrl) URL.revokeObjectURL(outUrl);
          setOutUrl(URL.createObjectURL(blob));
          setOutSize(blob.size);
          setOutDims({ w, h });
        },
        `image/${format}`,
        quality
      );
    };
    img.onerror = () => setError("Could not decode the source image for conversion.");
    img.src = srcUrl;
  };

  const fmtSize = (bytes: number) =>
    bytes > 1048576
      ? `${(bytes / 1048576).toFixed(2)} MB`
      : `${(bytes / 1024).toFixed(1)} KB`;

  const outName = fileName
    ? fileName.replace(/\.[^.]+$/, "") + `.${format === "jpeg" ? "jpg" : format}`
    : `converted.${format === "jpeg" ? "jpg" : format}`;

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          loadFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-blue-500/60 bg-blue-500/5" : "border-zinc-700 bg-[#121316]"
        }`}
      >
        <p className="font-mono text-xs text-zinc-300">
          Drop a PNG, JPG, WebP, or SVG file here, or
        </p>
        <label className="cursor-pointer rounded-lg border border-blue-500/40 bg-blue-500/20 px-4 py-2 font-mono text-xs font-semibold text-blue-300 transition-all hover:bg-blue-500/30">
          Browse files
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => loadFile(e.target.files?.[0])}
          />
        </label>
        {fileName && (
          <p className="font-mono text-[11px] text-zinc-500">
            {fileName} · {natural.w}×{natural.h}px · {fmtSize(fileSize)}
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-mono text-xs text-rose-300">
          {error}
        </p>
      )}

      {srcUrl && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Source Preview
            </span>
            <div className="flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={srcUrl} alt="Source preview" className="max-h-64 object-contain" />
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-[#121316] p-4">
              <span className="font-mono text-xs text-zinc-400">Target format:</span>
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
                    className="w-28 accent-blue-400"
                  />
                  <span className="text-blue-400">{Math.round(quality * 100)}%</span>
                </div>
              )}
              <button
                onClick={convert}
                className="rounded-lg bg-blue-500/20 border border-blue-500/40 px-4 py-1.5 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-500/30 active:scale-[0.98] transition-all"
              >
                Convert
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Converted Output
              </span>
              {outUrl && (
                <a
                  href={outUrl}
                  download={outName}
                  className="rounded-lg border border-blue-500/40 bg-blue-500/20 px-3.5 py-1.5 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-500/30 transition-all"
                >
                  Download {format.toUpperCase()}
                </a>
              )}
            </div>
            <div className="flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              {outUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={outUrl} alt="Converted preview" className="max-h-64 object-contain" />
              ) : (
                <span className="font-mono text-xs text-zinc-600">
                  Press Convert to render output...
                </span>
              )}
            </div>
            {outUrl && (
              <p className="font-mono text-[11px] text-zinc-500">
                {outDims.w}×{outDims.h}px · {fmtSize(outSize)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 12. Prompt Template Generator
function PromptGenerator() {
  const [role, setRole] = useState("Systems Architect");
  const [task, setTask] = useState("Audit low-latency TypeScript code");
  const [constraints, setConstraints] = useState("Zero unnecessary allocations, strict type inference");

  const prompt = `[ROLE]\nYou are a senior ${role}.\n\n[OBJECTIVE]\n${task}\n\n[CONSTRAINTS]\n${constraints}\n\n[INSTRUCTIONS]\n- Deliver production-ready code with reasoning.\n- Omit generic pleasantries and filler summary.`;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Agent role persona..."
          className="rounded-xl border border-zinc-800 bg-[#121316] px-4 py-2 font-mono text-xs text-zinc-200 outline-none"
        />
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Specific operational task..."
          className="rounded-xl border border-zinc-800 bg-[#121316] px-4 py-2 font-mono text-xs text-zinc-200 outline-none"
        />
      </div>
      <input
        value={constraints}
        onChange={(e) => setConstraints(e.target.value)}
        placeholder="Execution constraints and boundary requirements..."
        className="w-full rounded-xl border border-zinc-800 bg-[#121316] px-4 py-2 font-mono text-xs text-zinc-200 outline-none"
      />
      <div className="flex items-center justify-between pt-2">
        <span className="font-mono text-xs text-zinc-400">Assembled Prompt Matrix</span>
        <CopyButton value={prompt} />
      </div>
      <pre className="rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-blue-300">
        {prompt}
      </pre>
    </div>
  );
}

export function ToolWorkbench({ slug }: Props) {
  switch (slug) {
    case "json-yaml-csv":
      return <JsonYamlCsv />;
    case "glassmorphism-generator":
      return <CssGenerator />;
    case "box-shadow-generator":
      return <CssGenerator shadow />;
    case "llm-token-counter":
      return <TokenCounter />;
    case "invisible-character-cleaner":
      return <Cleaner />;
    case "jwt-decoder":
      return <JwtDecoder />;
    case "password-uuid-generator":
      return <PasswordUuid />;
    case "image-svg-converter":
      return <ImageSvgConverter />;
    case "url-base64":
      return <UrlBase64 />;
    case "regex-tester":
      return <RegexTester />;
    case "case-converter":
      return <CaseConverter />;
    case "color-converter":
      return <ColorConverter />;
    case "html-entity-encoder":
      return <HtmlEncoder />;
    case "prompt-template-generator":
      return <PromptGenerator />;
    case "batch-image-converter":
      return <BatchConverter />;
    case "image-compressor":
      return <ImageCompressor />;
    case "heic-converter":
      return <HeicConverter />;
    case "avif-converter":
      return <AvifConverter />;
    case "image-to-base64":
      return <ImageBase64 />;
    case "exif-remover":
      return <ExifRemover />;
    case "svg-optimizer":
      return <SvgOptimizer />;
    case "favicon-generator":
      return <FaviconGenerator />;
    case "sql-formatter":
      return <SqlFormatter />;
    case "curl-converter":
      return <CurlConverter />;
    case "git-command-builder":
      return <GitCommandBuilder />;
    case "hash-generator":
      return <HashGenerator />;
    case "bcrypt-tester":
      return <BcryptTester />;
    case "tailwind-css-converter":
      return <TailwindCssConverter />;
    case "svg-to-component":
      return <SvgToComponent />;
    case "gradient-generator":
      return <GradientGenerator />;
    case "json-to-typescript":
      return <JsonToTypescript />;
    default:
      return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center font-mono text-xs text-zinc-500">
          Module is registered in local engine.
        </div>
      );
  }
}
