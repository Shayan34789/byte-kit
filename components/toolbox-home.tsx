"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { categories, tools } from "@/lib/tools.config";
import { faqs } from "@/lib/faq";
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
  Images,
  FileImage,
  Star,
  FilmStrip,
  FilmSlate,
  VideoCamera,
  MonitorPlay,
  Play,
  FastForward,
  ArrowDown,
  Scissors,
  ArrowUpRight,
  Command,
  Cube,
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
      return Sparkle;
    case "Images":
      return Images;
    case "FileImage":
      return FileImage;
    case "Star":
      return Star;
    case "FilmStrip":
      return FilmStrip;
    case "FilmSlate":
      return FilmSlate;
    case "VideoCamera":
      return VideoCamera;
    case "MonitorPlay":
      return MonitorPlay;
    case "Play":
      return Play;
    case "FastForward":
      return FastForward;
    case "ArrowDown":
      return ArrowDown;
    case "Scissors":
      return Scissors;
    default:
      return Sparkle;
  }
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading" className="border-t border-zinc-800/70 py-16 sm:py-20">
      <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
        Frequently asked questions
      </h2>
      <div className="mt-8 divide-y divide-zinc-800/70 border-y border-zinc-800/70">
        {faqs.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-[15px] font-medium text-zinc-100">{faq.question}</span>
                <span
                  className={`shrink-0 text-xl leading-none text-zinc-500 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              {open && (
                <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-zinc-400">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ToolboxHome() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        document.getElementById("tool-search")?.focus();
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
    <div className="min-h-[100dvh] bg-[#090a0b] text-[#f4f4f5]">
      <header className="sticky top-0 z-40 border-b border-zinc-800/70 bg-[#090a0b]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-100 text-zinc-900">
              <Cube size={16} weight="bold" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-100">
              Byte-Kit
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100 sm:hidden"
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
            className="absolute inset-0 bg-black/60"
          />
          <nav className="absolute right-0 top-0 flex h-full w-[min(88vw,340px)] flex-col border-l border-zinc-800 bg-[#101012] p-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-sm font-semibold text-zinc-200">Browse</span>
              <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu" className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All");
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-zinc-200 transition-colors hover:bg-zinc-800/60"
              >
                All tools
              </button>
              {categories.filter((category) => category !== "All").map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setMobileMenuOpen(false);
                    document.getElementById("tool-index")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-zinc-800/60 ${activeCategory === category ? "bg-zinc-800 text-zinc-100" : "text-zinc-400"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6">
        <section className="pb-14 pt-16 sm:pb-20 sm:pt-24">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
            Simple tools for developers.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Format, convert, encode, and generate — everything runs locally in
            your browser. No sign-up, no uploads, no tracking.
          </p>

          <div className="relative mt-8 max-w-xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
              <MagnifyingGlass size={17} />
            </div>
            <input
              id="tool-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools…"
              aria-label="Search tools"
              autoComplete="off"
              className="w-full rounded-xl border border-zinc-800 bg-[#101012] py-3 pl-11 pr-20 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-zinc-600"
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
              <kbd className="hidden items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500 sm:inline-flex">
                <Command size={11} />K
              </kbd>
            </div>
            {query.trim() && (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-xl border border-zinc-800 bg-[#101012] p-1.5 shadow-xl">
                {searchSuggestions.length > 0 ? (
                  <div className="space-y-0.5">
                    {searchSuggestions.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-zinc-800/60"
                      >
                        <span>
                          <span className="block text-sm font-medium text-zinc-100">{tool.title}</span>
                          <span className="block text-xs text-zinc-500">{tool.category}</span>
                        </span>
                        <ArrowUpRight size={15} className="text-zinc-600" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="px-3 py-4 text-center text-sm text-zinc-500">
                    No tools match “{query}”
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section id="tool-index" className="pb-24">
          <div className="mb-6 flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-zinc-100 font-medium text-zinc-900"
                      : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => {
                const IconComp = getToolIcon(tool.iconName);
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group rounded-xl border border-zinc-800/80 bg-[#101012] p-5 transition-colors hover:border-zinc-600"
                  >
                    <div className="flex items-center justify-between">
                      <IconComp size={20} className="text-zinc-500 transition-colors group-hover:text-zinc-200" weight="regular" />
                      <ArrowUpRight
                        size={16}
                        className="text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-400"
                      />
                    </div>
                    <h2 className="mt-4 text-[15px] font-semibold tracking-tight text-zinc-100">
                      {tool.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-500">
                      {tool.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center">
              <p className="text-sm text-zinc-400">No tools match your search.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                }}
                className="mt-3 text-sm text-blue-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        <FaqSection />
      </main>

      <footer className="border-t border-zinc-800/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-zinc-500 sm:flex-row">
          <span>© 2026 Byte-Kit</span>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-zinc-200">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-zinc-200">
              Terms
            </Link>
            <Link href="/cookie-policy" className="transition-colors hover:text-zinc-200">
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
