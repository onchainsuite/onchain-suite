import type React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border border-border bg-background/50 p-6 transition-colors hover:bg-accent/50">
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
        <h4 className="font-semibold text-foreground">{title}</h4>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
