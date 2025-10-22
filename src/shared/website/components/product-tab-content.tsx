import { ArrowRight } from "lucide-react";
import type React from "react";
import { v7 as uuidv7 } from "uuid";

import { Button } from "@/components/ui/button";

import { FeatureCard } from "./feature-card";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ProductTabContentProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: Feature[];
}

export function ProductTabContent({
  icon,
  title,
  description,
  features,
}: ProductTabContentProps) {
  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl border border-border bg-card p-8 md:p-12">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">{icon}</div>
          <h3 className="text-2xl font-bold text-foreground md:text-3xl">
            {title}
          </h3>
        </div>
        <p className="mb-6 text-lg text-muted-foreground">{description}</p>
        <Button className="group">
          Book a Demo
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <FeatureCard
            key={uuidv7()}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
}
