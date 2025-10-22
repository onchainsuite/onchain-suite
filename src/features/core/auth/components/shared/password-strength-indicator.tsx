"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({
  password,
  className = "",
}: PasswordStrengthIndicatorProps) {
  const { strength, requirements } = useMemo(() => {
    const reqs = [
      { text: "At least 8 characters", met: password.length >= 8 },
      { text: "One uppercase letter", met: /[A-Z]/.test(password) },
      { text: "One lowercase letter", met: /[a-z]/.test(password) },
      { text: "One number", met: /[0-9]/.test(password) },
      { text: "One special character", met: /[^A-Za-z0-9]/.test(password) },
    ];

    const strength = reqs.filter((req) => req.met).length;

    return { strength, requirements: reqs };
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Medium";
    return "Strong";
  };

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className={`space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Password strength:</span>
        <span
          className={`font-medium ${
            strength <= 2
              ? "text-red-500"
              : strength <= 3
                ? "text-yellow-500"
                : "text-green-500"
          }`}
        >
          {getStrengthText()}
        </span>
      </div>
      <div className="bg-muted h-2 w-full rounded-full">
        <motion.div
          className={`h-2 rounded-full ${getStrengthColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 5) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-sm font-medium">
          Password requirements:
        </p>
        <div className="grid grid-cols-1 gap-1">
          {requirements.map((req, index) => (
            <motion.div
              key={uuidV4()}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center text-xs ${
                req.met
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              }`}
            >
              <CheckCircle
                className={`mr-2 h-3 w-3 ${
                  req.met
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground/50"
                }`}
              />
              {req.text}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
