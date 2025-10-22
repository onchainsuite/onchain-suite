import type { Feature, Plan } from "../types";

export const features: Feature[] = [
  {
    name: "Monthly email sends",
    key: "emailSends",
    tooltip:
      "The number of emails you can send to your contacts each month. Overages may apply if you exceed this limit.",
    category: "Core Features",
  },
  {
    name: "Users",
    key: "users",
    tooltip:
      "The number of team members who can access and manage your R3tain account.",
    category: "Core Features",
  },
  {
    name: "Audiences",
    key: "audiences",
    tooltip:
      "Separate groups of contacts you can create to organize your email marketing campaigns.",
    category: "Core Features",
  },
  {
    name: "Customer support",
    key: "support",
    tooltip:
      "The level of customer support available to help you with questions and technical issues.",
    category: "Support",
  },
  {
    name: "Personalized Onboarding",
    key: "onboarding",
    tooltip:
      "One-on-one sessions with a R3tain expert to help you set up and optimize your account.",
    category: "Support",
  },
  {
    name: "Creative Assistant",
    key: "creativeAssistant",
    tooltip:
      "AI-powered tool that helps you create email designs, subject lines, and marketing content.",
    category: "AI Tools",
  },
  {
    name: "Reporting & Analytics",
    key: "reporting",
    tooltip:
      "Detailed insights into your email performance, including open rates, click rates, and audience engagement.",
    category: "Analytics",
  },
  {
    name: "Custom-coded templates",
    key: "customTemplates",
    tooltip:
      "Advanced email templates with custom HTML/CSS code for unique designs and functionality.",
    category: "Design Tools",
  },
  {
    name: "Predictive Segmentation",
    key: "predictiveSegmentation",
    tooltip:
      "AI-powered feature that automatically identifies your most engaged contacts and likely purchasers.",
    category: "AI Tools",
  },
  {
    name: "Content Optimizer",
    key: "contentOptimizer",
    tooltip:
      "AI tool that suggests improvements to your email content to increase engagement and conversions.",
    category: "AI Tools",
  },
  {
    name: "Send time optimization",
    key: "sendTimeOptimization",
    tooltip:
      "Automatically determines the best time to send emails to each contact for maximum engagement.",
    category: "Automation",
  },
  {
    name: "Dynamic content",
    key: "dynamicContent",
    tooltip:
      "Personalize email content for different segments of your audience within a single campaign.",
    category: "Personalization",
  },
  {
    name: "Campaign Manager",
    key: "campaignManager",
    tooltip:
      "Advanced tools for managing complex, multi-step marketing campaigns across different channels.",
    category: "Campaign Tools",
  },
  {
    name: "Multivariate Testing",
    key: "multivariateTest",
    tooltip:
      "Test multiple variables in your emails simultaneously to optimize performance and engagement.",
    category: "Testing",
  },
  {
    name: "Comparative Reporting",
    key: "comparativeReporting",
    tooltip:
      "Compare performance across different campaigns, time periods, and audience segments.",
    category: "Analytics",
  },
  {
    name: "Advanced Segmentation",
    key: "advancedSegmentation",
    tooltip:
      "Create highly targeted audience segments based on behavior, preferences, and engagement history.",
    category: "Audience Tools",
  },
  {
    name: "Remove R3tain branding",
    key: "removeBranding",
    tooltip:
      "Remove R3tain logos and branding from your emails and landing pages for a professional look.",
    category: "Branding",
  },
  {
    name: "A/B Testing",
    key: "abTesting",
    tooltip:
      "Test different versions of your emails to see which performs better with your audience.",
    category: "Testing",
  },
  {
    name: "Email scheduling",
    key: "emailScheduling",
    tooltip:
      "Schedule your email campaigns to be sent at specific dates and times in the future.",
    category: "Campaign Tools",
  },
  {
    name: "Automated Customer Journeys",
    key: "automatedJourneys",
    tooltip:
      "Create automated email sequences that respond to customer actions and behaviors.",
    category: "Automation",
  },
  {
    name: "Pre-built email templates",
    key: "prebuiltTemplates",
    tooltip:
      "Ready-to-use email templates designed for different industries and campaign types.",
    category: "Design Tools",
  },
  {
    name: "Role-based access",
    key: "roleBasedAccess",
    tooltip:
      "Control what team members can see and do in your account with customizable user permissions.",
    category: "Team Management",
  },
  {
    name: "3000+ Integrations",
    key: "integrations",
    tooltip:
      "Connect R3tain with your favorite apps and tools to streamline your marketing workflow.",
    category: "Integrations",
  },
  {
    name: "Forms & Landing Pages",
    key: "formsLanding",
    tooltip:
      "Create signup forms and landing pages to grow your audience and capture leads.",
    category: "Lead Generation",
  },
];

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Start with the basics",
    price: "$0",
    period: "per month",
    buttonText: "Sign up free",
    features: {
      emailSends: "1,000",
      users: "1",
      audiences: "1",
      support: false,
      onboarding: false,
      creativeAssistant: false,
      reporting: false,
      customTemplates: false,
      predictiveSegmentation: false,
      contentOptimizer: false,
      sendTimeOptimization: false,
      dynamicContent: false,
      campaignManager: false,
      multivariateTest: false,
      comparativeReporting: false,
      advancedSegmentation: false,
      removeBranding: false,
      abTesting: false,
      emailScheduling: true,
      automatedJourneys: false,
      prebuiltTemplates: true,
      roleBasedAccess: false,
      integrations: true,
      formsLanding: true,
    },
  },
  {
    id: "essentials",
    name: "Essentials",
    description: "For new businesses",
    price: "$500",
    period: "per month",
    buttonText: "Get started",
    features: {
      emailSends: "5,000",
      users: "1",
      audiences: "3",
      support: true,
      onboarding: false,
      creativeAssistant: true,
      reporting: true,
      customTemplates: false,
      predictiveSegmentation: false,
      contentOptimizer: false,
      sendTimeOptimization: false,
      dynamicContent: false,
      campaignManager: false,
      multivariateTest: false,
      comparativeReporting: false,
      advancedSegmentation: false,
      removeBranding: false,
      abTesting: true,
      emailScheduling: true,
      automatedJourneys: false,
      prebuiltTemplates: true,
      roleBasedAccess: false,
      integrations: true,
      formsLanding: true,
    },
  },
  {
    id: "standard",
    name: "Standard",
    description: "For growing businesses",
    price: "$1000",
    period: "per month",
    recommended: true,
    buttonText: "Get started",
    buttonClass: "bg-amber-500 hover:bg-amber-600 text-white",
    features: {
      emailSends: "10,000",
      users: "3",
      audiences: "5",
      support: true,
      onboarding: false,
      creativeAssistant: true,
      reporting: true,
      customTemplates: true,
      predictiveSegmentation: false,
      contentOptimizer: false,
      sendTimeOptimization: true,
      dynamicContent: true,
      campaignManager: false,
      multivariateTest: false,
      comparativeReporting: false,
      advancedSegmentation: false,
      removeBranding: true,
      abTesting: true,
      emailScheduling: true,
      automatedJourneys: true,
      prebuiltTemplates: true,
      roleBasedAccess: true,
      integrations: true,
      formsLanding: true,
    },
  },
  {
    id: "premium",
    name: "Premium",
    description: "For expert marketers",
    price: "$1500",
    period: "per month",
    buttonText: "Contact us",
    features: {
      emailSends: "150,000+",
      users: "Unlimited",
      audiences: "Unlimited",
      support: true,
      onboarding: true,
      creativeAssistant: true,
      reporting: true,
      customTemplates: true,
      predictiveSegmentation: true,
      contentOptimizer: true,
      sendTimeOptimization: true,
      dynamicContent: true,
      campaignManager: true,
      multivariateTest: true,
      comparativeReporting: true,
      advancedSegmentation: true,
      removeBranding: true,
      abTesting: true,
      emailScheduling: true,
      automatedJourneys: true,
      prebuiltTemplates: true,
      roleBasedAccess: true,
      integrations: true,
      formsLanding: true,
    },
  },
];
