"use client";

import { useState } from "react";
import { v7 } from "uuid";

import { Button } from "@/ui/button";
import { CustomModal } from "@/ui/custom-modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

import { metricOptions } from "./metric-options";

interface CustomizeMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMetrics: string[];
  onSave: (metrics: string[]) => void;
}

export function CustomizeMetricsModal({
  isOpen,
  onClose,
  currentMetrics,
  onSave,
}: CustomizeMetricsModalProps) {
  const [selectedMetrics, setSelectedMetrics] =
    useState<string[]>(currentMetrics);

  const handleMetricChange = (index: number, value: string) => {
    const newMetrics = [...selectedMetrics];
    newMetrics[index] = value;
    setSelectedMetrics(newMetrics);
  };

  const handleSave = () => {
    onSave(selectedMetrics);
    onClose();
  };

  const handleCancel = () => {
    setSelectedMetrics(currentMetrics);
    onClose();
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button
        onClick={handleSave}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Save
      </Button>
    </div>
  );

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize your metrics"
      footer={footer}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {selectedMetrics.map((metricValue, index) => {
          return (
            <div key={v7()} className="space-y-4">
              <Select
                value={metricValue}
                onValueChange={(value) => handleMetricChange(index, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>ENGAGEMENT</SelectLabel>
                    {metricOptions
                      .filter((option) => option.group === "engagement")
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>DELIVERY</SelectLabel>
                    {metricOptions
                      .filter((option) => option.group === "delivery")
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Metric Display */}
              <div className="border-border bg-card rounded-lg border p-4">
                <div className="text-foreground mb-1 text-3xl font-bold">
                  {metricValue.includes("rate") ? "0%" : "0"}
                </div>
                <div className="text-muted-foreground text-sm">--</div>
              </div>
            </div>
          );
        })}
      </div>
    </CustomModal>
  );
}
