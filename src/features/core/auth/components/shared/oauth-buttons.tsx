"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
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
];

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
      {oauthProviders.map((provider, index) => (
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
                <Loader2 className="mr-3 h-5 w-5 animate-spin text-gray-500" />
                Signing in...
              </>
            ) : (
              <>
                <provider.icon
                  className={`mr-3 h-5 w-5 ${provider.color} transition-transform group-hover:scale-110`}
                />
                Continue with {provider.name}
              </>
            )}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
