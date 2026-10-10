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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- after-mount theme sync avoids hydration mismatch
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
    >
      {light ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
