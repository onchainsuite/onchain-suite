import {
  CTASection,
  DeveloperSection,
  Footer,
  HeroSection,
  OnchainNavbar,
  ProductShowcase,
  ProductsSection,
} from "@/onchain-suite-website/components";

export function OnchainSuiteHome() {
  return (
    <main className="relative min-h-screen">
      <OnchainNavbar />
      <HeroSection />
      <ProductShowcase />
      <ProductsSection />
      <DeveloperSection />
      <CTASection />
      <Footer />
    </main>
  );
}
