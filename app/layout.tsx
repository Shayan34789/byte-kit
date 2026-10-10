import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CookieBanner } from "@/components/cookie-banner";
import { BackToTop } from "@/components/back-to-top";
import { ScrollProgress } from "@/components/scroll-progress";
import { siteUrl, StructuredData } from "@/lib/structured-data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Byte-Kit — Free Private Developer Tools",
    template: "%s · Byte-Kit",
  },
  description:
    "Free online developer tools for JSON formatting, CSS conversion, JWT decoding, Base64 encoding, regex testing, image conversion, and text utilities. Fast, private, and processed locally.",
  applicationName: "Byte-Kit",
  metadataBase: new URL(siteUrl),
  keywords: [
    "developer tools",
    "JSON formatter",
    "JSON validator",
    "PX to REM converter",
    "JWT decoder",
    "Base64 encoder",
    "URL encoder",
    "regex tester",
    "password generator",
    "color converter",
    "image converter",
    "CSS tools",
    "developer utilities",
    "online developer utilities",
    "privacy-first tools",
  ],
  authors: [{ name: "Byte-Kit" }],
  creator: "Byte-Kit",
  publisher: "Byte-Kit",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "Byte-Kit",
    title: "Byte-Kit — Free Private Developer Tools",
    description:
      "Free online tools for JSON, CSS, JWT, Base64, regex, color, image, and text workflows. Private browser-based processing.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Byte-Kit — Free Private Developer Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Byte-Kit — Free Private Developer Tools",
    description:
      "Free browser-based developer tools for formatting, encoding, decoding, conversion, and generation with no uploads.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-[100dvh] bg-canvas text-ink antialiased`}>
        <ScrollProgress />
        {children}
        <CookieBanner />
        <BackToTop />
      </body>
    </html>
  );
}
