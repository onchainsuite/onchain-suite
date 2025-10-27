"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Tag, Users, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  CheckboxFormField,
  CityFormField,
  CountryFormField,
  DateFormField,
  InputFormField,
  StateFormField,
} from "@/components/form-fields";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Form,
  LoadingButton,
  PhoneInput,
  Separator,
} from "@/components/ui";

import { TagsModal } from "./tag-modal";
import { PasswordField } from "@/auth/components/shared";
import {
  type SubscriberFormData,
  subscriberSchema,
} from "@/r3tain/community/validations";

export function SubscriberForm() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const form = useForm<SubscriberFormData>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: {
        street: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      phoneNumber: "",
      company: "",
      imapPort: "",
      smtpServer: "",
      smtpPort: "",
      password: "",
      tags: [],
      marketingPermissions: {
        emailPermission: false,
        updateProfile: false,
      },
    },
  });

  const onSubmit = (data: SubscriberFormData) => {
    console.log("Form submitted:", { ...data, tags: selectedTags });
    // Handle form submission here
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="mx-auto mt-4 max-w-4xl space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <InputFormField
                form={form}
                name="email"
                placeholder="Email"
                icon={Mail}
                type="email"
                label="Email Address"
                required
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <InputFormField
                  form={form}
                  name="firstName"
                  label="First Name"
                />

                <InputFormField form={form} name="lastName" label="Last Name" />
              </div>

              <Separator />

              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Address</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <CountryFormField
                    control={form.control}
                    name="address.country"
                  />
                  <StateFormField
                    control={form.control}
                    name="address.state"
                    countryName="address.country"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <CityFormField
                    control={form.control}
                    name="address.city"
                    countryName="address.country"
                    stateName="address.state"
                  />

                  <InputFormField
                    form={form}
                    name="address.postalCode"
                    label="Zip / Postal code"
                  />
                </div>

                <InputFormField
                  form={form}
                  name="address.street"
                  label="Address line 1 (Street
                  address or post office box)"
                />

                <InputFormField
                  form={form}
                  name="address.addressLine2"
                  label="Address line 2"
                  additionalLabel="Optional"
                />
              </div>

              <Separator />

              {/* Additional Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <InputFormField
                  form={form}
                  name="phoneNumber"
                  label="Phone Number"
                  renderChild={(field) => (
                    <PhoneInput {...field} value={field.value as string} />
                  )}
                />

                <DateFormField form={form} name="birthday" label="Birthday" />
              </div>
              <InputFormField form={form} name="company" label="Company" />

              <Separator />

              {/* Technical Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Technical Settings</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <InputFormField
                    form={form}
                    name="imapPort"
                    label="IMAP Port"
                    placeholder="Enter IMAP port"
                  />

                  <InputFormField
                    form={form}
                    name="smtpServer"
                    label="SMTP Server"
                    placeholder="Enter SMTP server"
                  />

                  <InputFormField
                    form={form}
                    name="smtpPort"
                    label="SMTP Port"
                    placeholder="Enter SMTP port"
                  />

                  <PasswordField
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <Separator />

              {/* Tags Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Tags</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTagsModalOpen(true)}
                    className="transition-all duration-200 hover:border-teal-200 hover:bg-teal-50 dark:hover:bg-teal-950"
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Add tags
                  </Button>
                </div>

                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="animate-in fade-in-0 slide-in-from-left-2 duration-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive ml-2"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-muted-foreground text-sm">
                  Tags let you track insights about your subscribers that are
                  important to you. Use them to track where you acquired a
                  subscriber, which campaigns lead to a subscriber&apos;s
                  conversion and more.
                </p>
              </div>

              <Separator />

              {/* Marketing Permissions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Marketing permissions</h3>
                <CheckboxFormField
                  form={form}
                  name="marketingPermissions.emailPermission"
                  label="This person gave me permission to email them"
                  description="This person will not receive a confirmation email from R3tain.
                  Since you're adding this recipient manually,
                  they won't have an opt-in IP address or date in your records,
                  so be extra sure you have permission first."
                />

                <CheckboxFormField
                  form={form}
                  name="marketingPermissions.updateProfile"
                  label="If this person is already in my audience, update their profile."
                />
              </div>

              <div className="flex justify-end pt-6">
                <LoadingButton
                  isLoading={false}
                  className="w-auto"
                  icon={Users}
                >
                  Add subscriber
                </LoadingButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <TagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />
    </div>
  );
}
