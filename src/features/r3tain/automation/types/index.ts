export interface AutomationTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "popular" | "recommended";
  tags?: string[];
  isPopular?: boolean;
}

export interface HelpResource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "video" | "tutorial";
  image: string;
  category: string;
}
