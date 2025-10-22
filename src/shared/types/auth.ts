export interface RecaptchaEnterpriseResponse {
  tokenProperties?: {
    valid: boolean;
    invalidReason?: string;
    action?: string;
  };
  riskAnalysis?: {
    score: number;
    reasons: string[];
  };
}
