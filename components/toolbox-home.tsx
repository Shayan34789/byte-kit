"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { categories, tools, type ToolDefinition } from "@/lib/tools.config";
import {
  MagnifyingGlass,
  BracketsCurly,
  TextT,
  FileJs,
  Drop,
  StackSimple,
  BracketsAngle,
  Key,
  LockSimple,
  Image as ImageIcon,
  Link as LinkIcon,
  Terminal,
  TextAa,
  Palette,
  Code,
  Sparkle,
  ShieldCheck,
  Cpu,
  ArrowUpRight,
  Command,
  Cube,
  SlidersHorizontal,
  X,
  List,
} from "@phosphor-icons/react";
import { ThemeToggle } from "./theme-toggle";

function getToolIcon(name: string) {
  switch (name) {
    case "BracketsCurly":
      return BracketsCurly;
    case "TextT":
      return TextT;
    case "FileJs":
      return FileJs;
    case "Drop":
      return Drop;
    case "StackSimple":
      return StackSimple;
    case "BracketsAngle":
      return BracketsAngle;
    case "MagnifyingGlass":
      return MagnifyingGlass;
    case "Key":
      return Key;
    case "LockSimple":
      return LockSimple;
    case "Image":
      return ImageIcon;
    case "Link":
      return LinkIcon;
    case "Terminal":
      return Terminal;
    case "TextAa":
      return TextAa;
    case "Palette":
      return Palette;
    case "Code":
      return Code;
    case "Sparkle":
    default:
      return Sparkle;
  }
}

export function ToolboxHome() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [activeFilter, setActiveFilter] = useState<"all" | "core" | "io">("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        document.getElementById("runtime-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchCat = activeCategory === "All" || tool.category === activeCategory;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [activeCategory, query]);

  const searchSuggestions = query.trim() ? filteredTools.slice(0, 5) : [];

  return (
    <div className="relative min-h-[100dvh] bg-[#090a0b] text-[#f4f4f5] selection:bg-teal-500/20 selection:text-teal-300">
      {/* Precision ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-[420px] w-[500px] rounded-full bg-teal-500/5 blur-[140px]" />
        <div className="absolute top-[40%] -left-32 h-[380px] w-[460px] rounded-full bg-emerald-500/5 blur-[160px]" />
      </div>

      {/* Top Utility Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#090a0b]/85 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-[#090a0b]/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-teal-400 shadow-inner">
              <Cube size={20} weight="duotone" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-tight text-zinc-100">
                  Byte-Kit
                </span>
                <span className="rounded bg-teal-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-teal-400">
                  v2.4
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">
                Browser Sandbox Core
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% In-Memory Runtime</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/70 text-zinc-400 transition-colors hover:border-teal-500/40 hover:text-teal-300 sm:hidden"
            >
              <List size={19} />
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <nav className="absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col border-l border-zinc-800 bg-[#111215] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">Navigation</span>
              <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu" className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200">
                <X size={19} />
              </button>
            </div>
            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All");
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full rounded-xl px-3 py-3 text-left font-mono text-sm text-zinc-200 transition-colors hover:bg-zinc-800"
              >
                All tools
              </button>
              <p className="px-3 pb-1 pt-5 font-mono text-[10px] uppercase tracking-widest text-zinc-600">Categories</p>
              {categories.filter((category) => category !== "All").map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setMobileMenuOpen(false);
                    document.getElementById("tool-index")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-full rounded-xl px-3 py-3 text-left font-mono text-sm transition-colors hover:bg-zinc-800 ${activeCategory === category ? "bg-teal-500/10 text-teal-300" : "text-zinc-400"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Hero section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-mono text-teal-300">
              <Cpu size={14} />
              <span>Free online developer tools · no uploads</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] text-zinc-100">
              Free developer tools for everyday engineering work.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-xl font-normal leading-relaxed">
              Format JSON, convert CSS units, decode JWTs, encode Base64, test regex, and transform text with fast browser-based utilities.
            </p>

            <div className="pt-2">
              <div className="relative max-w-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
                  <MagnifyingGlass size={18} />
                </div>
                <input
                  id="runtime-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by function, encoding, or format (e.g. JSON, JWT, REM)..."
                  aria-label="Search developer tools"
                  autoComplete="off"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#121316] py-3.5 pl-11 pr-24 font-mono text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 outline-none transition-all shadow-xl"
                />
                <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                    <Command size={10} /> K
                  </kbd>
                </div>
                {query.trim() && (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-zinc-800 bg-[#111215] p-2 shadow-2xl">
                    {searchSuggestions.length > 0 ? (
                      <div className="space-y-1">
                        {searchSuggestions.map((tool) => (
                          <Link
                            key={tool.slug}
                            href={`/tools/${tool.slug}`}
                            className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-zinc-800"
                          >
                            <span>
                              <span className="block text-sm font-semibold text-zinc-100">{tool.title}</span>
                              <span className="block font-mono text-[11px] text-zinc-500">{tool.category}</span>
                            </span>
                            <ArrowUpRight size={16} className="text-zinc-600" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="px-3 py-4 text-center font-mono text-xs text-zinc-500">
                        No tools match “{query}”
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills & Workbench Index */}
      <section id="tool-index" className="mx-auto max-w-7xl px-6 pb-24">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-zinc-800/80 mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 font-mono text-xs transition-all active:scale-[0.98] ${
                  isActive
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                    : "border border-zinc-800 bg-[#121316] text-zinc-400 hover:-translate-y-0.5 hover:border-teal-500/40 hover:bg-teal-500/5 hover:text-zinc-200 hover:shadow-md"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between mb-6 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">INDEX REGISTRY</span>
            <span className="text-zinc-600">/</span>
            <span className="text-teal-400 font-semibold">{filteredTools.length} utilities active</span>
          </div>
        </div>

        {/* Asymmetric Bento / Tool Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool, index) => {
              const IconComp = getToolIcon(tool.iconName);
              return (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  style={{ animationDelay: `${Math.min(index * 45, 450)}ms` }}
                  className="tool-card-enter group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#121316] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-teal-500/50 hover:bg-[#16171b] hover:shadow-[0_18px_38px_rgba(20,184,166,0.1)]"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700/60 bg-zinc-900 text-zinc-300 transition-colors group-hover:border-teal-500/40 group-hover:text-teal-400">
                        <IconComp size={20} weight="regular" />
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 transition-colors group-hover:text-teal-400 flex items-center gap-0.5">
                        <ArrowUpRight size={14} />
                      </span>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-base font-bold text-zinc-100 group-hover:text-teal-300 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-zinc-800/60 font-mono text-[11px]">
                    <span className="text-zinc-500 group-hover:text-zinc-400">
                      {tool.category}
                    </span>
                    <span className="text-[10px] text-zinc-600 group-hover:text-teal-400/80">
                      wasm-ready
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-[#121316] p-12 text-center">
            <MagnifyingGlass size={32} className="mx-auto text-zinc-600 mb-3" />
            <p className="font-mono text-sm text-zinc-400">No tools matched your search query.</p>
            <button
              onClick={() => {
                setQuery("");
                setActiveCategory("All");
              }}
              className="mt-3 font-mono text-xs text-teal-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>

      {/* Minimalist Tactile Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#090a0b] py-8 text-xs font-mono text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2">
            <Cube size={14} className="text-teal-400" />
            <span className="text-zinc-400">Byte-Kit Engineering</span>
            <span className="text-zinc-600">·</span>
            <span>Local Browser Primitives</span>
          </div>
          <div>No third-party CDN scripts · Offline execution verified</div>
        </div>
      </footer>
    </div>
  );
}
