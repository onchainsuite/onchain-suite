import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import React from "react";

import { Label } from "@/components/ui/label";

import { fadeInUp, staggerContainer } from "../../utils";

interface BrandingProps {
  openLogoUpload: (type: "primary" | "dark" | "favicon") => void;
  openColorPicker: (type: "primary" | "secondary") => void;
}

const Branding = ({ openLogoUpload, openColorPicker }: BrandingProps) => {
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
                    ? "border-muted-foreground bg-foreground"
                    : "border-border/80 bg-card"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors lg:h-14 lg:w-14 ${
                    type === "dark"
                      ? "bg-background/10"
                      : "bg-muted/80 group-hover:bg-primary/10"
                  }`}
                >
                  <Upload
                    className={`h-5 w-5 transition-colors lg:h-6 lg:w-6 ${
                      type === "dark"
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                </div>
                <p
                  className={`mt-4 font-medium ${type === "dark" ? "text-primary-foreground" : "text-foreground"}`}
                >
                  {type === "primary"
                    ? "Primary logo"
                    : type === "dark"
                      ? "Dark mode logo"
                      : "Favicon"}
                </p>
                <p
                  className={`mt-1 text-xs ${type === "dark" ? "text-primary-foreground/60" : "text-muted-foreground"}`}
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
                    className={`h-12 w-12 rounded-xl shadow-sm ${
                      type === "primary" ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {type === "primary" ? "Primary color" : "Secondary color"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {type === "primary" ? "Default" : "Default"}
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
