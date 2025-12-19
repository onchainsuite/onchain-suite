import { motion } from "framer-motion";
import { Check, Copy, Eye, EyeOff, Key } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";

const ApiKey = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const copyApiKey = () => {
    navigator.clipboard.writeText("osk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6");
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

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
          <Key className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">API Key</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Use this secret key to authenticate API requests
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="flex-1 rounded-xl border border-border/80 bg-muted px-4 py-3 font-mono text-sm text-foreground lg:px-5">
              {showApiKey
                ? "osk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
                : "osk_live_••••••••••••••••••••••••••••••••"}
            </code>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
                className="h-11 w-11 border-border/80"
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={copyApiKey}
                className="h-11 w-11 border-border/80 bg-transparent"
              >
                {apiKeyCopied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApiKey;
