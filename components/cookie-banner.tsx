"use client";

import { useEffect, useState } from "react";

const consentKey = "devtoolbox-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(consentKey) !== "accepted");
  }, []);

  function acceptCookies() {
    window.localStorage.setItem(consentKey, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-sm leading-6 text-zinc-300">
        We use a small cookie to remember your preferences. No tracking or personal data is collected.
      </p>
      <button
        type="button"
        onClick={acceptCookies}
        className="shrink-0 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-400 hover:shadow-[0_6px_18px_rgba(20,184,166,0.25)]"
      >
        Accept
      </button>
    </div>
  );
}
