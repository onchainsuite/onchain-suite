import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import { RootProviders } from "@/shared/providers";
import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onchain Suite",
  description: "Onchain Suite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
