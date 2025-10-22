import { OnchainSuiteHome } from "@/shared/website/page";
import { BlockchainBackground } from "@/ui/blockchain-background";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <BlockchainBackground>
        <OnchainSuiteHome />
      </BlockchainBackground>
    </main>
  );
}
