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
  },
  {
    slug: "px-to-rem",
    title: "PX to REM Converter",
    description: "Convert CSS pixels to rem units with a customizable root font size.",
    category: "CSS",
    iconName: "TextT",
    implemented: true,
  },
  {
    slug: "json-yaml-csv",
    title: "JSON / YAML / CSV",
    description: "Convert JSON data to YAML or CSV format directly in your browser.",
    category: "Converter",
    iconName: "FileJs",
    implemented: true,
  },
  {
    slug: "glassmorphism-generator",
    title: "Glassmorphism Generator",
    description: "Generate customizable glassmorphism CSS with live visual preview.",
    category: "CSS",
    iconName: "Drop",
    implemented: true,
  },
  {
    slug: "box-shadow-generator",
    title: "Box Shadow Generator",
    description: "Generate and customize CSS box shadows with live preview and copy-ready code.",
    category: "CSS",
    iconName: "StackSimple",
    implemented: true,
  },
  {
    slug: "llm-token-counter",
    title: "LLM Token Counter",
    description: "Estimate LLM token counts for prompts and text with a local browser tool.",
    category: "AI",
    iconName: "BracketsAngle",
    implemented: true,
  },
  {
    slug: "invisible-character-cleaner",
    title: "Invisible Character Cleaner",
    description: "Detect and remove zero-width and hidden Unicode characters from text.",
    category: "AI",
    iconName: "MagnifyingGlass",
    implemented: true,
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode JWT headers and payloads locally without sending tokens to a server.",
    category: "Security",
    iconName: "Key",
    implemented: true,
  },
  {
    slug: "password-uuid-generator",
    title: "Password & UUID Generator",
    description: "Generate secure passwords and UUID v4 identifiers with browser cryptography.",
    category: "Generator",
    iconName: "LockSimple",
    implemented: true,
  },
  {
    slug: "image-svg-converter",
    title: "Image & SVG Converter",
    description: "Convert PNG, JPG, WebP, and SVG images locally using browser Canvas APIs.",
    category: "Image",
    iconName: "Image",
    implemented: true,
  },
  {
    slug: "url-base64",
    title: "URL & Base64 Encoder",
    description: "Encode and decode URL strings and Base64 text locally in your browser.",
    category: "Encoding",
    iconName: "Link",
    implemented: true,
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description: "Test regular expressions with live matches, flags, and instant feedback.",
    category: "Debugging",
    iconName: "Terminal",
    implemented: true,
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    description: "Convert text between sentence case, title case, lowercase, and uppercase styles.",
    category: "Text",
    iconName: "TextAa",
    implemented: true,
  },
  {
    slug: "color-converter",
    title: "Color Converter",
    description: "Convert HEX colors to RGB and generate copy-ready CSS color values.",
    category: "Color",
    iconName: "Palette",
    implemented: true,
  },
  {
    slug: "html-entity-encoder",
    title: "HTML Entity Encoder",
    description: "Encode special characters as HTML entities for safer markup and text handling.",
    category: "Encoding",
    iconName: "Code",
    implemented: true,
  },
  {
    slug: "prompt-template-generator",
    title: "Prompt Template Generator",
    description: "Create reusable structured prompts for AI and LLM workflows.",
    category: "AI",
    iconName: "Sparkle",
    implemented: true,
  },
];

export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug);
