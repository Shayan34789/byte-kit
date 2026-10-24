"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "../copy-button";

function pascal(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]+/g, " ").trim();
  if (!clean) return "Item";
  return clean
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function isSchema(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    ("properties" in value || "$schema" in value || ("type" in value && typeof (value as Record<string, unknown>).type === "string" && !("id" in value)))
  );
}

type Ctx = { interfaces: Map<string, string>; style: "interface" | "type" };

function schemaToTs(schema: Record<string, unknown>, name: string, ctx: Ctx): string {
  const type = schema.type as string | undefined;
  if (type === "object" || (schema.properties && typeof schema.properties === "object")) {
    const props = (schema.properties ?? {}) as Record<string, Record<string, unknown>>;
    const required = new Set((schema.required as string[] | undefined) ?? []);
    const lines = Object.entries(props).map(([key, sub]) => {
      const optional = required.has(key) ? "" : "?";
      return `  ${key}${optional}: ${schemaToTs(sub, name + pascal(key), ctx)};`;
    });
    const body = lines.length > 0 ? `{\n${lines.join("\n")}\n}` : "Record<string, unknown>";
    if (ctx.style === "interface") {
      ctx.interfaces.set(name, `export interface ${name} ${body}`);
    } else {
      ctx.interfaces.set(name, `export type ${name} = ${body};`);
    }
    return name;
  }
  if (type === "array") {
    const items = schema.items as Record<string, unknown> | undefined;
    const itemType = items ? schemaToTs(items, name + "Item", ctx) : "unknown";
    return `${itemType}[]`;
  }
  if (Array.isArray(schema.enum)) {
    return schema.enum.map((v) => (typeof v === "string" ? `"${v}"` : String(v))).join(" | ");
  }
  switch (type) {
    case "string": return "string";
    case "integer":
    case "number": return "number";
    case "boolean": return "boolean";
    case "null": return "null";
    default: {
      if (typeof schema.$ref === "string") {
        return pascal(schema.$ref.split("/").pop() ?? "Unknown");
      }
      return "unknown";
    }
  }
}

function infer(value: unknown, name: string, ctx: Ctx): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    // Arrays of objects: merge keys, mark keys missing from some items optional.
    if (value.every((v) => typeof v === "object" && v !== null && !Array.isArray(v))) {
      const objs = value as Record<string, unknown>[];
      const allKeys = [...new Set(objs.flatMap((o) => Object.keys(o)))];
      const lines = allKeys.map((key) => {
        const present = objs.filter((o) => key in o);
        const optional = present.length < objs.length ? "?" : "";
        const types = [...new Set(present.map((o) => infer(o[key], name + pascal(key), ctx)))];
        return `  ${key}${optional}: ${types.join(" | ")};`;
      });
      const body = `{\n${lines.join("\n")}\n}`;
      if (ctx.style === "interface") {
        ctx.interfaces.set(name, `export interface ${name} ${body}`);
      } else {
        ctx.interfaces.set(name, `export type ${name} = ${body};`);
      }
      return `${name}[]`;
    }
    const itemTypes = value.map((v) => infer(v, name + "Item", ctx));
    const unique = [...new Set(itemTypes)];
    if (unique.length === 1) return `${unique[0]}[]`;
    return `(${unique.join(" | ")})[]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    const lines = entries.map(([key, v]) => `  ${key}: ${infer(v, name + pascal(key), ctx)};`);
    const body = lines.length > 0 ? `{\n${lines.join("\n")}\n}` : "Record<string, unknown>";
    if (ctx.style === "interface") {
      ctx.interfaces.set(name, `export interface ${name} ${body}`);
    } else {
      ctx.interfaces.set(name, `export type ${name} = ${body};`);
    }
    return name;
  }
  return typeof value;
}

const SAMPLE = JSON.stringify(
  {
    id: 42,
    name: "Ada Lovelace",
    email: null,
    active: true,
    tags: ["admin", "editor"],
    address: { city: "London", postcode: "E1 6AN" },
    orders: [
      { orderId: "A1", total: 59.99, shipped: true },
      { orderId: "A2", total: 12.5 },
    ],
  },
  null,
  2
);

export function JsonToTypescript() {
  const [input, setInput] = useState(SAMPLE);
  const [style, setStyle] = useState<"interface" | "type">("interface");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      const parsed: unknown = JSON.parse(input);
      const ctx: Ctx = { interfaces: new Map(), style };
      let root: string;
      if (isSchema(parsed)) {
        root = schemaToTs(parsed, "Root", ctx);
      } else {
        root = infer(parsed, "Root", ctx);
      }
      const defs = [...ctx.interfaces.values()];
      if (defs.length === 0) return `export type Root = ${root};`;
      // Root definition first, then nested ones.
      const rootIdx = defs.findIndex((d) => d.includes("Root"));
      const ordered = rootIdx > 0 ? [defs[rootIdx], ...defs.filter((_, i) => i !== rootIdx)] : defs;
      return ordered.join("\n\n");
    } catch {
      return "Error: invalid JSON. Paste a JSON object, array, or JSON Schema.";
    }
  }, [input, style]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["interface", "type"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
              style === s
                ? "border border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {s === "interface" ? "interface" : "type alias"}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
            JSON or JSON Schema
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder='{"id": 1, "name": "..."}'
            className="min-h-[300px] w-full resize-y rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              TypeScript output
            </label>
            <CopyButton value={output} />
          </div>
          <pre className="min-h-[300px] overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-xs leading-relaxed text-zinc-200">
            {output || <span className="text-zinc-600">Types will appear here...</span>}
          </pre>
        </div>
      </div>
      <p className="font-mono text-[11px] leading-relaxed text-zinc-500">
        Nested objects become named interfaces. For arrays of objects, keys missing from some items become optional (?). Mixed-type values become unions. Field names are used as-is — rename any that are not valid identifiers.
      </p>
    </div>
  );
}
