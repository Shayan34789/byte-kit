"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 hover:shadow-md active:scale-[0.97]"
    >
      {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
