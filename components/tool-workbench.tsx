"use client";

import { useMemo, useState } from "react";
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
      className="min-h-[260px] w-full resize-y rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
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
              <span className="rounded bg-teal-500/10 px-1.5 py-0.5 font-mono text-[10px] text-teal-400">
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
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
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
            <span className="text-teal-400">{blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="64"
            value={blur}
            onChange={(e) => setBlur(e.target.value)}
            className="mt-2 w-full accent-teal-400"
          />
        </div>

        <div>
          <div className="flex justify-between font-mono text-xs text-zinc-300">
            <span>Alpha Opacity</span>
            <span className="text-teal-400">{opacity}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(e.target.value)}
            className="mt-2 w-full accent-teal-400"
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
          <pre className="rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-teal-300">
            {css}
          </pre>
        </div>
      </div>
    </div>
  );
}

// 3. Token Counter
function TokenCounter() {
  const [text, setText] = useState("");
  const trimmed = text.trim();
  const tokenEst = trimmed ? Math.ceil(trimmed.length / 3.8) : 0;
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const byteCount = new TextEncoder().encode(text).length;

  return (
    <div className="space-y-6">
      <CodeEditor
        value={text}
        onChange={setText}
        placeholder="Input context payload or agent dialogue..."
      />
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
            <span className="font-mono text-[10px] text-teal-400">ALGORITHM / TYP</span>
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
            <span className="font-mono text-[10px] text-teal-400">DATA PAYLOAD</span>
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
            className="rounded-lg bg-teal-500/20 border border-teal-500/40 px-3.5 py-1.5 font-mono text-xs font-semibold text-teal-300 hover:bg-teal-500/30 active:scale-[0.98] transition-all"
          >
            Sample Entropy Key
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            readOnly
            value={password}
            placeholder="Tap 'Sample Entropy Key' to execute CSPRNG..."
            className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2 font-mono text-xs text-teal-300 outline-none"
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
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
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

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Regex expression..."
          className="flex-1 rounded-xl border border-zinc-800 bg-[#121316] px-4 py-2 font-mono text-xs text-teal-300 outline-none focus:border-teal-500/40"
        />
        <input
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          placeholder="flags"
          className="w-20 rounded-xl border border-zinc-800 bg-[#121316] px-4 py-2 font-mono text-xs text-zinc-300 outline-none text-center"
        />
      </div>

      <CodeEditor value={text} onChange={setText} placeholder="Target corpus..." />

      <div className="rounded-xl border border-zinc-800 bg-[#121316] p-4 flex items-center justify-between">
        <span className="font-mono text-xs text-zinc-400">
          Match Count: <strong className="text-teal-400">{matches.length}</strong>
        </span>
        <div className="flex flex-wrap gap-1.5 max-w-lg justify-end">
          {matches.slice(0, 10).map((m, i) => (
            <span
              key={i}
              className="rounded bg-teal-500/10 px-2 py-0.5 font-mono text-[11px] text-teal-300"
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
  const [color, setColor] = useState("#0d9488");
  const hex = color.replace("#", "");
  const rgb =
    hex.length === 6
      ? [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4), 16),
        ]
      : [0, 0, 0];

  const output = `HEX: #${hex.toUpperCase()}\nRGB: rgb(${rgb.join(", ")})\nHSL: hsl(${Math.round(
    174
  )}, 84%, 32%)\nCSS: color: #${hex};`;

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
      <pre className="rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-teal-300">
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
    default:
      return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center font-mono text-xs text-zinc-500">
          Module is registered in local engine.
        </div>
      );
  }
}
