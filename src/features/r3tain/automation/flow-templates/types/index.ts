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
  isPopular?: boolean;
  isRecommended?: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedSetupTime: string;
  features: string[];
}

export type TemplateSortOption =
  | "popular"
  | "newest"
  | "alphabetical"
  | "recommended";

export interface TemplateFilters {
  channels: string[];
  topics: string[];
  appsIntegrations: string[];
  sortBy: TemplateSortOption;
  search: string;
}
