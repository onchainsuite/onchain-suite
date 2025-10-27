"use client";

import { Quote, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { v7 } from "uuid";

import { Card, CardContent } from "@/components/ui/card";

export function TestimonialSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("testimonial-section");
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="testimonial-section"
      className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div
            className={`flex flex-col justify-center transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-8 opacity-0"
            }`}
          >
            <div className="mb-6">
              <Image
                src="/placeholder.svg?height=40&width=120&text=Wonder"
                alt="Wonder"
                width={120}
                height={40}
                className="h-10 brightness-0 invert"
              />
              <p className="mt-2 text-sm text-purple-100">From our customers</p>
            </div>

            <Quote className="mb-6 h-8 w-8 text-purple-200" />

            <blockquote className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              &quot;One of the biggest victories for us is based on one of the
              flows. We had attendance of our special events increase by{" "}
              <span className="text-yellow-300">32%</span>.&quot;
            </blockquote>

            <div className="mt-8">
              <p className="text-purple-100">
                <span className="font-semibold text-white">Michael Paul</span>,
                Head of Customer Experience at Wonder
              </p>
              <div className="mt-2 flex items-center gap-1">
                {[...Array(5)].map((_) => (
                  <Star
                    key={v7()}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          <div
            className={`flex items-center justify-center transition-all delay-300 duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
          >
            <Card className="overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <Image
                  src="/placeholder.svg?height=400&width=500&text=Happy+Customer"
                  alt="Michael Paul from Wonder"
                  width={500}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
