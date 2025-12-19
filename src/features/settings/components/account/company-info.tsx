import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { fadeInUp, staggerContainer } from "../../utils";

interface CompanyInfoProps {
  saving: boolean;
  handleSave: (callback?: () => void) => void;
}

const CompanyInfo = ({ saving, handleSave }: CompanyInfoProps) => {
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
        Company information
      </motion.h2>
      <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
        Your organization details
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 lg:mt-10 lg:pt-10"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Company name
            </Label>
            <Input
              defaultValue="OnchainSuite Inc."
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Website URL
            </Label>
            <Input
              defaultValue="https://onchain.suite"
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Account domain
            </Label>
            <Input
              defaultValue="onchain-suite"
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Default landing page
            </Label>
            <Select defaultValue="dashboard">
              <SelectTrigger className="h-12 border-border/80 bg-background text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="audience">Audience</SelectItem>
                <SelectItem value="automations">Automations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block"
        >
          <Button
            onClick={() => handleSave()}
            disabled={saving}
            className="mt-8 h-11 bg-primary px-8 text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/10"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save changes
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default CompanyInfo;
