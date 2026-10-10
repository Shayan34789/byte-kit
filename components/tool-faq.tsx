"use client";

import { useState } from "react";
import type { ToolFaq } from "@/lib/tool-content";

export function ToolFaq({ faqs }: { faqs: ToolFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mt-12" aria-labelledby="tool-faq-heading">
      <h2 id="tool-faq-heading" className="text-lg font-semibold tracking-tight text-zinc-100">
        Frequently asked questions
      </h2>
      <div className="mt-4 divide-y divide-zinc-800/70 border-y border-zinc-800/70">
        {faqs.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
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
                <p className="max-w-2xl pb-5 text-[15px] leading-relaxed text-zinc-400">
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
