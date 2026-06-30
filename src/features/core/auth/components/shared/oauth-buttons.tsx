"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";

interface OAuthButtonsProps {
  onOAuthSignIn: (provider: string) => Promise<void>;
  isLoading: boolean;
  delay?: number;
}

const oauthProviders = [
  {
    name: "Google",
    icon: FcGoogle,
    color: "text-red-500",
    bg: "hover:bg-red-50 dark:hover:bg-red-950/20",
  },
] satisfies Array<{
  name: string;
  icon: IconType;
  color: string;
  bg: string;
}>;

export function OAuthButtons({
  onOAuthSignIn,
  isLoading,
  delay = 0.2,
}: OAuthButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="space-y-3"
    >
      {oauthProviders.map((provider, index) => {
        const ProviderIcon = provider.icon;

        return (
          <motion.div
            key={provider.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: delay + 0.1 + index * 0.1 }}
          >
            <Button
              variant="outline"
              className={`h-12 w-full ${provider.bg} group transition-all duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => onOAuthSignIn(provider.name)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon
                    aria-hidden="true"
                    className="text-muted-foreground mr-3 h-5 w-5 animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  <ProviderIcon
                    className={`mr-3 h-5 w-5 ${provider.color} transition-transform group-hover:scale-110`}
                  />
                  Continue with {provider.name}
                </>
              )}
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
