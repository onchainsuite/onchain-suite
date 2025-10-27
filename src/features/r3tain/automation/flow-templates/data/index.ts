export const channelOptions = [
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
  { id: "push", label: "Push Notifications" },
  { id: "social", label: "Social Media" },
];

export const topicOptions = [
  { id: "audience-management", label: "Audience management" },
  { id: "ecommerce", label: "Ecommerce" },
  { id: "events", label: "Events" },
  { id: "feedback", label: "Feedback" },
  { id: "general", label: "General" },
  { id: "special-dates", label: "Special dates" },
  { id: "split-test", label: "Split test" },
  { id: "transactional", label: "Transactional" },
];

export const appsIntegrationsOptions = [
  { id: "3d-cart", label: "3d Cart" },
  { id: "ai-intuit-assist", label: "AI / Intuit Assist" },
  { id: "bigcartel", label: "BigCartel" },
  { id: "bigcommerce", label: "BigCommerce" },
  { id: "calendly", label: "Calendly" },
  { id: "drupal-association", label: "Drupal Association" },
  { id: "ecwid", label: "Ecwid" },
  { id: "eventbrite", label: "Eventbrite" },
  { id: "facebook", label: "Facebook" },
  { id: "google-analytics", label: "Google Analytics" },
  { id: "hubspot", label: "HubSpot" },
  { id: "instagram", label: "Instagram" },
  { id: "magento", label: "Magento" },
  { id: "salesforce", label: "Salesforce" },
  { id: "shopify", label: "Shopify" },
  { id: "stripe", label: "Stripe" },
  { id: "woocommerce", label: "WooCommerce" },
  { id: "wordpress", label: "WordPress" },
  { id: "zapier", label: "Zapier" },
];

export const sortOptions = [
  { id: "popular", label: "Popular" },
  { id: "newest", label: "Newest" },
  { id: "alphabetical", label: "Alphabetical" },
  { id: "recommended", label: "Recommended" },
];

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  templates: FlowTemplate[];
}

export interface FlowTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  tags: string[];
  isRecommended?: boolean;
  isPopular?: boolean;
  difficulty: string;
  estimatedSetupTime: string;
  features: string[];
  channels: string[];
  topics: string[];
  integrations: string[];
}

export const templateCategories: TemplateCategory[] = [
  {
    id: "recommended",
    name: "Try these recommended flows",
    description:
      "Some of these automation templates include generated email content that's personalized for you.",
    templates: [
      {
        id: "welcome-contacts",
        title: "Welcome new contacts",
        description:
          "Increase engagement from new subscribers with a personalized hello.",
        icon: "📧",
        category: "recommended",
        tags: ["Popular", "email"],
        isRecommended: true,
        difficulty: "beginner",
        estimatedSetupTime: "15 min",
        features: ["Email series", "Personalization", "Welcome sequence"],
        channels: ["email"],
        topics: ["general"],
        integrations: [],
      },
      {
        id: "share-exclusive",
        title: "Share exclusive content with new leads",
        description:
          "Welcome new contacts acquired through Meta lead ads. Once a lead is approved, automatically engage them with members-only content via email.",
        icon: "🎯",
        category: "recommended",
        tags: ["Meta Ads", "email"],
        isRecommended: true,
        difficulty: "intermediate",
        estimatedSetupTime: "25 min",
        features: ["Lead nurturing", "Exclusive content", "Meta integration"],
        channels: ["email"],
        topics: ["ecommerce"],
        integrations: ["facebook"],
      },
      {
        id: "celebrate-anniversaries",
        title: "Celebrate sign-up anniversaries with your contacts",
        description:
          "Offer promotions or well wishes that help contacts feel closer to your brand.",
        icon: "🎉",
        category: "recommended",
        tags: ["Engagement", "email"],
        isRecommended: true,
        difficulty: "beginner",
        estimatedSetupTime: "20 min",
        features: ["Anniversary tracking", "Promotions", "Brand loyalty"],
        channels: ["email"],
        topics: ["special-dates"],
        integrations: [],
      },
    ],
  },
  {
    id: "find-welcome",
    name: "Find & welcome new contacts",
    description: "Grow your audience and make great first impressions",
    templates: [
      {
        id: "welcome-new-contacts",
        title: "Welcome new contacts",
        description: "Send a series of emails to new subscribers",
        icon: "📧",
        category: "find-welcome",
        tags: ["Popular", "email"],
        isPopular: true,
        difficulty: "beginner",
        estimatedSetupTime: "15 min",
        features: ["Welcome series", "Automation", "Engagement"],
        channels: ["email"],
        topics: ["general"],
        integrations: [],
      },
      {
        id: "welcome-vip-subscribers",
        title: "Welcome VIP subscribers",
        description: "Special welcome flow for premium subscribers",
        icon: "⭐",
        category: "find-welcome",
        tags: ["VIP", "email"],
        difficulty: "intermediate",
        estimatedSetupTime: "30 min",
        features: ["VIP treatment", "Premium content", "Segmentation"],
        channels: ["email"],
        topics: ["audience-management"],
        integrations: [],
      },
      {
        id: "welcome-series",
        title: "Welcome series",
        description: "Multi-email welcome sequence for new contacts",
        icon: "📬",
        category: "find-welcome",
        tags: ["Series", "email"],
        difficulty: "beginner",
        estimatedSetupTime: "20 min",
        features: ["Email sequence", "Drip campaign", "Onboarding"],
        channels: ["email"],
        topics: ["general"],
        integrations: [],
      },
    ],
  },
  {
    id: "nurture-leads",
    name: "Nurture leads",
    description: "Convert prospects into customers with targeted content",
    templates: [
      {
        id: "lead-nurturing",
        title: "Lead nurturing campaign",
        description: "Educate and engage leads until they're ready to buy",
        icon: "🌱",
        category: "nurture-leads",
        tags: ["Education", "email"],
        difficulty: "intermediate",
        estimatedSetupTime: "45 min",
        features: ["Lead scoring", "Educational content", "Sales funnel"],
        channels: ["email"],
        topics: ["ecommerce"],
        integrations: ["hubspot", "salesforce"],
      },
      {
        id: "product-education",
        title: "Product education series",
        description: "Teach leads about your product benefits",
        icon: "🎓",
        category: "nurture-leads",
        tags: ["Education", "email"],
        difficulty: "intermediate",
        estimatedSetupTime: "40 min",
        features: ["Product demos", "Feature highlights", "Use cases"],
        channels: ["email"],
        topics: ["general"],
        integrations: [],
      },
    ],
  },
  {
    id: "re-engage",
    name: "Re-engage contacts",
    description: "Win back inactive subscribers and customers",
    templates: [
      {
        id: "win-back-campaign",
        title: "Win back inactive subscribers",
        description: "Re-engage contacts who haven't opened emails recently",
        icon: "🔄",
        category: "re-engage",
        tags: ["Win-back", "email"],
        difficulty: "intermediate",
        estimatedSetupTime: "35 min",
        features: ["Inactivity detection", "Special offers", "Re-engagement"],
        channels: ["email"],
        topics: ["audience-management"],
        integrations: [],
      },
      {
        id: "abandoned-cart",
        title: "Abandoned cart recovery",
        description: "Recover lost sales from abandoned shopping carts",
        icon: "🛒",
        category: "re-engage",
        tags: ["E-commerce", "Popular", "email"],
        isPopular: true,
        difficulty: "intermediate",
        estimatedSetupTime: "30 min",
        features: ["Cart tracking", "Product reminders", "Discount offers"],
        channels: ["email"],
        topics: ["ecommerce"],
        integrations: ["shopify", "woocommerce", "bigcommerce"],
      },
    ],
  },
  {
    id: "support-manage",
    name: "Support and manage contacts",
    description: "Provide ongoing support and manage customer relationships",
    templates: [
      {
        id: "customer-onboarding",
        title: "Customer onboarding",
        description: "Guide new customers through your product or service",
        icon: "🚀",
        category: "support-manage",
        tags: ["Onboarding", "email"],
        difficulty: "intermediate",
        estimatedSetupTime: "50 min",
        features: [
          "Step-by-step guidance",
          "Resource sharing",
          "Progress tracking",
        ],
        channels: ["email"],
        topics: ["general"],
        integrations: [],
      },
      {
        id: "feedback-collection",
        title: "Feedback collection",
        description: "Automatically collect customer feedback and reviews",
        icon: "💬",
        category: "support-manage",
        tags: ["Feedback", "email"],
        difficulty: "beginner",
        estimatedSetupTime: "25 min",
        features: ["Survey automation", "Review requests", "Feedback analysis"],
        channels: ["email"],
        topics: ["feedback"],
        integrations: [],
      },
    ],
  },
  {
    id: "transactional",
    name: "Transactional",
    description: "Essential automated emails for transactions and updates",
    templates: [
      {
        id: "order-confirmation",
        title: "Order confirmation",
        description: "Automatically send order confirmations to customers",
        icon: "✅",
        category: "transactional",
        tags: ["E-commerce", "email"],
        difficulty: "beginner",
        estimatedSetupTime: "15 min",
        features: ["Order details", "Tracking info", "Customer support"],
        channels: ["email"],
        topics: ["transactional"],
        integrations: ["shopify", "woocommerce", "stripe"],
      },
      {
        id: "shipping-notifications",
        title: "Shipping notifications",
        description: "Keep customers updated on their order status",
        icon: "📦",
        category: "transactional",
        tags: ["E-commerce", "email"],
        difficulty: "beginner",
        estimatedSetupTime: "20 min",
        features: ["Shipping updates", "Tracking links", "Delivery estimates"],
        channels: ["email"],
        topics: ["transactional"],
        integrations: ["shopify", "woocommerce", "3d-cart"],
      },
    ],
  },
];

export const allTemplates: FlowTemplate[] = templateCategories.flatMap(
  (category) => category.templates
);
