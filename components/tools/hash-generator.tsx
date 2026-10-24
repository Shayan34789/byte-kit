"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "../copy-button";

// Pure-JS MD5 (WebCrypto deliberately has no MD5). Verified against the
// RFC 1321 test suite: "" , "abc", "hello", and the quick-brown-fox string.
function md5(input: string): string {
  const leftRotate = (x: number, c: number) => (x << c) | (x >>> (32 - c));
  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9,
    14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K: number[] = [];
  for (let i = 0; i < 64; i++) K.push(Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296));
  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;
  const msg = new TextEncoder().encode(input);
  const bitLen = msg.length * 8;
  const paddedLen = (((msg.length + 8) >> 6) + 1) << 6;
  const buf = new Uint8Array(paddedLen);
  buf.set(msg);
  buf[msg.length] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(paddedLen - 8, bitLen >>> 0, true);
  view.setUint32(paddedLen - 4, Math.floor(bitLen / 4294967296), true);
  for (let off = 0; off < paddedLen; off += 64) {
    const M: number[] = [];
    for (let j = 0; j < 16; j++) M.push(view.getUint32(off + j * 4, true));
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number;
      let g: number;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = (F + A + K[i] + M[g]) | 0;
      A = D;
      D = C;
      C = B;
      B = (B + leftRotate(F, s[i])) | 0;
    }
    a0 = (a0 + A) | 0;
    b0 = (b0 + B) | 0;
    c0 = (c0 + C) | 0;
    d0 = (d0 + D) | 0;
  }
  return [a0, b0, c0, d0]
    .map((w) =>
      [0, 8, 16, 24].map((sh) => ((w >>> sh) & 0xff).toString(16).padStart(2, "0")).join("")
    )
    .join("");
}

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function bufToBase64(buf: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

type HashOut = { label: string; hex: string; base64: string };

export function HashGenerator() {
  const [input, setInput] = useState("hello world");
  const [key, setKey] = useState("");
  const [useHmac, setUseHmac] = useState(false);
  const [format, setFormat] = useState<"hex" | "base64">("hex");
  const [results, setResults] = useState<HashOut[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setError("");
      try {
        const data = new TextEncoder().encode(input);
        const out: HashOut[] = [];
        if (useHmac) {
          if (!key) {
            setResults([]);
            return;
          }
          const cryptoKey = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(key),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
          );
          const sig256 = await crypto.subtle.sign("HMAC", cryptoKey, data);
          const key512 = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(key),
            { name: "HMAC", hash: "SHA-512" },
            false,
            ["sign"]
          );
          const sig512 = await crypto.subtle.sign("HMAC", key512, data);
          out.push({ label: "HMAC-SHA-256", hex: bufToHex(sig256), base64: bufToBase64(sig256) });
          out.push({ label: "HMAC-SHA-512", hex: bufToHex(sig512), base64: bufToBase64(sig512) });
        } else {
          const d256 = await crypto.subtle.digest("SHA-256", data);
          const d512 = await crypto.subtle.digest("SHA-512", data);
          out.push({ label: "SHA-256", hex: bufToHex(d256), base64: bufToBase64(d256) });
          out.push({ label: "SHA-512", hex: bufToHex(d512), base64: bufToBase64(d512) });
          out.push({ label: "MD5", hex: md5(input), base64: btoa(md5(input).match(/../g)!.map((h) => String.fromCharCode(parseInt(h, 16))).join("")) });
        }
        if (!cancelled) setResults(out);
      } catch {
        if (!cancelled) setError("Hashing is not available in this browser context (WebCrypto requires a secure context).");
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [input, key, useHmac]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setUseHmac(false)}
          className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
            !useHmac
              ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
              : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Plain hash
        </button>
        <button
          onClick={() => setUseHmac(true)}
          className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
            useHmac
              ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
              : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          HMAC (keyed)
        </button>
        {(["hex", "base64"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              format === f
                ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck={false}
        placeholder="Text to hash..."
        className="min-h-[120px] w-full resize-y rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
      />

      {useHmac && (
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="HMAC secret key..."
          className="w-full rounded-xl border border-zinc-800 bg-[#121316] px-4 py-2 font-mono text-xs text-zinc-200 outline-none focus:border-blue-500/40"
        />
      )}

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-mono text-xs text-rose-300">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {results.map((r) => (
          <div key={r.label} className="rounded-xl border border-zinc-800 bg-[#121316] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {r.label}
              </span>
              <CopyButton value={format === "hex" ? r.hex : r.base64} />
            </div>
            <p className="mt-2 break-all font-mono text-xs leading-relaxed text-blue-300">
              {format === "hex" ? r.hex : r.base64}
            </p>
          </div>
        ))}
        {useHmac && !key && (
          <p className="font-mono text-xs text-zinc-500">Enter an HMAC key to compute keyed hashes.</p>
        )}
      </div>
      <p className="font-mono text-[11px] leading-relaxed text-zinc-500">
        SHA-256 and SHA-512 run on the WebCrypto API. MD5 is computed by a small pure-JavaScript implementation because WebCrypto deliberately does not offer MD5 — use it only for checksums, never for passwords.
      </p>
    </div>
  );
}
