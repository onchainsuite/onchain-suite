import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
import { authClient } from "@/lib/auth-client";

import { fadeInUp, staggerContainer } from "../../utils";

interface CompanyInfoProps {
  saving: boolean;
  handleSave: (callback?: () => void) => void;
}

const CompanyInfo = ({ saving, handleSave }: CompanyInfoProps) => {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    website: "", // Placeholder if not in org model yet
  });

  useEffect(() => {
    const fetchOrg = async () => {
      const org = await authClient.organization.list();
      if (org.data && org.data.length > 0) {
        // Assuming first org for now
        const currentOrg = org.data[0];
        setFormData({
          name: currentOrg.name,
          slug: currentOrg.slug,
          website: "",
        });
      }
    };
    fetchOrg();
  }, [session]);

  const onSave = async () => {
    setLoading(true);
    try {
      // Use authClient for organization updates
      await authClient.organization.update({
        organizationId: session?.session?.activeOrganizationId || "", // We need active org ID
        data: {
            name: formData.name,
            slug: formData.slug
        }
      });
      toast.success("Organization updated");
    } catch (error) {
      toast.error("Failed to update organization");
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Website URL
            </Label>
            <Input
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Account slug
            </Label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
            onClick={onSave}
            disabled={loading}
            className="mt-8 h-11 bg-primary px-8 text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/10"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save changes
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default CompanyInfo;
