import { SITE_CONFIG } from "@/shared/config";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_CONFIG.url}/#organization`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_CONFIG.url}/logo.png`,
        },
        description:
          "The first integrated communication layer built natively for Web3 product ecosystems.",
        sameAs: [
          "https://twitter.com/onchainsuite",
          "https://discord.gg/onchainsuite",
          "https://t.me/onchainsuite",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: SITE_CONFIG.name,
        description: "Web3 Marketing & Retention Platform",
        publisher: {
          "@id": `${SITE_CONFIG.url}/#organization`,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_CONFIG.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "Advanced growth marketing suite for Web3-native product ecosystems with behavioral analytics, email marketing, and Web3 authentication.",
        featureList: [
          "On-chain behavioral analytics",
          "Web3-native email marketing",
          "Blockchain authentication",
          "Multi-chain support",
          "AI-driven insights",
          "Real-time user segmentation",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
