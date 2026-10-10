"use client";

import { useEffect, useState } from "react";

const consentKey = "devtoolbox-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Intentional: read localStorage after mount to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(window.localStorage.getItem(consentKey) !== "accepted");
  }, []);

  function acceptCookies() {
    window.localStorage.setItem(consentKey, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-sm leading-6 text-zinc-300">
        We use a small cookie to remember your preferences. No tracking or personal data is collected.
      </p>
      <button
        type="button"
        onClick={acceptCookies}
        className="shrink-0 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
      >
        Accept
      </button>
    </div>
  );
}
