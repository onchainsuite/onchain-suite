"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { ExternalService } from "@/r3tain/community/types";

interface ServiceCardProps {
  service: ExternalService;
  onConnect: (serviceId: string) => void;
  delay?: number;
}

export function ServiceCard({
  service,
  onConnect,
  delay = 0,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <Card className="border-border hover:border-primary/20 h-full transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-0">
          {/* Service Logo/Header */}
          <div
            className={`${service.backgroundColor} ${service.textColor} relative overflow-hidden p-8 text-center`}
          >
            <div className="relative z-10">
              <Image
                src={service.logoUrl || "/placeholder.svg"}
                alt={`${service.name} logo`}
                width={100}
                height={100}
                className="mx-auto mb-2 h-12 w-auto opacity-90 brightness-0 invert filter"
              />
              <h3 className="text-xl font-bold">{service.name}</h3>
            </div>

            {/* Connected Badge */}
            {service.isConnected && (
              <div className="absolute top-3 right-3">
                <Badge
                  variant="secondary"
                  className="border-white/30 bg-white/20 text-white"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              </div>
            )}
          </div>

          {/* Service Details */}
          <div className="p-6">
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              {service.description}
            </p>

            <Button
              onClick={() => onConnect(service.id)}
              variant={service.isConnected ? "outline" : "default"}
              className={`w-full transition-all duration-200 ${
                service.isConnected
                  ? "border-border hover:bg-muted bg-transparent"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
            >
              {service.isConnected ? "Manage" : "Add"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
