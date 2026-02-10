import type { Metadata } from "next";

import { KEYWORDS, SITE_CONFIG_META } from "./site";

export function generateMetadata(): Metadata {
  return {
    title: `${SITE_CONFIG_META.name} - Web3 Marketing & Retention Platform`,
    description: SITE_CONFIG_META.description,
    keywords: KEYWORDS,
    authors: [{ name: SITE_CONFIG_META.name }],
    creator: SITE_CONFIG_META.name,
    publisher: SITE_CONFIG_META.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_CONFIG_META.url),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${SITE_CONFIG_META.name} - Web3 Marketing & Retention Platform`,
      description:
        "Transform Web3 user engagement with integrated behavioral analytics, email marketing, and authentication. Built for DeFi, Gaming, and NFT brands.",
      url: SITE_CONFIG_META.url,
      siteName: SITE_CONFIG_META.name,
      images: [
        {
          url: SITE_CONFIG_META.ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG_META.name} - Web3 Marketing Platform`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_CONFIG_META.name} - Web3 Marketing & Retention Platform`,
      description:
        "The first integrated communication layer built natively for Web3. Drive retention with on-chain behavioral analytics.",
      images: [SITE_CONFIG_META.twitterImage],
      creator: SITE_CONFIG_META.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
    },
  };
}
