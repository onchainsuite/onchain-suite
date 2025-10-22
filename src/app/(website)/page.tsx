import { BlockchainBackground } from "@/ui/blockchain-background";

import { OnchainSuiteHome } from "@/onchain-suite-website/page";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <BlockchainBackground>
        <OnchainSuiteHome />
      </BlockchainBackground>
    </main>
  );
}
