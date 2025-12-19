"use client";

import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { v7 as uuidv7 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FeatureCard } from "./feature-card";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ProductTabContentProps {
  icon: string | React.ReactNode;
  title: string;
  description: string;
  features: Feature[];
  productSlug?: string;
}

export function ProductTabContent({
  icon,
  title,
  description,
  features,
  productSlug,
}: ProductTabContentProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submitWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          source: `product_tab_${productSlug ?? "unknown"}`,
        }),
      });

      if (!res.ok) throw new Error("Failed to join waitlist");

      setSuccess("You're on the list! We'll be in touch soon.");
      setEmail("");
      setName("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full relative rounded-2xl border border-border bg-card p-8 md:p-12">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            {typeof icon === "string" ? (
              <Image
                src={icon}
                alt={`${title} icon`}
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
            ) : (
              icon
            )}
          </div>
          <h3 className="text-2xl font-bold text-foreground md:text-3xl">
            {title}
          </h3>
        </div>
        <p className="mb-6 text-lg text-muted-foreground">{description}</p>
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

      <div className="mt-10 rounded-2xl border border-border bg-muted/10 p-6">
        <h4 className="mb-2 text-lg font-semibold">Join the waitlist</h4>
        <p className="mb-4 text-sm text-muted-foreground">
          Be the first to know when {title} is available.
        </p>
        <form onSubmit={submitWaitlist} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? "Submitting..." : "Join waitlist"}
            </Button>
          </div>
        </form>
        {success && <p className="mt-3 text-sm text-green-600">{success}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
