import { z } from "zod";

export const subscriberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.object({
    street: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }),
  phoneNumber: z.string().optional(),
  birthday: z.date().optional(),
  company: z.string().optional(),
  imapPort: z.string().optional(),
  smtpServer: z.string().optional(),
  smtpPort: z.string().optional(),
  password: z.string().optional(),
  tags: z.array(z.string()),
  marketingPermissions: z.object({
    emailPermission: z.boolean(),
    updateProfile: z.boolean(),
  }),
});

export type SubscriberFormData = z.infer<typeof subscriberSchema>;
