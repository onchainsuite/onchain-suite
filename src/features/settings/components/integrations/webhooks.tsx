
import React from "react";
import { motion } from "framer-motion";
import { Webhook, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { webhooks } from "../../utils";

const Webhooks = () => {
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.1)",
      }}
      className="group rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 lg:p-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 lg:h-12 lg:w-12">
          <Webhook className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Webhooks</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Receive real-time updates for events
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Add Endpoint
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {webhooks.map((webhook, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/50 p-4"
              >
                <div className="space-y-1">
                  <div className="font-mono text-sm font-medium text-foreground">
                    {webhook.url}
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="rounded-full bg-card px-2 py-0.5 shadow-sm"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    Active
                  </span>
                  <Switch checked={webhook.status === "active"} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Webhooks;
