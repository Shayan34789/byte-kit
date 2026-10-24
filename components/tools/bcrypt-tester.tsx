"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import { CopyButton } from "../copy-button";

function randomSalt(length = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const buf = new Uint32Array(length);
  crypto.getRandomValues(buf);
  return Array.from(buf, (v) => chars[v % chars.length]).join("");
}

// Argon2 is loaded as a runtime script, not bundled: argon2-browser's npm
// bundle requires Node's 'fs' and breaks the Turbopack build. The vendored
// files in public/ (argon2.js + argon2.wasm, from argon2-browser) are fetched
// at runtime, so the client bundle stays clean.
type Argon2Global = {
  hash: (opts: {
    pass: string;
    salt: string;
    time?: number;
    mem?: number;
    hashLen?: number;
    parallelism?: number;
    type?: number;
  }) => Promise<{ encoded: string }>;
  verify: (opts: { pass: string; encoded: string }) => Promise<boolean>;
  ArgonType: { Argon2id: number };
};

let argon2Promise: Promise<Argon2Global> | null = null;
let emsPromise: Promise<unknown> | null = null;

// The lib wrapper's browser path fetches the wasm binary itself, but it
// loads the Emscripten runtime via a relative dynamic import ('../dist/argon2.js')
// that cannot resolve on a static site — the wrapper hangs forever if that
// import 404s. The library supports a loadArgon2WasmModule hook, so we point
// it at our own vendored copy of the Emscripten runtime instead.
function loadEmscripten(): Promise<unknown> {
  if (!emsPromise) {
    emsPromise = new Promise((resolve, reject) => {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
      const script = document.createElement("script");
      script.src = `${base}/argon2-ems.js`;
      script.onload = () => resolve((globalThis as unknown as { Module?: unknown }).Module);
      script.onerror = () => reject(new Error("argon2 wasm runtime failed to load"));
      document.head.appendChild(script);
    });
  }
  return emsPromise;
}

function loadArgon2(): Promise<Argon2Global> {
  if (typeof window !== "undefined" && (window as unknown as { argon2?: Argon2Global }).argon2) {
    return Promise.resolve((window as unknown as { argon2: Argon2Global }).argon2);
  }
  if (!argon2Promise) {
    argon2Promise = new Promise((resolve, reject) => {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
      (globalThis as unknown as { argon2WasmPath?: string }).argon2WasmPath = `${base}/argon2.wasm`;
      (globalThis as unknown as { loadArgon2WasmModule?: () => Promise<unknown> }).loadArgon2WasmModule =
        () => loadEmscripten();
      const script = document.createElement("script");
      script.src = `${base}/argon2.js`;
      script.onload = () => {
        const lib = (window as unknown as { argon2?: Argon2Global }).argon2;
        if (lib) resolve(lib);
        else reject(new Error("argon2 script loaded but did not expose a library"));
      };
      script.onerror = () => reject(new Error("argon2 script failed to load"));
      document.head.appendChild(script);
    });
  }
  return argon2Promise;
}

export function BcryptTester() {
  const [mode, setMode] = useState<"bcrypt" | "argon2">("bcrypt");
  const [password, setPassword] = useState("");
  const [cost, setCost] = useState(10);
  const [hashOut, setHashOut] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const doHash = async () => {
    setError("");
    setHashOut("");
    if (!password) {
      setError("Enter a password to hash.");
      return;
    }
    try {
      if (mode === "bcrypt") {
        setHashOut(bcrypt.hashSync(password, cost));
      } else {
        setBusy(true);
        const argon2 = await loadArgon2();
        const result = await argon2.hash({
          pass: password,
          salt: randomSalt(),
          time: 3,
          mem: 4096,
          hashLen: 32,
          parallelism: 1,
          type: argon2.ArgonType.Argon2id,
        });
        setHashOut(result.encoded);
      }
    } catch {
      setError(
        mode === "argon2"
          ? "Argon2 failed to run in this browser (WebAssembly could not load). Bcrypt above still works."
          : "Hashing failed. Try a shorter password."
      );
    } finally {
      setBusy(false);
    }
  };

  const doVerify = async () => {
    setError("");
    setVerifyResult(null);
    if (!verifyPassword || !verifyHash) {
      setError("Enter both a password and a hash to verify.");
      return;
    }
    try {
      if (mode === "bcrypt") {
        setVerifyResult(bcrypt.compareSync(verifyPassword, verifyHash) ? "match" : "no-match");
      } else {
        setBusy(true);
        const argon2 = await loadArgon2();
        const ok = await argon2.verify({ pass: verifyPassword, encoded: verifyHash.trim() });
        setVerifyResult(ok ? "match" : "no-match");
      }
    } catch {
      setError(
        mode === "argon2"
          ? "Could not verify: that doesn't look like a valid Argon2 encoded hash, or WebAssembly failed to load."
          : "Could not verify: that doesn't look like a valid bcrypt hash."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {(["bcrypt", "argon2"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setHashOut("");
              setVerifyResult(null);
              setError("");
            }}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              mode === m
                ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {m === "bcrypt" ? "Bcrypt" : "Argon2id"}
          </button>
        ))}
        {mode === "bcrypt" && (
          <label className="ml-2 flex items-center gap-2 font-mono text-xs text-zinc-400">
            Cost factor
            <select
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="rounded-lg border border-zinc-800 bg-[#121316] px-2 py-1.5 font-mono text-xs text-zinc-200 outline-none"
            >
              {[10, 12, 14].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-[#121316] p-5 space-y-4">
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">Hash a password</span>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password to hash..."
            className="min-w-64 flex-1 rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2 font-mono text-xs text-zinc-200 outline-none focus:border-blue-500/40"
          />
          <button
            onClick={doHash}
            disabled={busy}
            className="rounded-lg border border-blue-500/40 bg-blue-500/20 px-4 py-2 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {busy ? "Working…" : "Generate hash"}
          </button>
        </div>
        {hashOut && (
          <div className="flex items-start gap-2">
            <p className="flex-1 break-all font-mono text-xs leading-relaxed text-blue-300">{hashOut}</p>
            <CopyButton value={hashOut} />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-[#121316] p-5 space-y-4">
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">Verify a password</span>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            placeholder="Password..."
            className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2 font-mono text-xs text-zinc-200 outline-none focus:border-blue-500/40"
          />
          <input
            value={verifyHash}
            onChange={(e) => setVerifyHash(e.target.value)}
            placeholder={mode === "bcrypt" ? "$2a$10$..." : "$argon2id$v=19$..."}
            spellCheck={false}
            className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2 font-mono text-xs text-zinc-200 outline-none focus:border-blue-500/40"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={doVerify}
            disabled={busy}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 font-mono text-xs font-semibold text-zinc-200 hover:border-zinc-600 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {busy ? "Working…" : "Verify"}
          </button>
          {verifyResult === "match" && (
            <span className="font-mono text-xs font-semibold text-emerald-400">Match — password is correct.</span>
          )}
          {verifyResult === "no-match" && (
            <span className="font-mono text-xs font-semibold text-rose-400">No match — wrong password or hash.</span>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-mono text-xs text-rose-300">
          {error}
        </p>
      )}
      <p className="font-mono text-[11px] leading-relaxed text-zinc-500">
        Bcrypt runs on bcryptjs; Argon2id runs on WebAssembly in your browser. Nothing is sent anywhere — but never verify a production password hash in a tool you do not trust, including this one.
      </p>
    </div>
  );
}
