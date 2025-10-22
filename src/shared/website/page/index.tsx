import {
  CTASection,
  Footer,
  HeroSection,
  OnchainNavbar,
  ProductShowcase,
  ProductsSection,
} from "../components";

export function OnchainSuiteHome() {
  return (
    <main className="relative min-h-screen">
      <OnchainNavbar />
      <HeroSection />
      <ProductShowcase />
      <ProductsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
