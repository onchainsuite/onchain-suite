export interface ExternalService {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  backgroundColor: string;
  textColor: string;
  isConnected: boolean;
  category: "automation" | "crm" | "ecommerce" | "accounting" | "website";
}

export const EXTERNAL_SERVICES: ExternalService[] = [
  {
    id: "zapier",
    name: "Zapier",
    description: "Zap contacts into R3tain from a variety of apps & services",
    logoUrl: "/placeholder.svg?height=60&width=120&text=zapier",
    backgroundColor: "bg-orange-500",
    textColor: "text-white",
    isConnected: false,
    category: "automation",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Add Salesforce leads and contacts to an audience",
    logoUrl: "/placeholder.svg?height=60&width=120&text=salesforce",
    backgroundColor: "bg-blue-500",
    textColor: "text-white",
    isConnected: false,
    category: "crm",
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Sync customers from your e-commerce store",
    logoUrl: "/placeholder.svg?height=60&width=120&text=woo",
    backgroundColor: "bg-purple-600",
    textColor: "text-white",
    isConnected: false,
    category: "ecommerce",
  },
  {
    id: "quickbooks",
    name: "Quickbooks Online",
    description: "Add QuickBooks customers to a R3tain audience",
    logoUrl: "/placeholder.svg?height=60&width=120&text=quickbooks",
    backgroundColor: "bg-green-600",
    textColor: "text-white",
    isConnected: false,
    category: "accounting",
  },
  {
    id: "squarespace",
    name: "Squarespace Commerce",
    description: "Turn Squarespace customers into R3tain contacts",
    logoUrl: "/placeholder.svg?height=60&width=120&text=squarespace",
    backgroundColor: "bg-black",
    textColor: "text-white",
    isConnected: false,
    category: "website",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Bring Shopify customer data into R3tain",
    logoUrl: "/placeholder.svg?height=60&width=120&text=shopify",
    backgroundColor: "bg-gray-200",
    textColor: "text-gray-800",
    isConnected: false,
    category: "ecommerce",
  },
];
