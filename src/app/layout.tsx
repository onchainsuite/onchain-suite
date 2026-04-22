import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";

import "@/styles/globals.css";
import { StructuredData } from "@/onchain-suite-website/components";
import { generateMetadata } from "@/onchain-suite-website/config";
import { RootProviders } from "@/shared/providers";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
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
      <body
        className={`${instrumentSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <RootProviders>{children}</RootProviders>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
