import { motion } from "framer-motion";
import { Upload, Loader2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";

import { fadeInUp, staggerContainer } from "../../utils";

interface BrandingProps {
  openLogoUpload: (type: "primary" | "dark" | "favicon") => void;
}

const Branding = ({ openLogoUpload }: BrandingProps) => {
  const [colors, setColors] = useState({
    primary: "#010F31",
    secondary: "#F0F7FF",
  });
  const [loading, setLoading] = useState(false);
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    try {
      const res = await fetch("/api/v1/organization/branding");
      if (res.ok) {
        const data = await res.json();
        if (data.colors) {
          setColors({
            primary: data.colors.primary || "#010F31",
            secondary: data.colors.secondary || "#F0F7FF",
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch branding", error);
    }
  };

  const handleColorChange = async (
    type: "primary" | "secondary",
    value: string
  ) => {
    const newColors = { ...colors, [type]: value };
    setColors(newColors);

    // Debounce or save immediately? Saving immediately for simplicity but might be chatty.
    // Ideally use a save button or debounce.
    // For now, let's update state and save.

    try {
      const res = await fetch("/api/v1/organization/branding/colors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newColors),
      });

      if (!res.ok) {
        toast.error("Failed to update brand colors");
      } else {
        toast.success("Brand colors updated");
      }
    } catch (error) {
      toast.error("Failed to update brand colors");
    }
  };

  const openColorPicker = (type: "primary" | "secondary") => {
    if (type === "primary") {
      primaryInputRef.current?.click();
    } else {
      secondaryInputRef.current?.click();
    }
  };
  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h2
        variants={fadeInUp}
        className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
      >
        Branding
      </motion.h2>
      <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
        Customize your brand appearance across all touchpoints
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 space-y-10 lg:mt-10 lg:pt-10 lg:space-y-12"
      >
        <div>
          <Label className="text-sm font-medium text-foreground">
            Brand logos
          </Label>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload your logos for light and dark backgrounds
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:gap-6">
            {(["primary", "dark", "favicon"] as const).map((type) => (
              <motion.button
                key={type}
                onClick={() => openLogoUpload(type)}
                whileHover={{
                  y: -4,
                  boxShadow: "0 25px 50px -12px rgba(var(--primary-rgb), 0.1)",
                }}
                className={`group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 hover:border-primary ${
                  type === "dark"
                    ? "border-muted-foreground bg-[#0B1121]"
                    : "border-border/80 bg-card"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors lg:h-14 lg:w-14 ${
                    type === "dark"
                      ? "bg-(--brand-alice-blue)/10"
                      : "bg-(--brand-alice-blue) group-hover:brightness-95"
                  }`}
                >
                  <Upload
                    className={`h-5 w-5 transition-colors lg:h-6 lg:w-6 ${
                      type === "dark"
                        ? "text-(--brand-alice-blue)"
                        : "text-(--brand-oxford-blue) dark:text-(--brand-alice-blue)"
                    }`}
                  />
                </div>
                <p
                  className={`mt-4 font-medium ${type === "dark" ? "text-(--brand-alice-blue)" : "text-(--brand-oxford-blue) dark:text-(--brand-alice-blue)"}`}
                >
                  {type === "primary"
                    ? "Primary logo"
                    : type === "dark"
                      ? "Dark mode logo"
                      : "Favicon"}
                </p>
                <p
                  className={`mt-1 text-xs ${type === "dark" ? "text-(--brand-alice-blue)/70" : "text-(--brand-oxford-blue)/70 dark:text-(--brand-alice-blue)/70"}`}
                >
                  {type === "favicon"
                    ? "ICO, PNG • 32×32px"
                    : "SVG, PNG • 400×100px"}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground">
            Brand colors
          </Label>
          <p className="mt-1 text-sm text-muted-foreground">
            Define your primary and accent colors
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:gap-8">
            <input
              type="color"
              ref={primaryInputRef}
              className="invisible absolute h-0 w-0 opacity-0"
              value={colors.primary}
              onChange={(e) => handleColorChange("primary", e.target.value)}
            />
            <input
              type="color"
              ref={secondaryInputRef}
              className="invisible absolute h-0 w-0 opacity-0"
              value={colors.secondary}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
            />
            {(["primary", "secondary"] as const).map((type) => (
              <motion.button
                key={type}
                onClick={() => openColorPicker(type)}
                whileHover={{
                  y: -4,
                  boxShadow: `0 25px 50px -12px ${type === "primary" ? "rgba(var(--primary-rgb), 0.15)" : "rgba(var(--secondary-rgb), 0.15)"}`,
                }}
                className="group space-y-4 text-left rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 lg:p-6"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-xl shadow-sm`}
                    style={{
                      backgroundColor:
                        type === "primary" ? colors.primary : colors.secondary,
                    }}
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {type === "primary" ? "Primary color" : "Secondary color"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {type === "primary" ? colors.primary : colors.secondary}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Branding;
