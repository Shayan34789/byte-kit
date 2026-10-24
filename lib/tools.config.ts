export type ToolCategory =
  | "Color"
  | "Encoding"
  | "Formatter"
  | "Converter"
  | "Text"
  | "CSS"
  | "Security"
  | "Debugging"
  | "Generator"
  | "AI"
  | "Image";

export type ToolDefinition = {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  iconName: string;
  implemented?: boolean;
  usage?: string[];
};

export const categories = [
  "All",
  "Formatter",
  "CSS",
  "Converter",
  "Encoding",
  "Security",
  "Generator",
  "AI",
  "Text",
  "Color",
  "Image",
  "Debugging",
] as const;

export const tools: ToolDefinition[] = [
  {
    slug: "json-formatter",
    title: "JSON Formatter & Validator",
    description: "Format, validate, beautify, and minify JSON online in your browser.",
    category: "Formatter",
    iconName: "BracketsCurly",
    implemented: true,
    usage: [
      "Paste your JSON into the left input panel.",
      "The tool validates it instantly — a green badge means valid, red means malformed.",
      "Click Beautify for readable 2-space formatting, or Minify for compact output.",
      "Use the copy button to grab the result.",
    ],
  },
  {
    slug: "px-to-rem",
    title: "PX to REM Converter",
    description: "Convert CSS pixels to rem units with a customizable root font size.",
    category: "CSS",
    iconName: "TextT",
    implemented: true,
    usage: [
      "Enter a pixel value in the Source Pixels field.",
      "Adjust the root base size if your project doesn't use the 16px default.",
      "Read the converted rem value in the result panel.",
      "Copy it straight into your CSS.",
    ],
  },
  {
    slug: "json-yaml-csv",
    title: "JSON / YAML / CSV",
    description: "Convert JSON data to YAML or CSV format directly in your browser.",
    category: "Converter",
    iconName: "FileJs",
    implemented: true,
    usage: [
      "Paste a JSON array or object into the input panel.",
      "Choose Emit YAML or Emit CSV.",
      "Copy the converted output — note CSV needs an array of objects.",
    ],
  },
  {
    slug: "glassmorphism-generator",
    title: "Glassmorphism Generator",
    description: "Generate customizable glassmorphism CSS with live visual preview.",
    category: "CSS",
    iconName: "Drop",
    implemented: true,
    usage: [
      "Drag the Blur Radius and Alpha Opacity sliders.",
      "Pick a surface tint with the color picker.",
      "Preview the frosted-glass effect live on the sample surface.",
      "Copy the generated CSS ruleset.",
    ],
  },
  {
    slug: "box-shadow-generator",
    title: "Box Shadow Generator",
    description: "Generate and customize CSS box shadows with live preview and copy-ready code.",
    category: "CSS",
    iconName: "StackSimple",
    implemented: true,
    usage: [
      "Drag the Blur Radius and Alpha Opacity sliders.",
      "Preview the shadow live on the sample surface.",
      "Copy the generated box-shadow CSS into your stylesheet.",
    ],
  },
  {
    slug: "llm-token-counter",
    title: "LLM Token Counter",
    description: "Estimate LLM token counts for prompts and text with a local browser tool.",
    category: "AI",
    iconName: "BracketsAngle",
    implemented: true,
    usage: [
      "Paste your prompt or text into the input area.",
      "Read the estimated token count, character count, word count, and byte size.",
      "The token estimate uses a ~3.8 characters-per-token ratio.",
    ],
  },
  {
    slug: "invisible-character-cleaner",
    title: "Invisible Character Cleaner",
    description: "Detect and remove zero-width and hidden Unicode characters from text.",
    category: "AI",
    iconName: "MagnifyingGlass",
    implemented: true,
    usage: [
      "Paste text that may contain hidden or zero-width characters.",
      "Invisible characters are stripped automatically as you type.",
      "The badge shows how many characters were removed.",
      "Copy the cleaned output.",
    ],
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder Online",
    description: "Decode JWT headers and payloads locally without sending tokens to a server.",
    category: "Security",
    iconName: "Key",
    implemented: true,
    usage: [
      "Paste a JWT — three Base64 segments separated by dots.",
      "The header and payload claims decode instantly in the panels below.",
      "Everything stays in your browser; tokens are never sent anywhere.",
    ],
  },
  {
    slug: "password-uuid-generator",
    title: "Password & UUID Generator",
    description: "Generate secure passwords and UUID v4 identifiers with browser cryptography.",
    category: "Generator",
    iconName: "LockSimple",
    implemented: true,
    usage: [
      "Set the password length you want (8–128 characters).",
      "Click Sample Entropy Key to generate a cryptographically random password.",
      "Click Generate UUID for a random UUID v4.",
      "Use the copy buttons to grab either value.",
    ],
  },
  {
    slug: "image-svg-converter",
    title: "Image & SVG Converter",
    description: "Convert PNG, JPG, WebP, and SVG images locally using browser Canvas APIs.",
    category: "Image",
    iconName: "Image",
    implemented: true,
    usage: [
      "Drop a PNG, JPG, WebP, or SVG file onto the upload area — or click Browse files.",
      "Pick a target format: PNG, JPEG, or WebP.",
      "Adjust the quality slider for JPEG or WebP output.",
      "Click Convert, preview the result, then download it.",
    ],
  },
  {
    slug: "url-base64",
    title: "URL & Base64 Encoder",
    description: "Encode and decode URL strings and Base64 text locally in your browser.",
    category: "Encoding",
    iconName: "Link",
    implemented: true,
    usage: [
      "Paste your raw text into the input panel.",
      "Switch between URL percent-encoding and Base64.",
      "Copy the encoded output.",
    ],
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description: "Test regular expressions with live matches, flags, and instant feedback.",
    category: "Debugging",
    iconName: "Terminal",
    implemented: true,
    usage: [
      "Type your regular expression and flags (e.g. gi).",
      "Paste the text you want to test into the corpus box.",
      "Matches are listed instantly with a live match count.",
    ],
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    description: "Convert text between sentence case, title case, lowercase, and uppercase styles.",
    category: "Text",
    iconName: "TextAa",
    implemented: true,
    usage: [
      "Type or paste text in any casing.",
      "All five casings — camelCase, kebab-case, snake_case, SCREAMING, and PascalCase — generate instantly.",
      "Copy the transformed output.",
    ],
  },
  {
    slug: "color-converter",
    title: "Color Converter",
    description: "Convert HEX colors to RGB and generate copy-ready CSS color values.",
    category: "Color",
    iconName: "Palette",
    implemented: true,
    usage: [
      "Pick a color with the swatch picker.",
      "Read the HEX, RGB, and HSL values in the output panel.",
      "Copy them straight into your CSS.",
    ],
  },
  {
    slug: "html-entity-encoder",
    title: "HTML Entity Encode Online",
    description: "Encode special characters as HTML entities for safer markup and text handling.",
    category: "Encoding",
    iconName: "Code",
    implemented: true,
    usage: [
      "Paste HTML or text containing special characters.",
      "Characters like <, >, &, and quotes are escaped automatically.",
      "Copy the safe escaped markup.",
    ],
  },
  {
    slug: "prompt-template-generator",
    title: "Prompt Template Generator",
    description: "Create reusable structured prompts for AI and LLM workflows.",
    category: "AI",
    iconName: "Sparkle",
    implemented: true,
    usage: [
      "Enter an agent role, the task, and your constraints.",
      "The structured prompt assembles live in the preview below.",
      "Copy it into your AI workflow.",
    ],
  },
  {
    slug: "batch-image-converter",
    title: "Batch Image Converter",
    description: "Convert many images at once to PNG, JPG, or WebP and download them as a ZIP.",
    category: "Image",
    iconName: "Images",
    implemented: true,
    usage: [
      "Drop multiple images onto the upload area.",
      "Pick a target format and quality.",
      "Click Convert to process every file.",
      "Download all converted images as a single ZIP.",
    ],
  },
  {
    slug: "image-compressor",
    title: "Image Compressor",
    description: "Shrink image file sizes with quality and resize controls, right in your browser.",
    category: "Image",
    iconName: "FileImage",
    implemented: true,
    usage: [
      "Drop an image onto the upload area.",
      "Choose an output format, quality, and max dimension.",
      "Click Compress and compare before/after file sizes.",
      "Download the compressed image.",
    ],
  },
  {
    slug: "heic-converter",
    title: "HEIC Converter",
    description: "Convert iPhone HEIC/HEIF photos to JPG, PNG, or WebP locally.",
    category: "Image",
    iconName: "FileImage",
    implemented: true,
    usage: [
      "Drop a .heic or .heif photo onto the upload area.",
      "Pick a target format and quality.",
      "Click Convert — decoding can take a few seconds for large photos.",
      "Download the converted image.",
    ],
  },
  {
    slug: "avif-converter",
    title: "AVIF Converter",
    description: "Convert images to and from the modern AVIF format in your browser.",
    category: "Image",
    iconName: "Image",
    implemented: true,
    usage: [
      "Drop a PNG, JPG, WebP, or AVIF image onto the upload area.",
      "Pick AVIF or a classic format as the target.",
      "Adjust quality, then click Convert.",
      "Download the result.",
    ],
  },
  {
    slug: "image-to-base64",
    title: "Image to Base64",
    description: "Encode any image as a Base64 data URI for embedding in CSS or HTML.",
    category: "Encoding",
    iconName: "Code",
    implemented: true,
    usage: [
      "Drop an image onto the upload area.",
      "The Base64 data URI is generated instantly.",
      "Copy the full string or download it as a .txt file.",
    ],
  },
  {
    slug: "exif-remover",
    title: "EXIF Remover",
    description: "Strip hidden location and device metadata from photos before sharing.",
    category: "Security",
    iconName: "ShieldCheck",
    implemented: true,
    usage: [
      "Drop a photo onto the upload area.",
      "Choose JPG or PNG output.",
      "Click Strip metadata to re-encode the image without EXIF data.",
      "Download the clean image.",
    ],
  },
  {
    slug: "svg-optimizer",
    title: "SVG Optimizer",
    description: "Minify SVG markup by removing comments, whitespace, and editor cruft.",
    category: "Image",
    iconName: "Code",
    implemented: true,
    usage: [
      "Paste SVG markup or load an .svg file.",
      "Click Optimize to minify it.",
      "See exactly how many bytes were saved.",
      "Copy or download the optimized SVG.",
    ],
  },
  {
    slug: "favicon-generator",
    title: "Favicon Generator",
    description: "Turn one image into a multi-size favicon.ico plus PNG icons.",
    category: "Generator",
    iconName: "Star",
    implemented: true,
    usage: [
      "Drop a square logo or image onto the upload area.",
      "Click Generate favicon.",
      "Preview the 16, 32, and 48px icons.",
      "Download favicon.ico or the individual PNGs.",
    ],
  },
  {
    slug: "sql-formatter",
    title: "SQL Formatter & Minifier",
    description: "Format and minify SQL queries for PostgreSQL, MySQL, SQLite, and BigQuery.",
    category: "Formatter",
    iconName: "Database",
    implemented: true,
    usage: [
      "Paste your SQL into the input panel.",
      "Pick a dialect: PostgreSQL, MySQL, SQLite, or BigQuery.",
      "Switch between Format for readable output and Minify for compact output.",
      "Copy the result into your editor or query tool.",
    ],
  },
  {
    slug: "curl-converter",
    title: "cURL to Code Generator",
    description: "Convert curl commands into JavaScript, Python, Go, or PHP code instantly.",
    category: "Converter",
    iconName: "Terminal",
    implemented: true,
    usage: [
      "Paste a curl command copied from DevTools or a terminal.",
      "Pick a target language: fetch, axios, Python requests, Go, or PHP.",
      "The generated code appears instantly — unsupported flags are reported, not guessed.",
      "Copy the code into your project.",
    ],
  },
  {
    slug: "git-command-builder",
    title: "Git Command Builder",
    description: "Build exact Git commands for undoing, rebasing, stashing, and cherry-picking.",
    category: "Debugging",
    iconName: "GitBranch",
    implemented: true,
    usage: [
      "Pick the scenario you need: undo a commit, rebase, stash, cherry-pick, and more.",
      "Fill in the options, like how many commits back or which file.",
      "Read the plain-English explanation and any destructive-command warning.",
      "Copy the exact command and run it in your terminal.",
    ],
  },
  {
    slug: "hash-generator",
    title: "HMAC & Hash Generator",
    description: "Generate SHA-256, SHA-512, MD5, and HMAC hashes locally with WebCrypto.",
    category: "Security",
    iconName: "Hash",
    implemented: true,
    usage: [
      "Type or paste the text you want to hash.",
      "Switch to HMAC mode and enter a secret key for keyed hashes.",
      "Choose hex or base64 output.",
      "Copy the hash — everything is computed in your browser.",
    ],
  },
  {
    slug: "bcrypt-tester",
    title: "Bcrypt Hash Tester",
    description: "Hash passwords and verify them against bcrypt or Argon2id hashes, client-side.",
    category: "Security",
    iconName: "ShieldCheck",
    implemented: true,
    usage: [
      "Choose Bcrypt or Argon2id mode.",
      "Enter a password and click Generate hash to create a hash.",
      "To verify, paste a password and its hash, then click Verify.",
      "A match or no-match result appears instantly — nothing leaves your browser.",
    ],
  },
  {
    slug: "tailwind-css-converter",
    title: "Tailwind ↔ CSS Converter",
    description: "Convert common CSS declarations to Tailwind classes and back again.",
    category: "CSS",
    iconName: "ArrowsLeftRight",
    implemented: true,
    usage: [
      "Pick a direction: CSS to Tailwind or Tailwind to CSS.",
      "Paste your declarations or utility classes.",
      "The conversion appears instantly; anything outside the common-property coverage is listed, not dropped silently.",
      "Copy the result.",
    ],
  },
  {
    slug: "svg-to-component",
    title: "SVG to React Component",
    description: "Turn SVG markup into a typed TypeScript React component or Vue SFC.",
    category: "Converter",
    iconName: "Code",
    implemented: true,
    usage: [
      "Paste SVG markup or load an .svg file.",
      "Pick React (TSX) or Vue SFC output and set a component name.",
      "Toggle stripping width and height so the component sizes via props.",
      "Copy the generated component into your project.",
    ],
  },
  {
    slug: "gradient-generator",
    title: "CSS Gradient Generator",
    description: "Design multi-stop linear, radial, and mesh-style gradients with live preview.",
    category: "CSS",
    iconName: "Palette",
    implemented: true,
    usage: [
      "Pick linear, radial, or mesh-style mode.",
      "Add color stops and drag their positions.",
      "Tune the angle (linear) or position (radial) and watch the live preview.",
      "Copy the pure CSS output.",
    ],
  },
  {
    slug: "json-to-typescript",
    title: "JSON to TypeScript",
    description: "Generate clean TypeScript interfaces from JSON data or JSON Schema.",
    category: "Converter",
    iconName: "BracketsCurly",
    implemented: true,
    usage: [
      "Paste a JSON object, array, or JSON Schema.",
      "Choose interface or type-alias output style.",
      "Nested objects become named interfaces; keys missing from some array items become optional.",
      "Copy the generated types into your project.",
    ],
  },
];

export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug);

// Curated internal links: 3 related tools per page, chosen by workflow
// adjacency (e.g. JWT Decoder <-> Base64), not just same-category. Every
// tool page gets exactly 3 related links, including tools that are alone
// in their category and would otherwise show none.
export const relatedToolsMap: Record<string, string[]> = {
  "json-formatter": ["json-yaml-csv", "regex-tester", "url-base64"],
  "px-to-rem": ["glassmorphism-generator", "box-shadow-generator", "color-converter"],
  "json-yaml-csv": ["json-formatter", "case-converter", "url-base64"],
  "glassmorphism-generator": ["box-shadow-generator", "px-to-rem", "color-converter"],
  "box-shadow-generator": ["glassmorphism-generator", "px-to-rem", "color-converter"],
  "llm-token-counter": ["prompt-template-generator", "invisible-character-cleaner", "case-converter"],
  "invisible-character-cleaner": ["llm-token-counter", "case-converter", "regex-tester"],
  "jwt-decoder": ["url-base64", "password-uuid-generator", "json-formatter"],
  "password-uuid-generator": ["jwt-decoder", "exif-remover", "invisible-character-cleaner"],
  "image-svg-converter": ["batch-image-converter", "image-compressor", "avif-converter"],
  "url-base64": ["jwt-decoder", "html-entity-encoder", "image-to-base64"],
  "regex-tester": ["json-formatter", "case-converter", "invisible-character-cleaner"],
  "case-converter": ["regex-tester", "json-formatter", "invisible-character-cleaner"],
  "color-converter": ["glassmorphism-generator", "box-shadow-generator", "px-to-rem"],
  "html-entity-encoder": ["url-base64", "image-to-base64", "regex-tester"],
  "prompt-template-generator": ["llm-token-counter", "invisible-character-cleaner", "case-converter"],
  "batch-image-converter": ["image-svg-converter", "image-compressor", "heic-converter"],
  "image-compressor": ["batch-image-converter", "image-svg-converter", "avif-converter"],
  "heic-converter": ["batch-image-converter", "image-compressor", "avif-converter"],
  "avif-converter": ["image-svg-converter", "image-compressor", "heic-converter"],
  "image-to-base64": ["url-base64", "html-entity-encoder", "svg-optimizer"],
  "exif-remover": ["image-compressor", "heic-converter", "password-uuid-generator"],
  "svg-optimizer": ["image-svg-converter", "favicon-generator", "image-to-base64"],
  "favicon-generator": ["svg-optimizer", "image-svg-converter", "image-compressor"],
  "sql-formatter": ["json-formatter", "json-yaml-csv", "regex-tester"],
  "curl-converter": ["json-formatter", "url-base64", "jwt-decoder"],
  "git-command-builder": ["regex-tester", "case-converter", "invisible-character-cleaner"],
  "hash-generator": ["jwt-decoder", "password-uuid-generator", "url-base64"],
  "bcrypt-tester": ["password-uuid-generator", "hash-generator", "jwt-decoder"],
  "tailwind-css-converter": ["glassmorphism-generator", "box-shadow-generator", "px-to-rem"],
  "svg-to-component": ["svg-optimizer", "image-svg-converter", "favicon-generator"],
  "gradient-generator": ["glassmorphism-generator", "box-shadow-generator", "color-converter"],
  "json-to-typescript": ["json-formatter", "json-yaml-csv", "curl-converter"],
};

export const getRelatedTools = (slug: string): ToolDefinition[] =>
  (relatedToolsMap[slug] ?? [])
    .map((relatedSlug) => getTool(relatedSlug))
    .filter((tool): tool is ToolDefinition => tool !== undefined)
    .slice(0, 3);
