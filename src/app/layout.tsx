import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import "@/styles/globals.css";
import { StructuredData } from "@/onchain-suite-website/components";
import { generateMetadata } from "@/onchain-suite-website/config";
import { RootProviders } from "@/shared/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
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
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
