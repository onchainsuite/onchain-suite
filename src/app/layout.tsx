import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import {
  Instrument_Sans,
  Inter,
  JetBrains_Mono,
  Outfit,
} from "next/font/google";

import "@/styles/globals.css";
import { StructuredData } from "@/onchain-suite-website/components";
import { generateMetadata } from "@/onchain-suite-website/config";
import { RootProviders } from "@/shared/providers";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

// Marketing landing — terminal design system (Inter / Outfit / JetBrains Mono)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body
        className={`${instrumentSans.variable} ${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <RootProviders>{children}</RootProviders>
        <Analytics />
      </body>
    </html>
  );
}
