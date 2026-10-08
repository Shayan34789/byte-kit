"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const storageKey = "devtoolbox-theme";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const nextLight = saved ? saved === "light" : prefersLight;
    setLight(nextLight);
    document.documentElement.classList.toggle("theme-light", nextLight);
  }, []);

  function toggleTheme() {
    const nextLight = !light;
    setLight(nextLight);
    document.documentElement.classList.toggle("theme-light", nextLight);
    window.localStorage.setItem(storageKey, nextLight ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      title={light ? "Switch to dark mode" : "Switch to light mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/70 text-zinc-400 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-500/60 hover:bg-teal-500/10 hover:text-teal-300 hover:shadow-[0_0_18px_rgba(20,184,166,0.14)]"
    >
      {light ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
