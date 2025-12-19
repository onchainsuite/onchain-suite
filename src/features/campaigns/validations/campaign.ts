import z from "zod";

export const campaignFormSchema = z.object({
  // Step 1: Campaign Details
  campaignName: z.string().min(1, "Campaign name is required"),
  campaignType: z.enum(["email-blast", "drip-campaign", "newsletter"]),
  template: z.string().min(1, "Please select a template"),

  // Step 2: Audience & Tracking
  selectedAudiences: z.array(z.string()).min(1, "Select at least one audience"),
  smartSending: z.boolean().default(true),
  trackingParameters: z.boolean().default(true),

  // Step 3: Template & Email Message
  selectedTemplate: z.string().optional(),
  emailSubject: z.string().min(1, "Subject line is required"),
  previewText: z.string().optional(),
  senderName: z.string().min(1, "Sender name is required"),
  senderEmail: z.email("Please enter a valid email address"),
  useReplyTo: z.boolean().default(true),
  replyToEmail: z
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),

  // Step 4: Schedule
  sendOption: z.enum(["now", "schedule"]),
  scheduleDate: z.date().optional(),
  scheduleTime: z.string().optional(),
  timezone: z.string().default("UTC"),
});

export type CampaignFormData = z.input<typeof campaignFormSchema>;
