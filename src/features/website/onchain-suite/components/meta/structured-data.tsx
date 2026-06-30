import { FAQS } from "../landing/content";
import { SITE_CONFIG } from "@/features/website/onchain-suite/config";

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
          url: SITE_CONFIG.logo,
        },
        description:
          "The communication infrastructure layer for Web3 — retention automation that turns on-chain behavior into multi-channel messaging. A Datum Labs product.",
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
        description:
          "Web3 retention automation and the communication infrastructure layer for blockchain protocols.",
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
          price: "299",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "299",
            priceCurrency: "USD",
            unitText: "MONTH",
          },
        },
        description:
          "Retention automation for Web3: detect on-chain behavior, resolve wallet identity with zero-knowledge privacy, segment audiences, and re-engage across in-app push, email, Telegram, and Discord.",
        featureList: [
          "Wallet-first identity resolution",
          "Multi-channel activation (in-app push, email, Telegram, Discord)",
          "Protocol Plays automation library",
          "Sub-10-minute first-mile onboarding",
          "Protocol Normalization System across chains",
          "On-chain behavioral analytics and segmentation",
          "Privacy-by-design zero-knowledge identity bridge",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_CONFIG.url}/#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
