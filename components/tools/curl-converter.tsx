"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "../copy-button";

type Parsed = {
  url: string;
  method: string;
  headers: [string, string][];
  data: string | null;
  user: string | null;
  compressed: boolean;
};

const SUPPORTED = new Set([
  "-X", "--request",
  "-H", "--header",
  "-d", "--data", "--data-raw", "--data-binary", "--data-ascii", "--json",
  "-u", "--user",
  "--compressed",
  "-L", "--location",
  "-A", "--user-agent",
  "--url",
]);

// Tokenize a shell command line, honouring single/double quotes and backslashes.
function tokenize(cmd: string): string[] {
  const tokens: string[] = [];
  let cur = "";
  let quote: string | null = null;
  let has = false;
  for (let i = 0; i < cmd.length; i++) {
    const ch = cmd[i];
    if (quote) {
      if (ch === quote) {
        quote = null;
      } else if (ch === "\\" && quote === '"' && i + 1 < cmd.length) {
        cur += cmd[++i];
      } else {
        cur += ch;
      }
      has = true;
    } else if (ch === "'" || ch === '"') {
      quote = ch;
      has = true;
    } else if (ch === "\\" && i + 1 < cmd.length) {
      cur += cmd[++i];
      has = true;
    } else if (/\s/.test(ch)) {
      if (has) {
        tokens.push(cur);
        cur = "";
        has = false;
      }
    } else {
      cur += ch;
      has = true;
    }
  }
  if (has) tokens.push(cur);
  return tokens;
}

function parseCurl(cmd: string): { parsed?: Parsed; error?: string } {
  const tokens = tokenize(cmd.trim().replace(/\\\n/g, " "));
  if (tokens.length === 0 || tokens[0] !== "curl") {
    return { error: "That doesn't start with a curl command. Paste a command beginning with curl." };
  }
  const args = tokens.slice(1);
  const parsed: Parsed = { url: "", method: "", headers: [], data: null, user: null, compressed: false };
  const unsupported: string[] = [];
  let i = 0;
  const takeValue = (flag: string): string | null => {
    if (i + 1 < args.length) return args[++i];
    unsupported.push(`${flag} (missing value)`);
    return null;
  };
  while (i < args.length) {
    const arg = args[i];
    if (arg === "--") {
      i++;
      if (i < args.length && !parsed.url) parsed.url = args[i];
      break;
    }
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      const flag = eq > 0 ? arg.slice(0, eq) : arg;
      const inlineVal = eq > 0 ? arg.slice(eq + 1) : null;
      if (!SUPPORTED.has(flag)) {
        unsupported.push(flag);
        i++;
        continue;
      }
      const val = inlineVal ?? (flag === "--compressed" || flag === "--location" ? null : takeValue(flag));
      if (flag === "--request" && val) parsed.method = val.toUpperCase();
      else if (flag === "--header" && val) {
        const colon = val.indexOf(":");
        if (colon > 0) parsed.headers.push([val.slice(0, colon).trim(), val.slice(colon + 1).trim()]);
      } else if ((flag === "--data" || flag === "--data-raw" || flag === "--data-binary" || flag === "--data-ascii" || flag === "--json") && val) {
        parsed.data = val;
        if (flag === "--json") parsed.headers.push(["Content-Type", "application/json"]);
      } else if (flag === "--user" && val) parsed.user = val;
      else if (flag === "--compressed") parsed.compressed = true;
      else if (flag === "--user-agent" && val) parsed.headers.push(["User-Agent", val]);
      i++;
      continue;
    }
    if (arg.startsWith("-") && arg.length > 1 && !/^https?:\/\//.test(arg)) {
      // Combined short flags, e.g. -sSL or -XPOST
      const letters = arg.slice(1);
      let consumedValue = false;
      for (let j = 0; j < letters.length; j++) {
        const flag = `-${letters[j]}`;
        if (flag === "-L") continue;
        if (flag === "-X" || flag === "-H" || flag === "-d" || flag === "-u" || flag === "-A") {
          const rest = letters.slice(j + 1);
          const val = rest || takeValue(flag);
          if (flag === "-X" && val) parsed.method = val.toUpperCase();
          else if (flag === "-H" && val) {
            const colon = val.indexOf(":");
            if (colon > 0) parsed.headers.push([val.slice(0, colon).trim(), val.slice(colon + 1).trim()]);
          } else if (flag === "-d" && val) parsed.data = val;
          else if (flag === "-u" && val) parsed.user = val;
          else if (flag === "-A" && val) parsed.headers.push(["User-Agent", val]);
          consumedValue = true;
          break;
        }
        if (!SUPPORTED.has(flag) && flag !== "-s" && flag !== "-S" && flag !== "-i" && flag !== "-v") {
          unsupported.push(flag);
        }
        // -s, -S, -i, -v are display-only flags: safe to ignore.
      }
      void consumedValue;
      i++;
      continue;
    }
    if (!parsed.url) parsed.url = arg;
    i++;
  }
  if (unsupported.length > 0) {
    return { error: `Unsupported flag(s): ${[...new Set(unsupported)].join(", ")}. Conversion stopped — remove them or the output could be silently wrong.` };
  }
  if (!parsed.url) return { error: "No URL found in this curl command." };
  if (!parsed.method) parsed.method = parsed.data !== null ? "POST" : "GET";
  return { parsed };
}

function jsString(s: string): string {
  return JSON.stringify(s);
}

function genFetch(p: Parsed): string {
  const lines: string[] = [`fetch(${jsString(p.url)}, {`, `  method: ${jsString(p.method)},`];
  const headers = [...p.headers];
  if (headers.length > 0 || p.user) {
    lines.push("  headers: {");
    headers.forEach(([k, v]) => lines.push(`    ${jsString(k)}: ${jsString(v)},`));
    if (p.user) lines.push(`    "Authorization": "Basic " + btoa(${jsString(p.user)}),`);
    lines.push("  },");
  }
  if (p.data !== null) lines.push(`  body: ${jsString(p.data)},`);
  lines.push("})");
  lines.push("  .then((res) => res.text())");
  lines.push("  .then(console.log);");
  return lines.join("\n");
}

function genAxios(p: Parsed): string {
  const lines: string[] = ["import axios from 'axios';", "", "axios({"];
  lines.push(`  method: ${jsString(p.method.toLowerCase())},`);
  lines.push(`  url: ${jsString(p.url)},`);
  const headers = [...p.headers];
  if (headers.length > 0 || p.user) {
    lines.push("  headers: {");
    headers.forEach(([k, v]) => lines.push(`    ${jsString(k)}: ${jsString(v)},`));
    if (p.user) lines.push(`    "Authorization": "Basic " + Buffer.from(${jsString(p.user)}).toString("base64"),`);
    lines.push("  },");
  }
  if (p.data !== null) lines.push(`  data: ${jsString(p.data)},`);
  lines.push("});");
  return lines.join("\n");
}

function genPython(p: Parsed): string {
  const lines: string[] = ["import requests", ""];
  const headers = [...p.headers];
  const args: string[] = [`${jsString(p.url)}`];
  if (headers.length > 0) {
    args.push("headers={\n" + headers.map(([k, v]) => `    ${jsString(k)}: ${jsString(v)},`).join("\n") + "\n}");
  }
  if (p.data !== null) args.push(`data=${jsString(p.data)}`);
  if (p.user) {
    const colon = p.user.indexOf(":");
    const user = colon >= 0 ? p.user.slice(0, colon) : p.user;
    const pass = colon >= 0 ? p.user.slice(colon + 1) : "";
    args.push(`auth=(${jsString(user)}, ${jsString(pass)})`);
  }
  lines.push(`response = requests.${p.method.toLowerCase()}(${args.join(", ")})`);
  lines.push("print(response.text)");
  return lines.join("\n");
}

function genGo(p: Parsed): string {
  const lines: string[] = [
    "package main",
    "",
    'import (',
    '  "bytes"',
    '  "fmt"',
    '  "io"',
    '  "net/http"',
    ")",
    "",
    "func main() {",
  ];
  if (p.data !== null) lines.push(`  body := bytes.NewBufferString(${jsString(p.data)})`);
  lines.push(`  req, err := http.NewRequest(${jsString(p.method)}, ${jsString(p.url)}, ${p.data !== null ? "body" : "nil"})`);
  lines.push("  if err != nil { panic(err) }");
  p.headers.forEach(([k, v]) => lines.push(`  req.Header.Set(${jsString(k)}, ${jsString(v)})`));
  if (p.user) lines.push(`  req.SetBasicAuth(${jsString(p.user.split(":")[0] ?? "")}, ${jsString(p.user.split(":").slice(1).join(":") ?? "")})`);
  lines.push("  resp, err := http.DefaultClient.Do(req)");
  lines.push("  if err != nil { panic(err) }");
  lines.push("  defer resp.Body.Close()");
  lines.push("  out, _ := io.ReadAll(resp.Body)");
  lines.push("  fmt.Println(string(out))");
  lines.push("}");
  return lines.join("\n");
}

function genPhp(p: Parsed): string {
  const lines: string[] = ["<?php", `$ch = curl_init(${jsString(p.url)});`];
  lines.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, ${jsString(p.method)});`);
  lines.push("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);");
  if (p.headers.length > 0) {
    lines.push("curl_setopt($ch, CURLOPT_HTTPHEADER, [");
    p.headers.forEach(([k, v]) => lines.push(`  ${jsString(`${k}: ${v}`)},`));
    lines.push("]);");
  }
  if (p.data !== null) lines.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, ${jsString(p.data)});`);
  if (p.user) lines.push(`curl_setopt($ch, CURLOPT_USERPWD, ${jsString(p.user)});`);
  lines.push("$response = curl_exec($ch);");
  lines.push("curl_close($ch);");
  lines.push("echo $response;");
  return lines.join("\n");
}

const TARGETS = [
  { id: "fetch", label: "JavaScript fetch" },
  { id: "axios", label: "JavaScript axios" },
  { id: "python", label: "Python requests" },
  { id: "go", label: "Go" },
  { id: "php", label: "PHP cURL" },
] as const;

type Target = (typeof TARGETS)[number]["id"];

const SAMPLE = `curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer abc123" \\
  -d '{"name": "Ada", "role": "admin"}'`;

export function CurlConverter() {
  const [input, setInput] = useState(SAMPLE);
  const [target, setTarget] = useState<Target>("fetch");

  const { code, error } = useMemo(() => {
    const { parsed, error: parseError } = parseCurl(input);
    if (parseError || !parsed) return { code: "", error: parseError };
    const gen =
      target === "fetch" ? genFetch : target === "axios" ? genAxios : target === "python" ? genPython : target === "go" ? genGo : genPhp;
    return { code: gen(parsed), error: undefined };
  }, [input, target]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {TARGETS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTarget(t.id)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              target === t.id
                ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
            cURL command
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="curl https://api.example.com/ ..."
            className="min-h-[260px] w-full resize-y rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Generated code
            </label>
            <CopyButton value={code} />
          </div>
          {error ? (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-mono text-xs leading-relaxed text-rose-300">
              {error}
            </p>
          ) : (
            <pre className="min-h-[260px] overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200">
              {code || <span className="text-zinc-600">Generated code will appear here...</span>}
            </pre>
          )}
        </div>
      </div>
      <p className="font-mono text-[11px] leading-relaxed text-zinc-500">
        Supported: URL, -X/--request, -H/--header, -d/--data (and --data-raw, --data-binary, --json), -u/--user, --compressed, -L, -A/--user-agent. Display-only flags (-s, -i, -v) are ignored. Anything else is reported, not guessed.
      </p>
    </div>
  );
}
