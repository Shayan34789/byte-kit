export type ToolFaq = { question: string; answer: string };

export type ToolContent = {
  details: string[];
  faqs: ToolFaq[];
};

export const toolContent: Record<string, ToolContent> = {
  "json-formatter": {
    details: [
      "The JSON Formatter validates, beautifies, and minifies JSON entirely in your browser. Paste minified API responses to make them readable, or compress formatted JSON before sending it over the wire. Invalid JSON is flagged with a precise error location so you can fix it fast.",
      "Because everything runs locally, you can safely format JSON containing API keys, tokens, or personal data without sending it to a server. The formatter handles deeply nested objects, arrays, unicode escapes, and large payloads without lag.",
    ],
    faqs: [
      {
        question: "Is my JSON data sent to a server?",
        answer:
          "No. All parsing and formatting happens locally in your browser via JavaScript. Your data never leaves your device, so it's safe to use with sensitive payloads.",
      },
      {
        question: "What's the difference between beautify and minify?",
        answer:
          "Beautify adds indentation and line breaks for readability, while minify strips all unnecessary whitespace to produce the smallest possible output — useful before storing or transmitting JSON.",
      },
      {
        question: "How do I find what's wrong with invalid JSON?",
        answer:
          "Paste it into the formatter and it will point to the exact line and character where parsing failed, with a description of the problem such as a missing comma or trailing quote.",
      },
    ],
  },
  "px-to-rem": {
    details: [
      "The PX to REM Converter translates pixel values into rem units for responsive, accessible CSS. Set your root font size (usually 16px), enter any pixel value, and get the rem equivalent instantly — along with a full conversion table for common sizes.",
      "Using rem instead of px respects the user's browser font-size settings, which matters for accessibility. This tool is handy when converting a px-based design mockup into a fluid, scalable stylesheet.",
    ],
    faqs: [
      {
        question: "Why use rem instead of px?",
        answer:
          "Rem units scale with the root font size, so layouts adapt when users change their browser's default text size. Pixel values stay fixed, which can break accessibility for users who need larger text.",
      },
      {
        question: "What root font size should I use?",
        answer:
          "16px is the browser default and the most common choice. If your project sets a different root size (for example 10px for easier math), enter it and all conversions adjust accordingly.",
      },
      {
        question: "Does this handle decimal values?",
        answer:
          "Yes. Fractional pixel values convert to precise rem values, rounded to a sensible number of decimal places for clean CSS output.",
      },
    ],
  },
  "json-yaml-csv": {
    details: [
      "The JSON / YAML / CSV converter translates structured data between the three most common interchange formats. Paste JSON and get YAML for configuration files, or flatten nested data into CSV for spreadsheets — conversions are bidirectional and instant.",
      "It's particularly useful when moving data between systems: exporting API responses into CSV for analysis, or turning spreadsheet exports into JSON for an application. All conversion logic runs locally in your browser.",
    ],
    faqs: [
      {
        question: "How are nested objects handled in CSV output?",
        answer:
          "Nested keys are flattened using dot notation (for example address.city), so hierarchical data becomes a clean two-dimensional table without losing structure.",
      },
      {
        question: "Can I convert CSV back to JSON?",
        answer:
          "Yes. Paste CSV and the tool reconstructs JSON objects from the header row, reversing the dot-notation flattening where possible.",
      },
      {
        question: "Is my data uploaded anywhere?",
        answer:
          "No. Conversion happens entirely client-side, so proprietary or sensitive datasets never leave your machine.",
      },
    ],
  },
  "glassmorphism-generator": {
    details: [
      "The Glassmorphism Generator creates the frosted-glass card effect — a translucent background with backdrop blur, subtle border, and soft shadow. Adjust blur, transparency, saturation, and border radius, then copy production-ready CSS.",
      "The output includes both the standard backdrop-filter and the -webkit- prefixed version for Safari compatibility. Preview your settings on light and dark backgrounds before copying.",
    ],
    faqs: [
      {
        question: "Does backdrop-filter work in all browsers?",
        answer:
          "It's supported in all modern browsers. Safari requires the -webkit-backdrop-filter prefix, which this tool includes automatically in the generated CSS.",
      },
      {
        question: "Why does my glass card look wrong on some backgrounds?",
        answer:
          "Backdrop blur needs content behind the element to blur. Make sure the card sits over an image, gradient, or patterned background — over a flat color the effect is nearly invisible.",
      },
      {
        question: "How do I keep the text readable on glass cards?",
        answer:
          "Increase the background opacity slightly and use high-contrast text. The generator lets you tune transparency until the text passes contrast requirements.",
      },
    ],
  },
  "box-shadow-generator": {
    details: [
      "The Box Shadow Generator builds layered CSS shadows with a visual preview. Control horizontal and vertical offset, blur radius, spread, color, opacity, and inset mode — then copy the resulting box-shadow declaration.",
      "Layering multiple soft shadows creates more realistic depth than a single hard shadow. The tool shows each layer's contribution so you can fine-tune realistic elevation for cards, modals, and buttons.",
    ],
    faqs: [
      {
        question: "What's the difference between blur and spread?",
        answer:
          "Blur softens the shadow's edges, while spread expands or contracts the shadow's overall size. A large blur with zero spread gives a soft glow; adding spread makes it denser.",
      },
      {
        question: "When should I use inset shadows?",
        answer:
          "Inset shadows render inside the element's border, useful for pressed-button states, inner depth on input fields, or vignette effects on images.",
      },
      {
        question: "How do I make shadows look natural?",
        answer:
          "Use two or three stacked shadows: a tight, darker one for contact depth plus a large, faint one for ambient lift. Avoid pure black — tint shadows toward your background color.",
      },
    ],
  },
  "llm-token-counter": {
    details: [
      "The LLM Token Counter estimates how many tokens your text will consume in large language models. Paste a prompt and see token counts, character-to-token ratios, and estimated costs across popular models — all computed locally with a BPE-style tokenizer approximation. Switch to Prompt breakdown mode to split a chat transcript into system, user, and assistant roles and see per-role token counts using the same approximation.",
      "Staying under context limits matters when building prompts, RAG pipelines, or chat applications. This tool helps you trim prompts before sending them to paid APIs, avoiding truncated outputs and surprise bills.",
    ],
    faqs: [
      {
        question: "How accurate is the token estimate?",
        answer:
          "It's a close approximation using a GPT-style byte-pair encoding. Exact counts vary slightly between model families (GPT, Claude, Llama), but the estimate is typically within a few percent.",
      },
      {
        question: "Why do some words cost more tokens than others?",
        answer:
          "Tokenizers split text into chunks from their vocabulary. Common words are usually one token; rare words, misspellings, and non-English text split into multiple tokens, and each character of code or URLs can add up.",
      },
      {
        question: "Does whitespace count toward tokens?",
        answer:
          "Yes. Spaces, newlines, and indentation all consume tokens — which is why minifying JSON or stripping extra blank lines from prompts genuinely reduces cost.",
      },
    ],
  },
  "invisible-character-cleaner": {
    details: [
      "The Invisible Character Cleaner finds and strips zero-width spaces, zero-width joiners, byte-order marks, and other invisible unicode characters that sneak into text from copy-paste, PDFs, and rich editors. It shows exactly what was removed and where.",
      "These characters cause real bugs: broken string comparisons, failed password matches, corrupted CSV imports, and mysterious lint errors. Running pasted content through this cleaner before using it in code or data pipelines prevents hours of debugging.",
    ],
    faqs: [
      {
        question: "What are invisible unicode characters?",
        answer:
          "They're valid unicode codepoints with no visible glyph — like zero-width space (U+200B) or the byte-order mark (U+FEFF). They survive copy-paste and are impossible to spot by eye, but code treats them as real characters.",
      },
      {
        question: "Where do invisible characters come from?",
        answer:
          "Most commonly from copying text out of PDFs, Word documents, websites, or chat apps. Some are inserted deliberately as watermarks; most arrive by accident during formatting conversions.",
      },
      {
        question: "Will this damage my text?",
        answer:
          "The cleaner only removes characters classified as invisible or formatting-only. Visible text, emoji, and meaningful whitespace like newlines are preserved.",
      },
    ],
  },
  "jwt-decoder": {
    details: [
      "The JWT Decoder splits a JSON Web Token into its header, payload, and signature, then pretty-prints the claims — expiry, issuer, subject, and custom fields. Paste any token to inspect what it carries without sending it anywhere.",
      "Note that decoding is not verification: this tool shows you the token's contents, but only the issuing server can validate the signature. Never paste production secrets into any online tool you don't trust — this one runs fully offline in your browser.",
    ],
    faqs: [
      {
        question: "Is it safe to paste my JWT here?",
        answer:
          "Yes — decoding happens entirely in your browser and the token is never transmitted. Still, treat decoded tokens carefully: they may contain session credentials, so don't share screenshots of them.",
      },
      {
        question: "Does decoding verify the signature?",
        answer:
          "No. Decoding reads the payload; verification requires the issuer's secret or public key. A token can decode cleanly and still be forged or expired — always check the exp claim.",
      },
      {
        question: "Why does my token show as invalid?",
        answer:
          "Usually it's truncated during copy (JWTs have three dot-separated segments), or it contains line breaks from terminal output. Make sure you copied the complete token.",
      },
    ],
  },
  "password-uuid-generator": {
    details: [
      "The Password & UUID Generator creates cryptographically secure random passwords and RFC 4122 version 4 UUIDs using the browser's Web Crypto API. Choose password length and character sets, or generate collision-resistant identifiers for database keys and request IDs.",
      "Unlike pseudo-random Math.random() generators, Web Crypto draws from the operating system's entropy pool, making outputs unpredictable and suitable for real secrets. Nothing is stored or transmitted.",
    ],
    faqs: [
      {
        question: "Are these passwords truly random?",
        answer:
          "Yes. They use crypto.getRandomValues(), the browser's cryptographically secure random number generator backed by OS-level entropy — far stronger than Math.random().",
      },
      {
        question: "What is a UUID v4 used for?",
        answer:
          "UUIDs are 128-bit unique identifiers used as database primary keys, idempotency keys, session IDs, and filenames. Version 4 is randomly generated, with 122 bits of entropy making collisions practically impossible.",
      },
      {
        question: "Should I use the generated password directly?",
        answer:
          "Yes, that's the point — but store it in a password manager rather than reusing it. Longer passwords with mixed character sets resist brute-force attacks exponentially better than short ones.",
      },
    ],
  },
  "image-svg-converter": {
    details: [
      "The Image to SVG Converter vectorizes raster images (PNG, JPG) into scalable SVG graphics using edge tracing. Upload an image and get resolution-independent vector output — ideal for logos, icons, and simple illustrations that need to scale crisply.",
      "Tracing works best on high-contrast images with flat colors, like logos and line art. Photographs with gradients convert too, but produce large files — for those, the SVG Optimizer can help reduce the output size.",
    ],
    faqs: [
      {
        question: "When should I convert an image to SVG?",
        answer:
          "For logos, icons, and simple graphics that must look sharp at any size. SVGs scale infinitely without pixelation and are usually smaller than the PNGs they'd replace.",
      },
      {
        question: "Why is my converted SVG file so large?",
        answer:
          "Complex or photographic images generate thousands of vector paths. Simplify the source image first — increase contrast, reduce colors — or run the result through the SVG Optimizer.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. The tracing runs entirely in your browser, so your images stay private on your device.",
      },
    ],
  },
  "url-base64": {
    details: [
      "The URL & Base64 tool encodes and decodes strings in both URL percent-encoding and Base64. Switch modes to safely embed data in query strings, encode binary-safe tokens, or decode opaque strings you encounter in APIs and configs.",
      "URL encoding converts reserved characters like & and ? into % sequences so they survive transport in links. Base64 represents arbitrary bytes as plain ASCII text — the standard trick for embedding images in CSS or tokens in headers.",
    ],
    faqs: [
      {
        question: "When do I need URL encoding?",
        answer:
          "Whenever user input or data containing characters like spaces, ampersands, or question marks goes into a URL's query string. Unencoded, those characters break the URL's structure.",
      },
      {
        question: "What's Base64 used for?",
        answer:
          "Embedding binary data as text: data URIs for images in HTML/CSS, basic-auth credentials, email attachments (MIME), and opaque API tokens. It inflates size by about 33%, so it's not compression.",
      },
      {
        question: "Why did my Base64 decode fail?",
        answer:
          "Usually padding (trailing =) was stripped, or the string contains URL-safe variants (- and _ instead of + and /). Re-add padding or convert from the URL-safe alphabet first.",
      },
    ],
  },
  "regex-tester": {
    details: [
      "The Regex Tester lets you build and debug regular expressions against live text. Type a pattern and flags, and matches highlight instantly with capture group breakdowns — no more guessing why a pattern fails in production. The Pattern explained panel breaks your regex down piece by piece in plain English: groups (including named groups), character classes, quantifiers, anchors, alternation, and flags.",
      "It uses JavaScript's regex engine, so behavior matches what you'd get in Node.js or the browser. Test edge cases like empty strings, unicode, and multiline input before committing a pattern to your codebase.",
    ],
    faqs: [
      {
        question: "Why doesn't my pattern match?",
        answer:
          "The usual suspects: unescaped special characters (., *, +, ?), forgetting the global flag for multiple matches, or greedy quantifiers consuming too much. The live highlighting shows exactly what matched, which pinpoints the issue.",
      },
      {
        question: "What do the flags do?",
        answer:
          "g finds all matches instead of stopping at the first, i makes matching case-insensitive, and m lets ^ and $ match at line boundaries instead of just the string's start and end.",
      },
      {
        question: "Will this pattern work in Python or Go?",
        answer:
          "Mostly — basic syntax is shared. But lookaheads, named groups, and unicode handling differ between engines, so always re-test in your target language for critical patterns.",
      },
    ],
  },
  "case-converter": {
    details: [
      "The Case Converter transforms text between camelCase, PascalCase, snake_case, kebab-case, SCREAMING_SNAKE_CASE, and more. Paste identifiers, headings, or sentences and get every casing variant at once — no manual retyping.",
      "Consistent naming conventions matter across a codebase: JavaScript favors camelCase, Python favors snake_case, and CSS favors kebab-case. This tool converts between them instantly when moving code across languages or refactoring.",
    ],
    faqs: [
      {
        question: "Which case should I use for variable names?",
        answer:
          "Follow your language's convention: camelCase in JavaScript/TypeScript, snake_case in Python and Rust, kebab-case in CSS and URLs. Consistency within a project matters more than the choice itself.",
      },
      {
        question: "How does the converter split words?",
        answer:
          "It detects boundaries from existing separators (spaces, underscores, hyphens) and camelCase transitions, then rebuilds the words in your target casing.",
      },
      {
        question: "Can it convert whole sentences?",
        answer:
          "Yes. Beyond identifiers, it handles Title Case, sentence case, and UPPER CASE for headings and prose.",
      },
    ],
  },
  "color-converter": {
    details: [
      "The Color Converter translates between HEX, RGB, and HSL color formats with a visual swatch picker. Pick a color or paste a value and get every representation instantly — plus the CSS declaration ready to paste into your stylesheet.",
      "Different formats suit different tasks: HEX is compact for code, RGB maps to screens, and HSL is intuitive for adjusting lightness and saturation programmatically. Converting fluently between them speeds up design-to-code work.",
    ],
    faqs: [
      {
        question: "When should I use HSL over HEX?",
        answer:
          "HSL shines when you need variations of a color — hover states, gradients, or theme shades. Adjusting the lightness value is far more predictable than guessing HEX digits.",
      },
      {
        question: "Why do my colors look different across screens?",
        answer:
          "Displays vary in calibration and color gamut. For critical brand colors, test on multiple devices and consider specifying colors in a wider gamut format when supported.",
      },
      {
        question: "Does this support alpha transparency?",
        answer:
          "The converter focuses on the three core formats. For transparency, append an alpha channel to HEX (#RRGGBBAA) or use rgba()/hsla() in your CSS.",
      },
    ],
  },
  "html-entity-encoder": {
    details: [
      "The HTML Entity Encoder converts special characters into HTML entities — turning < into &lt; and & into &amp;. Essential when displaying code samples in web pages, writing email templates, or safely rendering user content.",
      "Unencoded angle brackets and ampersands can break page markup or, worse, enable cross-site scripting. Encoding user-supplied text before injecting it into HTML is a fundamental web security practice.",
    ],
    faqs: [
      {
        question: "Why do I need to encode HTML entities?",
        answer:
          "Characters like <, >, and & have special meaning in HTML. Encoding them tells the browser to display the literal character instead of interpreting it as markup — critical when showing code examples.",
      },
      {
        question: "Should I encode everything or just special characters?",
        answer:
          "Just the reserved ones: <, >, &, quotes in attributes, and non-ASCII characters if your charset is uncertain. Over-encoding makes source unreadable without benefit.",
      },
      {
        question: "Does this prevent XSS attacks?",
        answer:
          "Encoding output is a key defense, but proper XSS prevention also requires context-aware escaping (HTML, attribute, JavaScript, URL contexts differ) and Content Security Policy headers.",
      },
    ],
  },
  "prompt-template-generator": {
    details: [
      "The Prompt Template Generator helps you build structured, reusable prompts for large language models. Define role, task, context, constraints, and output format in separate fields, and get a composed prompt engineered for consistent results.",
      "Structured prompts outperform stream-of-consciousness ones: explicit roles set behavior, constraints prevent rambling, and specifying the output format makes responses parseable. Save the pattern and reuse it across similar tasks.",
    ],
    faqs: [
      {
        question: "Why structure a prompt instead of just asking?",
        answer:
          "Structure reduces ambiguity. A defined role, clear task, and explicit output format leave less to the model's interpretation, producing more reliable and consistent answers.",
      },
      {
        question: "What makes a good system prompt?",
        answer:
          "Specificity: state the role, the goal, the constraints, and the desired format. Avoid contradictions, keep it as short as the task allows, and test with real inputs before deploying.",
      },
      {
        question: "Can I reuse these templates?",
        answer:
          "That's the idea. Parameterize the variable parts (like the topic or data) and keep the scaffolding fixed — you get consistent quality across repeated tasks.",
      },
    ],
  },
  "batch-image-converter": {
    details: [
      "The Batch Image Converter converts multiple images between PNG, JPEG, and WebP in one go and bundles the results into a ZIP download. Drop a folder of assets and convert an entire set without processing files one by one.",
      "It's built for asset pipelines: converting a design export into web-ready formats, or normalizing a mixed folder of screenshots into a single format. Everything processes locally, so even large batches stay private.",
    ],
    faqs: [
      {
        question: "Which output format should I choose?",
        answer:
          "WebP for the web — it's 25–35% smaller than JPEG/PNG at equal quality. PNG when you need lossless quality or transparency; JPEG for maximum compatibility with older software.",
      },
      {
        question: "Is there a limit on how many images I can convert?",
        answer:
          "No hard limit, but everything runs in your browser's memory, so extremely large batches (hundreds of high-res images) may slow down. For huge jobs, process in smaller groups.",
      },
      {
        question: "Are my images uploaded anywhere?",
        answer:
          "No. Files are read, converted, and zipped entirely on your device — nothing is sent to any server.",
      },
    ],
  },
  "image-compressor": {
    details: [
      "The Image Compressor shrinks PNG and JPEG file sizes with an adjustable quality slider and live before/after comparison. Find the sweet spot where file size drops dramatically but visual quality stays intact.",
      "Images are usually the heaviest part of a web page. Compressing them is the single highest-impact performance optimization for most sites — smaller files mean faster loads, better Core Web Vitals, and lower bandwidth bills.",
    ],
    faqs: [
      {
        question: "How much can I compress before quality suffers?",
        answer:
          "For JPEG photos, quality 70–80 typically cuts 60–80% of file size with no visible difference. The live preview lets you compare directly — zoom into detailed areas to check for artifacts.",
      },
      {
        question: "Should I compress PNG or convert to WebP instead?",
        answer:
          "For photos, WebP or JPEG beats compressed PNG on size. For graphics with flat colors and sharp edges, PNG compression works well. Try both and compare the outputs.",
      },
      {
        question: "Does compression happen on my device?",
        answer:
          "Yes, entirely in your browser. Your originals never leave your machine, and you can re-run with different settings as often as you like.",
      },
    ],
  },
  "heic-converter": {
    details: [
      "The HEIC Converter turns Apple's HEIC/HEIF photos into widely-compatible JPEG or PNG files. iPhones save photos as HEIC by default for its efficiency, but many Windows apps, web tools, and older software can't open them — this bridges the gap.",
      "Conversion preserves the full resolution of your photos while producing files that work everywhere. All decoding happens locally in your browser, which matters because these are often personal photos.",
    ],
    faqs: [
      {
        question: "What is HEIC and why can't I open it?",
        answer:
          "HEIC (High Efficiency Image Container) is Apple's default photo format since iOS 11. It stores higher quality at half the size of JPEG, but support outside Apple devices and modern browsers is still patchy.",
      },
      {
        question: "Will I lose quality converting HEIC to JPEG?",
        answer:
          "JPEG recompression loses a small amount of quality versus the HEIC original. For sharing and everyday use the difference is imperceptible; keep the HEIC originals if you need archival quality.",
      },
      {
        question: "Are my photos uploaded to a server?",
        answer:
          "No. HEIC decoding and conversion run completely in your browser — your photos never leave your device.",
      },
    ],
  },
  "avif-converter": {
    details: [
      "The AVIF Converter converts images to the AV1 Image File Format — the most efficient modern image codec, delivering 30–50% smaller files than JPEG at the same visual quality. Upload any image and get a web-optimized AVIF in seconds.",
      "AVIF is now supported in all major browsers, making it the best choice for hero images and photo-heavy pages where every kilobyte counts toward load time and Core Web Vitals scores.",
    ],
    faqs: [
      {
        question: "Is AVIF better than WebP?",
        answer:
          "For photographic content, yes — AVIF typically achieves 20–30% smaller files than WebP at equivalent quality. WebP still encodes faster and has slightly wider tool support, so the choice depends on your pipeline.",
      },
      {
        question: "Which browsers support AVIF?",
        answer:
          "All modern browsers: Chrome, Firefox, Safari (16+), and Edge. For older browsers, serve a JPEG/PNG fallback using the <picture> element.",
      },
      {
        question: "Why is encoding slower than JPEG?",
        answer:
          "AVIF's superior compression comes from more complex algorithms that take longer to encode. The payoff is on every subsequent download — worth it for images served to many visitors.",
      },
    ],
  },
  "image-to-base64": {
    details: [
      "Image to Base64 encodes any image as a Base64 data URI you can paste directly into HTML, CSS, or JSON. Useful for small icons and assets where avoiding an extra HTTP request matters more than the ~33% size overhead of the encoding.",
      "Data URIs shine for tiny images: favicons, email templates (where external images get blocked), and single-file HTML exports. For larger images, linking the file is almost always better.",
    ],
    faqs: [
      {
        question: "When should I use a data URI instead of an image file?",
        answer:
          "For very small images (under a few KB) where the HTTP request overhead exceeds the encoding penalty — icons, spacers, email assets. Large images bloat your HTML and can't be cached separately.",
      },
      {
        question: "Why is the output larger than my image?",
        answer:
          "Base64 represents 3 bytes as 4 ASCII characters, inflating size by about 33%. That's the tradeoff for embedding binary data as plain text.",
      },
      {
        question: "Can I decode a data URI back to an image?",
        answer:
          "Yes — strip the data:image/...;base64, prefix and decode the remaining Base64. Most image tools and a short script can reverse the process.",
      },
    ],
  },
  "exif-remover": {
    details: [
      "The EXIF Remover strips metadata from your photos — GPS coordinates, camera model, timestamps, and thumbnails embedded by your device. Share images online without leaking where and when they were taken.",
      "Phone photos routinely contain precise location data. Posting an unstripped photo can reveal your home address or travel patterns to anyone who downloads it. Stripping takes seconds and the image itself is untouched.",
    ],
    faqs: [
      {
        question: "What is EXIF data?",
        answer:
          "Metadata your camera embeds in every photo: GPS location, date and time, device model, exposure settings, and sometimes a thumbnail. It's invisible in normal viewing but trivially readable with the right tools.",
      },
      {
        question: "Does removing EXIF affect image quality?",
        answer:
          "Not at all. EXIF lives in the file's header, separate from the pixel data. The image is re-saved pixel-identical, just without the metadata block.",
      },
      {
        question: "Are my photos uploaded anywhere?",
        answer:
          "No — stripping happens entirely in your browser. Given this tool exists specifically for privacy, uploading your photos to do it would defeat the purpose.",
      },
    ],
  },
  "svg-optimizer": {
    details: [
      "The SVG Optimizer minifies SVG files by removing editor cruft: comments, hidden layers, redundant attributes, default values, and excessive decimal precision. Exported SVGs from Figma or Illustrator often shrink 30–70% with zero visual change.",
      "Smaller SVGs mean faster pages, especially when icons are inlined in HTML. The optimizer shows before/after sizes so you can verify the savings, and you can tune precision to balance size against curve fidelity.",
    ],
    faqs: [
      {
        question: "Why are my exported SVGs so large?",
        answer:
          "Design tools embed editor metadata, unused definitions, verbose precision (8+ decimals), and default attributes. None of it affects rendering — the optimizer strips it all safely.",
      },
      {
        question: "Will optimization change how my SVG looks?",
        answer:
          "No, when done correctly. The optimizer only removes redundant data and rounds coordinates within a tolerance far below visible thresholds. Always visually verify critical artwork after optimizing.",
      },
      {
        question: "Should I still gzip SVGs after optimizing?",
        answer:
          "Yes — the two stack. Optimization removes redundant content; gzip compresses what remains. Together they typically cut SVG weight by 70–90% versus raw exports.",
      },
    ],
  },
  "sql-formatter": {
    details: [
      "The SQL Formatter takes messy, single-line queries and lays them out with consistent indentation and keyword casing, or compresses formatted SQL down to a single line for pasting into code. Dialects matter — PostgreSQL, MySQL, SQLite, and BigQuery each have quirks in placeholder syntax and function names, so pick your dialect before formatting.",
      "Formatting is not just cosmetic: a readable query is far easier to debug, review, and optimize. The minifier is handy when embedding SQL in application code or API payloads where whitespace is wasted bytes.",
    ],
    faqs: [
      {
        question: "Which SQL dialects are supported?",
        answer:
          "PostgreSQL, MySQL, SQLite, and BigQuery. The formatter uses dialect-aware parsing, so dialect-specific syntax like BigQuery's backtick identifiers or PostgreSQL's dollar-quoted strings is handled correctly.",
      },
      {
        question: "Is my SQL sent anywhere?",
        answer:
          "No. Formatting runs entirely in your browser. Queries often contain table names, schemas, and sometimes literal values — none of it leaves your device.",
      },
      {
        question: "What's the difference between Format and Minify?",
        answer:
          "Format expands the query across lines with indentation for readability. Minify collapses it to a single line with minimal whitespace, which is useful for embedding SQL in code or config files.",
      },
    ],
  },
  "curl-converter": {
    details: [
      "The cURL to Code Generator turns a curl command — the kind you copy from browser DevTools or API docs — into working code for JavaScript (fetch or axios), Python (requests), Go, or PHP. It parses the URL, method, headers, request body, and basic auth, then emits idiomatic code for your target language.",
      "If your command uses a flag the converter doesn't understand, it says so plainly instead of generating code that silently drops an option. That matters: a missing header or body field is a bug that looks like a working request.",
    ],
    faqs: [
      {
        question: "Which curl flags are supported?",
        answer:
          "URL, -X/--request, -H/--header, -d/--data (including --data-raw, --data-binary, and --json), -u/--user, --compressed, -L, and -A/--user-agent. Display-only flags like -s and -v are ignored. Anything else is reported as unsupported rather than guessed.",
      },
      {
        question: "Why did my conversion fail?",
        answer:
          "Usually an unsupported flag or a missing URL. The error message names the exact flag so you can simplify the command — for example, replacing an obscure auth flag with an explicit -H Authorization header.",
      },
      {
        question: "Is the generated code production-ready?",
        answer:
          "It's a correct starting point: method, URL, headers, and body are all carried over. Add your own error handling, timeouts, and retries around it before shipping.",
      },
    ],
  },
  "git-command-builder": {
    details: [
      "The Git Command Builder turns 'how do I…' Git questions into exact commands. Pick a scenario — undoing a commit, interactive rebasing, stashing, cherry-picking, amending, discarding file changes, or recovering a deleted branch — fill in the details, and get the command plus a plain-English explanation of what it does.",
      "Git's danger is that similar-looking commands have very different consequences: reset --soft keeps your changes, reset --hard destroys them. Every destructive command here carries an explicit warning, so you know the risk before you paste it into a terminal.",
    ],
    faqs: [
      {
        question: "What's the difference between reset --soft and --hard?",
        answer:
          "--soft moves the branch pointer back but keeps your changes staged. --hard moves it back and discards the changes from your working tree entirely. Use --hard only when you're sure you don't need those changes.",
      },
      {
        question: "Can I recover a commit I undid with --hard?",
        answer:
          "Often, yes — Git keeps a reflog of where HEAD has been. Run git reflog, find the commit hash, and reset or branch back to it. Recovery gets harder after garbage collection, so act quickly.",
      },
      {
        question: "Is it safe to rebase commits I've already pushed?",
        answer:
          "No — rebasing rewrites history, so teammates' copies diverge and pushes get messy. Rebase only local, unpushed commits; for shared history, prefer git revert, which adds a new commit that undoes the change.",
      },
    ],
  },
  "hash-generator": {
    details: [
      "The HMAC & Hash Generator computes SHA-256, SHA-512, and MD5 digests — or HMAC-SHA-256/512 keyed hashes — entirely in your browser. SHA-256 and SHA-512 run on the WebCrypto API; MD5 uses a small pure-JavaScript implementation because WebCrypto deliberately does not offer MD5.",
      "Hashes are the backbone of integrity checks, API signatures, and password storage. HMAC adds a secret key, so the same input produces a different digest for each key — that's what makes webhook signatures and API authentication work.",
    ],
    faqs: [
      {
        question: "Why is there no MD5 in WebCrypto?",
        answer:
          "MD5 is cryptographically broken for security purposes, so the WebCrypto standard omits it. This tool includes a local MD5 implementation anyway because it's still the standard for legacy checksums and file-integrity comparisons.",
      },
      {
        question: "When should I use HMAC instead of a plain hash?",
        answer:
          "When you need to prove who produced the hash, not just what the data is. A plain hash verifies integrity; an HMAC with a shared secret verifies authenticity, which is why APIs sign requests with HMAC.",
      },
      {
        question: "Are my inputs sent to a server?",
        answer:
          "No. Hashing happens locally — SHA via WebCrypto, MD5 via local code. Your text and keys never leave the browser.",
      },
    ],
  },
  "bcrypt-tester": {
    details: [
      "The Bcrypt Hash Tester hashes passwords with bcrypt or Argon2id and verifies passwords against existing hashes — all client-side. Bcrypt runs on bcryptjs; Argon2id runs on WebAssembly in your browser. Nothing is transmitted, which matters because these are real credentials and real hashes.",
      "Never store plain-text passwords: a hash is a one-way fingerprint. Bcrypt and Argon2 are deliberately slow, so even if a database leaks, brute-forcing each password takes far too long to be practical. Argon2id is the current OWASP recommendation; bcrypt remains the most widely deployed.",
    ],
    faqs: [
      {
        question: "What's the difference between bcrypt and Argon2id?",
        answer:
          "Both are slow, salted password hashes designed to resist brute force. Argon2id (winner of the Password Hashing Competition) is memory-hard, resisting GPU cracking better than bcrypt. Bcrypt is older, simpler, and supported almost everywhere.",
      },
      {
        question: "What does the cost factor do?",
        answer:
          "It controls how slow hashing is: each +1 doubles the work. Cost 10 takes a fraction of a second; cost 12 takes about four times longer. Higher cost means stronger protection but slower logins — 10–12 is the usual range.",
      },
      {
        question: "Why does verifying take a moment?",
        answer:
          "That's the point. Password hashing is intentionally expensive — milliseconds of delay per login are invisible to users but make bulk cracking infeasible for attackers.",
      },
    ],
  },
  "tailwind-css-converter": {
    details: [
      "The Tailwind ↔ CSS Converter translates between plain CSS declarations and Tailwind utility classes in both directions. Paste display, spacing, typography, color, and radius declarations and get the matching utilities — or paste utilities and get the CSS they compile to.",
      "Coverage is deliberately scoped to common properties: layout, spacing scale, font sizes and weights, colors (including arbitrary hex values), and border radius. Anything outside that scope is listed as unconverted rather than silently dropped, so you can finish the conversion by hand with confidence about what's done.",
    ],
    faqs: [
      {
        question: "Why isn't my whole stylesheet converted?",
        answer:
          "This converter covers common properties — layout, spacing, typography, color, and radius — not arbitrary CSS. Complex values (gradients, animations, custom properties) are listed as unconverted so nothing is silently lost.",
      },
      {
        question: "How are pixel values mapped to the spacing scale?",
        answer:
          "Tailwind's spacing scale is 4px per unit, so 16px becomes 4 and 8px becomes 2. Values off the scale are emitted as arbitrary values like mt-[13px], which Tailwind supports natively.",
      },
      {
        question: "Does the Tailwind-to-CSS output match what Tailwind compiles?",
        answer:
          "For the covered utilities, yes — the values come from Tailwind's default theme. Your project's custom theme (custom colors, spacing) won't be reflected, so treat the output as a starting point.",
      },
    ],
  },
  "svg-to-component": {
    details: [
      "The SVG to React Component tool turns raw SVG markup into a typed TypeScript React component or a Vue single-file component. It rewrites SVG attributes to their JSX equivalents — class becomes className, stroke-width becomes strokeWidth — and optionally strips width and height so the icon sizes through props.",
      "Inlining SVGs as components beats <img> tags for icons: they inherit currentColor, accept props, tree-shake with the rest of your code, and never trigger an extra HTTP request. Paste an export from Figma or Illustrator and get a component you can drop straight into a codebase.",
    ],
    faqs: [
      {
        question: "Why do attribute names change?",
        answer:
          "JSX doesn't allow hyphenated attribute names, so SVG's stroke-width must become strokeWidth and class must become className. The converter applies the standard mapping automatically, including xlink attributes.",
      },
      {
        question: "Should I strip width and height?",
        answer:
          "Usually yes. With them stripped, the component accepts width, height, and className from its parent, so one icon works at any size. Keep them only when the SVG must render at a fixed size.",
      },
      {
        question: "Does it work with SVGs from Figma or Illustrator?",
        answer:
          "Yes — paste the exported markup directly. Editor metadata and comments are stripped. For the smallest output, run the markup through the SVG Optimizer first.",
      },
    ],
  },
  "gradient-generator": {
    details: [
      "The CSS Gradient Generator builds multi-stop linear and radial gradients with a live preview and copy-ready CSS. Add color stops, drag their positions, set the angle or radial position, and watch the result update in real time.",
      "The mesh-style mode layers several soft radial gradients over a dark base to mimic the colorful blob look popular in modern landing pages. Honest note: true mesh gradients are not pure CSS — this is the closest CSS-only equivalent, and it's labeled as such in the tool.",
    ],
    faqs: [
      {
        question: "What's the difference between linear and radial gradients?",
        answer:
          "Linear gradients blend colors along a straight line at an angle; radial gradients blend outward from a point, usually the center. Radial works well for glows and vignettes; linear for backgrounds and dividers.",
      },
      {
        question: "Are mesh gradients real CSS?",
        answer:
          "Not literally — true mesh gradients need SVG filters or canvas. The mesh-style mode here approximates the look with layered radial gradients, which is pure CSS and works everywhere.",
      },
      {
        question: "How do I use the generated CSS?",
        answer:
          "Copy the background declaration into any element's stylesheet. It works in all modern browsers with no prefixes needed.",
      },
    ],
  },
  "json-to-typescript": {
    details: [
      "The JSON to TypeScript tool turns a JSON sample — or a full JSON Schema — into clean TypeScript interfaces or type aliases. Nested objects become named interfaces, arrays of objects merge their keys (keys missing from some items become optional), and mixed values become unions.",
      "Writing types by hand from API responses is slow and error-prone; generating them from a real payload guarantees the types match what the API actually returns. Paste a response, copy the types, and your editor starts catching shape mismatches immediately.",
    ],
    faqs: [
      {
        question: "Does it accept JSON Schema as well as JSON samples?",
        answer:
          "Yes. If the input looks like a schema (properties, type, or $schema), it's converted using its required list — required fields stay required, everything else becomes optional.",
      },
      {
        question: "Why are some fields marked optional?",
        answer:
          "For arrays of objects, a key present in only some items becomes optional (?), because real data may omit it. For single objects, every key is required, matching the sample exactly.",
      },
      {
        question: "What about null values?",
        answer:
          "A null in the sample produces a null type in a union (for example string | null), so the type honestly reflects that the field can be absent or null in practice.",
      },
    ],
  },
  "favicon-generator": {
    details: [
      "The Favicon Generator turns any image into a complete favicon package: multi-size PNGs, the classic ICO file, and Apple touch icons. Upload your logo once and download everything modern browsers and devices expect.",
      "Browsers request favicons in several sizes and formats — a single 16×16 file leaves tabs, bookmarks, and mobile home screens with blurry or missing icons. This generates the full set, sized and formatted correctly.",
    ],
    faqs: [
      {
        question: "Which favicon files do I actually need?",
        answer:
          "At minimum: favicon.ico (legacy browsers), a 180×180 apple-touch-icon (iOS), and 192×192 + 512×512 PNGs (Android/modern browsers). This tool generates all of them plus the HTML snippet to include.",
      },
      {
        question: "Why does my favicon not show up after uploading?",
        answer:
          "Browsers aggressively cache favicons. Hard-refresh (Ctrl+Shift+R), clear cache, or add a version query string like favicon.ico?v=2 to force a re-fetch.",
      },
      {
        question: "What makes a good favicon design?",
        answer:
          "Simplicity at tiny sizes: bold shapes, high contrast, no fine text. Test your design at 16×16 — if it's unrecognizable, simplify it before generating.",
      },
    ],
  },
};
