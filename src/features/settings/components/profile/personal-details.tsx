import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import { fadeInUp, staggerContainer } from "../../utils";

const PersonalDetails = () => {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (session?.user) {
      const { name, email } = session.user;
      const [firstName = "", lastName = ""] = name.split(" ");
      setFormData({
        name,
        email,
        firstName,
        lastName,
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authClient.updateUser({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <form onSubmit={handleSubmit}>
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
                value={formData.email}
                disabled
                className="h-12 border-border/80 bg-muted/50 text-muted-foreground"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  First name
                </Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  Last name
                </Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
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

            <div className="pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </motion.div>
      </form>
    </motion.section>
  );
};

export default PersonalDetails;
