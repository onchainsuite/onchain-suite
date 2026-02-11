import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import React from "react";

import { fadeInUp, staggerContainer } from "../../utils";
import { Label } from "@/shared/components/ui/label";

interface BrandingProps {
  openLogoUpload: (type: "primary" | "dark" | "favicon") => void;
}

const Branding = ({ openLogoUpload }: BrandingProps) => {
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
      </motion.div>
    </motion.section>
  );
};

export default Branding;
