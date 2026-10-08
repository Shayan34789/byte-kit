"use client";

import { ArrowUp } from "lucide-react";
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
      className="fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/95 text-zinc-300 shadow-xl backdrop-blur transition-all hover:-translate-y-1 hover:border-teal-500/60 hover:bg-teal-500/10 hover:text-teal-300 hover:shadow-[0_0_22px_rgba(20,184,166,0.18)]"
    >
      <ArrowUp size={18} />
    </button>
  );
}
