import { OnchainSuiteHome } from "@/shared/website/page";
import { BlockchainBackground } from "@/ui/blockchain-background";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <BlockchainBackground>
        {/* <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          <h1 className="text-6xl font-bold text-center mb-4 bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Blockchain Network
          </h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl">
            Watch the data flow through the decentralized network
          </p>
        </div> */}

        <OnchainSuiteHome />
      </BlockchainBackground>
    </main>
  );
}
