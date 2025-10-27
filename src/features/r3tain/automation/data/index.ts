import type { AutomationTemplate, HelpResource } from "../types";

export const recommendedFlows: AutomationTemplate[] = [
  {
    id: "welcome-contacts",
    title: "Welcome new contacts",
    description:
      "Increase engagement from new subscribers with a personalized hello.",
    icon: "📧",
    category: "recommended",
    tags: ["Popular"],
  },
  {
    id: "exclusive-content",
    title: "Share exclusive content with new leads",
    description:
      "Welcome new contacts acquired through Meta lead ads. Once a lead is approved, automatically engage them with members-only content via email.",
    icon: "🎯",
    category: "recommended",
  },
  {
    id: "celebrate-anniversaries",
    title: "Celebrate sign-up anniversaries with your contacts",
    description:
      "Offer promotions or well wishes that help contacts feel closer to your brand.",
    icon: "🎉",
    category: "recommended",
  },
];

export const popularTemplates: AutomationTemplate[] = [
  {
    id: "welcome-new-contacts",
    title: "Welcome new contacts",
    description: "Send a series of emails to new subscribers",
    icon: "📧",
    category: "popular",
    isPopular: true,
  },
  {
    id: "email-tagged-customers",
    title: "Email tagged customers",
    description: "Send targeted emails based on customer tags",
    icon: "🏷️",
    category: "popular",
    isPopular: true,
  },
  {
    id: "celebrate-birthdays",
    title: "Celebrate customer birthdays",
    description: "Send birthday wishes and special offers",
    icon: "🎂",
    category: "popular",
    isPopular: true,
  },
  {
    id: "recover-abandoned-carts",
    title: "Recover abandoned carts",
    description: "Win back customers who left items in their cart",
    icon: "🛒",
    category: "popular",
    isPopular: true,
  },
  {
    id: "facebook-lead-ads",
    title: "Find new contacts with Facebook Lead Ads",
    description: "Automatically add Facebook leads to your audience",
    icon: "📱",
    category: "popular",
    isPopular: true,
  },
  {
    id: "recover-lost-customers",
    title: "Recover lost customers",
    description: "Re-engage customers who haven't purchased recently",
    icon: "🔄",
    category: "popular",
    isPopular: true,
  },
  {
    id: "repeat-customers",
    title: "Create repeat customers",
    description: "Turn one-time buyers into loyal customers",
    icon: "🔁",
    category: "popular",
    isPopular: true,
  },
];

export const helpResources: HelpResource[] = [
  {
    id: "about-flows",
    title: "About automation flows",
    description:
      "Get started with our automation builder, and create dynamic marketing paths for your contacts.",
    type: "guide",
    image: "/placeholder.svg?height=200&width=300&text=Automation+Builder",
    category: "getting started",
  },
  {
    id: "quick-start-video",
    title: "Quick start video",
    description:
      "Watch as we guide you through the process of setting up an automation with the flow builder.",
    type: "video",
    image: "/placeholder.svg?height=200&width=300&text=Video+Tutorial",
    category: "tutorial",
  },
  {
    id: "create-automation",
    title: "Create an automation flow",
    description:
      "Learn how to build automated workflows that deliver personalized experiences for your contacts.",
    type: "tutorial",
    image: "/placeholder.svg?height=200&width=300&text=Step+by+Step",
    category: "step-by-step guide",
  },
];
