import CTASection from "../components/cta-section";
import Footer from "../components/footer";
import HeroSection from "../components/hero-section";
import OnchainNavbar from "../components/navbar";
import ProductShowcase from "../components/product-showcase";
import ProductsSection from "../components/products-section";

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
