import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AIBuilderCard() {
  return (
    <Card className="border-2 border-primary/20 bg-linear-to-br from-card via-card to-primary/5 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-white/5 mask-[radial-gradient(white,transparent_85%)]" />
      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <CardTitle className="text-2xl">Build with 3ridge AI</CardTitle>
        </div>
        <CardDescription>
          Describe what you want to build — webhooks, proofs, or auth flows
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="e.g., Create a webhook that triggers when a user connects their wallet..."
              className="h-12 bg-background/50 backdrop-blur-sm border-primary/30 focus:border-primary glow-border pr-24"
            />
            <Button className="absolute right-1 top-1 h-10 bg-primary hover:bg-primary/90 glow-pulse">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          3ridge AI will auto-generate your configuration
        </p>
      </CardContent>
    </Card>
  );
}
