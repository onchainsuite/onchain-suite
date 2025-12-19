
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { fadeInUp, staggerContainer } from "../../utils";

const PersonalDetails = () => {
  return (
    <motion.section variants={staggerContainer} initial="initial" animate="animate">
      <motion.h2
        variants={fadeInUp}
        className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
      >
        Your details
      </motion.h2>
      <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
        Manage your personal information
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 lg:mt-10 lg:pt-10"
      >
        <div className="space-y-6 lg:space-y-8">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Email address
            </Label>
            <Input
              type="email"
              defaultValue="jason@onchain.suite"
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                First name
              </Label>
              <Input
                defaultValue="Jason"
                className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                Last name
              </Label>
              <Input
                defaultValue="Chen"
                className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Timezone
            </Label>
            <Select defaultValue="pst">
              <SelectTrigger className="h-12 border-border/80 bg-background text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                <SelectItem value="est">Eastern Time (ET)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="gmt">GMT</SelectItem>
                <SelectItem value="cet">Central European (CET)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-5 pt-2">
            <Label className="text-sm font-medium text-foreground">
              Email preferences
            </Label>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="product"
                  defaultChecked
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor="product" className="text-sm text-muted-foreground">
                  Product updates and announcements
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="marketing"
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor="marketing" className="text-sm text-muted-foreground">
                  Marketing and promotional emails
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="security"
                  defaultChecked
                  disabled
                  className="border-border opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor="security" className="text-sm text-muted-foreground">
                  Security alerts (required)
                </label>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default PersonalDetails;
