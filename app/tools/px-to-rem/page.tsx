import type { Metadata } from "next";
import { PxToRem } from "@/components/px-to-rem";
import { ToolShell } from "@/components/tool-shell";

export const metadata: Metadata = {
  title: "PX to REM Converter",
  description:
    "Convert CSS pixel values to rem units with a customizable root font size, entirely in your browser.",
  keywords: ["PX to REM", "CSS converter", "REM converter", "CSS units"],
};

export default function PxToRemPage() {
  return (
    <ToolShell title="PX to REM Converter" description="Convert pixel values to rem units with a customizable root font size." category="CSS">
      <PxToRem />
    </ToolShell>
  );
}
