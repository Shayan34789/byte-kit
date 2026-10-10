"use client";

import { ArrowUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      frame = 0;
      setVisible((current) => {
        const next = window.scrollY > 420;
        return current === next ? current : next;
      });
    };
    const scheduleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(onScroll);
    };
    onScroll();
    window.addEventListener("scroll", scheduleScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 shadow-lg transition-colors hover:border-zinc-600 hover:text-zinc-100"
    >
      <ArrowUp size={18} />
    </button>
  );
}
