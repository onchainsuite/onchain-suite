"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useTimezones } from "@/shared/hooks/client/use-timezones";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Must be a valid E.164 phone number (e.g., +1234567890)"
    )
    .optional()
    .or(z.literal("")),
  taxId: z
    .string()
    .regex(
      /^[A-Z0-9-]{5,20}$/,
      "Invalid Tax ID format (alphanumeric & hyphens, 5-20 chars)"
    )
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(1, "Address is required")
    .optional()
    .or(z.literal("")),
  timezone: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CompanyEditForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CompanyFormValues | null>(null);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      taxId: "",
      address: "",
      timezone: "UTC",
    },
  });

  const { data: session } = authClient.useSession();
  const { items: timezones, loading: tzLoading } = useTimezones();

  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await apiClient.get("/organization");
        // Handle both direct object and { data: ... } wrapper
        const org = res.data?.data || res.data;
        if (org) {
          const settings = org.settings || {};
          const initialData = {
            name: org.name || "",
            email: settings.billingEmail || "",
            phone: settings.phone || "",
            taxId: settings.taxId || "",
            address: settings.address || "",
            timezone: settings.timezone || "UTC",
          };
          setData(initialData);
          form.reset(initialData);
        } else {
          // If no org found or error, maybe 404
          console.error("Failed to fetch organization");
        }
      } catch (e) {
        toast.error("Failed to load company details");
      } finally {
        setLoading(false);
      }
    }
    fetchOrg();
  }, [form]);

  const onSubmit = async (values: CompanyFormValues) => {
    const previousData = data;
    // Optimistic update
    setData(values);
    setIsEditing(false);

    try {
      await apiClient.put("/organization", {
        name: values.name,
        settings: {
          billingEmail: values.email,
          phone: values.phone,
          taxId: values.taxId,
          address: values.address,
          timezone: values.timezone,
        },
      });

      toast.success("Company details updated successfully");
    } catch (error) {
      setData(previousData);
      form.reset(previousData || undefined);
      toast.error("Failed to update company details");
      setIsEditing(true); // Re-open edit mode on failure
    }
  };

  if (loading) return <Skeleton className="h-75 w-full rounded-xl" />;

  return (
    <Card className="overflow-hidden border-border/60 bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-medium">Company Details</CardTitle>
          <CardDescription>
            Manage your organization's public profile and billing information.
          </CardDescription>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form
              key="edit-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input {...form.register("name")} placeholder="Acme Inc." />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Billing Email</Label>
                  <Input
                    {...form.register("email")}
                    type="email"
                    placeholder="billing@acme.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Phone (E.164)</Label>
                  <Input
                    {...form.register("phone")}
                    placeholder="+1234567890"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Tax ID / VAT Number</Label>
                  <Input
                    {...form.register("taxId")}
                    placeholder="US-123456789"
                  />
                  {form.formState.errors.taxId && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.taxId.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    onValueChange={(val) => form.setValue("timezone", val)}
                    defaultValue={form.getValues("timezone")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tzLoading ? (
                        <div className="p-2 text-sm text-muted-foreground">Loading…</div>
                      ) : (
                        timezones.map((tz) => (
                          <SelectItem key={tz.id} value={tz.id}>
                            {tz.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Input
                    {...form.register("address")}
                    placeholder="123 Market St, San Francisco, CA 94103"
                  />
                  {form.formState.errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset(data || undefined);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="view-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
            >
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Company Name
                </p>
                <p className="text-base font-medium">{data?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Billing Email
                </p>
                <p className="text-base">
                  {data?.email || (
                    <span className="text-muted-foreground/50 italic">
                      Not set
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Phone
                </p>
                <p className="text-base">
                  {data?.phone || (
                    <span className="text-muted-foreground/50 italic">
                      Not set
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Tax ID
                </p>
                <p className="font-mono bg-muted/50 px-2 py-0.5 rounded text-sm w-fit">
                  {data?.taxId || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Timezone
                </p>
                <p className="text-base">{data?.timezone || "UTC"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Address
                </p>
                <p className="text-base">
                  {data?.address || (
                    <span className="text-muted-foreground/50 italic">
                      Not set
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
