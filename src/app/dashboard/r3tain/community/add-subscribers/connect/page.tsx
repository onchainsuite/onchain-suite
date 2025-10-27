"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  AdditionalIntegrations,
  ConnectionStatus,
  ServicesGrid,
} from "@/r3tain/community/components/import/external-services";
import { PageHeader } from "@/r3tain/community/components/shared";
import { useImportNavigation } from "@/r3tain/community/hooks";
import { EXTERNAL_SERVICES } from "@/r3tain/community/types";

// Simplified breadcrumb for external services flow
const externalServicesBreadcrumb = [
  { label: "Choose Method", isActive: false, isCompleted: true },
  { label: "Connect", isActive: true, isCompleted: false },
  { label: "Confirmation", isActive: false, isCompleted: false },
];

export default function ConnectPage() {
  const { navigateToStep } = useImportNavigation();
  const [services, setServices] = useState(EXTERNAL_SERVICES);
  const [connectedServices, setConnectedServices] = useState<string[]>([]);
  const [lastConnected, setLastConnected] = useState<string>("");

  const handleServiceConnect = (serviceId: string) => {
    // Simulate connection process
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? { ...service, isConnected: !service.isConnected }
          : service
      )
    );

    const service = services.find((s) => s.id === serviceId);
    if (service && !service.isConnected) {
      setConnectedServices((prev) => [...prev, serviceId]);
      setLastConnected(service.name);
    } else {
      setConnectedServices((prev) => prev.filter((id) => id !== serviceId));
    }

    console.log(
      `${service?.isConnected ? "Disconnecting from" : "Connecting to"} ${service?.name}`
    );
  };

  const handleFindMore = () => {
    console.log("Opening integrations directory");
    // In real app, this would open a modal or navigate to integrations page
  };

  const handleDone = () => {
    // Navigate directly to confirmation since no data processing is needed
    navigateToStep("confirmation");
  };

  // Custom breadcrumb for external services
  const customBreadcrumb = externalServicesBreadcrumb;

  return (
    <div className="bg-background min-h-screen">
      {/* Custom header for external services flow */}
      <div className="bg-card/95 border-border sticky top-0 z-50 border-b p-4 backdrop-blur-sm lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <CheckCircle className="text-primary-foreground h-4 w-4" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Import Contacts</h1>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  {customBreadcrumb.map((step, index) => (
                    <div key={step.label} className="flex items-center gap-2">
                      <span
                        className={
                          step.isActive
                            ? "text-primary font-medium"
                            : step.isCompleted
                              ? "text-foreground"
                              : "text-muted-foreground"
                        }
                      >
                        {step.label}
                      </span>
                      {index < customBreadcrumb.length - 1 && <span>•</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            Exit
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
        <div className="space-y-8">
          <PageHeader
            title="Import existing or future contacts, automatically."
            subtitle="See something familiar? Connect it to your R3tain account to keep all your contacts in sync."
          />

          <ConnectionStatus
            connectedServices={connectedServices}
            lastConnected={lastConnected}
          />

          <ServicesGrid
            services={services}
            onServiceConnect={handleServiceConnect}
          />

          <AdditionalIntegrations onFindMore={handleFindMore} />

          {/* Done Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="flex justify-center pt-6"
          >
            <Button
              size="lg"
              onClick={handleDone}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Done
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
