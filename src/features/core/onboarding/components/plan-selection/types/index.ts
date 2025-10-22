export interface Feature {
  name: string;
  key: string;
  tooltip: string;
  category: string;
  beta?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  buttonText: string;
  recommended?: boolean;
  buttonClass?: string;
  features: Record<string, string | boolean>;
}
