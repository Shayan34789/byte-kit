import type { Metadata } from "next";
import { JsonFormatter } from "@/components/json-formatter";
import { ToolShell } from "@/components/tool-shell";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator",
  description:
    "Format, validate, beautify, and minify JSON locally in your browser with instant results.",
  keywords: ["JSON formatter", "JSON validator", "JSON beautifier", "JSON minifier"],
};

export default function JsonFormatterPage() {
  return (
    <ToolShell title="JSON Formatter & Validator" description="Clean up, validate, beautify, or minify JSON without uploading it anywhere." category="Formatter">
      <JsonFormatter />
    </ToolShell>
  );
}
