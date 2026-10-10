import type { Metadata } from "next";
import { PxToRem } from "@/components/px-to-rem";
import { ToolShell } from "@/components/tool-shell";
import { getTool } from "@/lib/tools.config";
import { siteUrl } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "PX to REM Converter",
  description:
    "Convert CSS pixel values to rem units with a customizable root font size, entirely in your browser.",
  keywords: ["PX to REM", "CSS converter", "REM converter", "CSS units"],
  alternates: {
    canonical: `${siteUrl}/tools/px-to-rem`,
  },
  openGraph: {
    title: "PX to REM Converter · Byte-Kit",
    description:
      "Convert CSS pixel values to rem units with a customizable root font size, entirely in your browser.",
    url: `${siteUrl}/tools/px-to-rem`,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PX to REM Converter",
      },
    ],
  },
};

export default function PxToRemPage() {
  return (
    <ToolShell title="PX to REM Converter" description="Convert pixel values to rem units with a customizable root font size." category="CSS" usage={getTool("px-to-rem")?.usage}>
      <PxToRem />
    </ToolShell>
  );
}
