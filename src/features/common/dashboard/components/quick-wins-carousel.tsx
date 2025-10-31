"use client";

import { BarChart3, ChevronLeft, ChevronRight, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { v7 } from "uuid";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const slides = [
  {
    id: 1,
    title: "3ridge: Test Onboarding",
    description: "Connect a wallet and see the magic happen",
    icon: <Lock className="h-8 w-8" />,
    action: "Connect Wallet",
  },
  {
    id: 2,
    title: "R3tain: Send Sample",
    description: "Launch your first email drip campaign",
    icon: <Mail className="h-8 w-8" />,
    action: "Launch Drip",
  },
  {
    id: 3,
    title: "Onch3n: Simulate Cohort",
    description: "Run AI-powered behavioral analysis",
    icon: <BarChart3 className="h-8 w-8" />,
    action: "Run AI Tip",
  },
];

export function QuickWinsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <Card className="relative h-64 overflow-hidden  bg-card/80 backdrop-blur-sm shadow-xl">
      <CardContent className="p-6 h-full flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-2 z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="flex-1 text-center space-y-4 px-12">
          <div className="flex justify-center text-primary">
            {slides[currentSlide].icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {slides[currentSlide].title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {slides[currentSlide].description}
            </p>
          </div>
          <Button className="mt-4">{slides[currentSlide].action}</Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-2 z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={v7()}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
