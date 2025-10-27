"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Sparkles, Users } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { Community } from "@/r3tain/community/types";

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommunityCreated: (community: Community) => void;
  existingCommunities: Community[];
}

interface CommunityFormData {
  name: string;
  description: string;
  isDefault: boolean;
}

interface ValidationErrors {
  name?: string;
  description?: string;
}

export function CreateCommunityModal({
  isOpen,
  onClose,
  onCommunityCreated,
  existingCommunities,
}: CreateCommunityModalProps) {
  const [formData, setFormData] = useState<CommunityFormData>({
    name: "",
    description: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Community name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Community name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Community name must be less than 50 characters";
    } else if (
      existingCommunities.some(
        (c) => c.name.toLowerCase() === formData.name.trim().toLowerCase()
      )
    ) {
      newErrors.name = "A community with this name already exists";
    }

    // Description validation
    if (formData.description.trim().length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CommunityFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newCommunity: Community = {
        id: `community-${Date.now()}`,
        name: formData.name.trim(),
        subscriberCount: 0,
        createdAt: new Date().toISOString(),
        isDefault: formData.isDefault,
      };

      setStep("success");

      // Auto-close and callback after success animation
      setTimeout(() => {
        onCommunityCreated(newCommunity);
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to create community:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", isDefault: false });
    setErrors({});
    setStep("form");
    setIsLoading(false);
    onClose();
  };

  const getSuggestedNames = () => {
    const suggestions = [
      "Newsletter Subscribers",
      "Beta Testers",
      "VIP Members",
      "Product Updates",
      "Community Hub",
    ];
    return suggestions.filter(
      (suggestion) =>
        !existingCommunities.some(
          (c) => c.name.toLowerCase() === suggestion.toLowerCase()
        )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Users className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">
                      Create New Community
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                      Set up a new community to organize your subscribers
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Community Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="community-name"
                    className="text-sm font-medium"
                  >
                    Community Name *
                  </Label>
                  <Input
                    id="community-name"
                    placeholder="Enter community name..."
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`transition-colors duration-200 ${
                      errors.name
                        ? "border-destructive focus:border-destructive"
                        : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive flex items-center gap-2 text-sm"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </motion.div>
                  )}

                  {/* Suggested Names */}
                  {!formData.name && getSuggestedNames().length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <p className="text-muted-foreground text-xs">
                        Suggestions:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {getSuggestedNames()
                          .slice(0, 3)
                          .map((suggestion) => (
                            <Badge
                              key={suggestion}
                              variant="outline"
                              className="hover:bg-primary/10 hover:border-primary/30 cursor-pointer transition-colors duration-200"
                              onClick={() =>
                                handleInputChange("name", suggestion)
                              }
                            >
                              {suggestion}
                            </Badge>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="community-description"
                    className="text-sm font-medium"
                  >
                    Description{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Textarea
                    id="community-description"
                    placeholder="Describe your community..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className={`min-h-[80px] resize-none transition-colors duration-200 ${
                      errors.description
                        ? "border-destructive focus:border-destructive"
                        : ""
                    }`}
                    disabled={isLoading}
                  />
                  <div className="flex items-center justify-between">
                    {errors.description ? (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-destructive flex items-center gap-2 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errors.description}
                      </motion.div>
                    ) : (
                      <div />
                    )}
                    <span className="text-muted-foreground text-xs">
                      {formData.description.length}/200
                    </span>
                  </div>
                </div>

                {/* Default Community Option */}
                {!existingCommunities.some((c) => c.isDefault) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-muted/30 border-border rounded-lg border p-4"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="is-default"
                        checked={formData.isDefault}
                        onChange={(e) =>
                          handleInputChange("isDefault", e.target.checked)
                        }
                        className="text-primary bg-background border-border focus:ring-primary mt-1 h-4 w-4 rounded focus:ring-2"
                        disabled={isLoading}
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor="is-default"
                          className="cursor-pointer text-sm font-medium"
                        >
                          Set as default community
                        </Label>
                        <p className="text-muted-foreground text-xs">
                          New subscribers will be added to this community by
                          default
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.name.trim()}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2" />
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Create Community
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20"
              >
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <h3 className="text-foreground text-lg font-semibold">
                  Community Created!
                </h3>
                <p className="text-muted-foreground text-sm">
                  <strong>{formData.name}</strong> has been successfully created
                  and is ready to use.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <div className="bg-primary mx-auto h-1 w-8 animate-pulse rounded-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
