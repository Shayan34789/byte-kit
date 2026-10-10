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
    title: "JWT Decoder",
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
    title: "HTML Entity Encoder",
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
];

export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug);
