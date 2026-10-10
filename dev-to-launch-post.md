---
title: "I Built 24 Free Dev Tools That Run Entirely in Your Browser"
published: false
tags: webdev, showdev, javascript, opensource
cover_image: https://byte-kit.dev/og-image.png
---

Every developer has a folder of bookmarked "free online tools" — JSON formatters, Base64 encoders, image converters. And every one of them has the same problem: you paste your data into some stranger's server and hope for the best.

I got tired of that tradeoff, so I built [Byte-Kit](https://byte-kit.dev/) — 24 developer tools that run 100% in your browser. No uploads, no accounts — and nothing you paste ever leaves your device.

## What's in the box

The usual suspects, done right:

- **JSON Formatter & Validator** — beautify, minify, and validate with precise error locations
- **JWT Decoder** — inspect headers and payloads without sending tokens anywhere
- **Regex Tester** — live highlighting with capture group breakdowns
- **LLM Token Counter** — estimate token usage before hitting paid APIs

Plus CSS tools (PX to REM, glassmorphism and box-shadow generators), encoders (URL/Base64, HTML entities, case converter), generators (passwords, UUIDs, prompt templates), and a full image workshop: batch converter, compressor, HEIC and AVIF converters, EXIF remover, SVG optimizer, and favicon generator.

## Why "runs in your browser" matters

Take the JWT decoder as an example. Pasting a production token into a random website is genuinely risky — those tokens are session credentials. With Byte-Kit, the decoding happens in JavaScript on your machine. Same for the EXIF remover: the whole point is photo privacy, so uploading your photos to strip them would be absurd.

## How it's built

It's a statically-exported Next.js site — every page is pre-rendered HTML, hosted on GitHub Pages. No server, no database, nothing to scale or secure. The heavy lifting (HEIC decoding, image tracing, ZIP generation) happens in Web Workers and WASM-style libraries loaded on demand, so the homepage stays light.

I also kept the design deliberately minimal — no badge pills, no glow effects, no AI-slop gradients. Just clean tools that load fast.

## Try it

It's free and open source (MIT): [byte-kit.dev](https://byte-kit.dev/) · [GitHub](https://github.com/Shayan34789/byte-kit)

If you use it, I'd love to know which tool you reach for most — and what's missing. I'm deciding what to build next.
