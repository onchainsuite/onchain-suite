"use client";

import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  progress?: number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  isRadial?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  progress,
  icon,
  trend,
  isRadial,
}: MetricCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDiveIn = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <Card className="relative overflow-hidden  bg-card/80 backdrop-blur-sm shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-300">
      <CardContent className="p-4 flex flex-col h-full min-h-[200px] space-y-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                {icon}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {title}
              </span>
            </div>
            {change && trend && (
              <div
                className={`flex items-center gap-1 text-xs ${trend === "up" ? "text-green-400" : "text-red-400"}`}
              >
                {trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {change}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-bold text-foreground">{value}</div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {progress !== undefined && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Progress: {progress}%
              </p>
            </div>
          )}

          {isRadial && (
            <div className="flex items-center justify-center">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - Number.parseInt(value, 10) / 100)}`}
                    className="text-primary transition-all duration-500"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleDiveIn}
          disabled={isLoading}
          size="sm"
          className="w-full bg-transparent mt-auto"
          variant="outline"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Dive In"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
