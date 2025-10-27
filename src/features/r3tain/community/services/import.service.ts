// Import service following Single Responsibility Principle
import type { ImportState } from "@/r3tain/community/context";
import type { ImportSummary } from "@/r3tain/community/types";

export class ImportService {
  static generateSummary(state: ImportState): ImportSummary {
    const subscriberCount = state.validation?.data?.length ?? 0;
    const importMethod = this.getImportMethodName(state.selectedMethod);
    const communityName = state.selectedCommunity?.name ?? "Unknown Community";
    const emailMarketingStatus =
      state.subscriptionSettings?.selectedStatus.name ?? "Not selected";
    const updateExistingSubscribers =
      state.organizeSettings?.updateExistingSubscribers ?? false;
    const selectedTags = state.tagSettings.selectedTags.map((tag) => tag.name);

    return {
      subscriberCount,
      importMethod,
      communityName,
      emailMarketingStatus,
      updateExistingSubscribers,
      selectedTags,
      planLimit: {
        current: 450,
        limit: 500,
        planType: "Free",
      },
    };
  }

  static validateReadiness(state: ImportState): {
    isReady: boolean;
    missingSteps: string[];
  } {
    const missingSteps: string[] = [];

    if (!state.selectedMethod) missingSteps.push("Import method not selected");
    if (!state.validation?.isValid)
      missingSteps.push("Invalid or missing data");
    if (state.fieldMappings.length === 0)
      missingSteps.push("Field mappings not configured");
    if (!state.organizeSettings || !state.selectedCommunity)
      missingSteps.push("Community not selected");
    if (!state.subscriptionSettings)
      missingSteps.push("Subscription status not selected");

    return {
      isReady: missingSteps.length === 0,
      missingSteps,
    };
  }

  private static getImportMethodName(method: string | null): string {
    const methodMap: Record<string, string> = {
      "upload-file": "File upload",
      "copy-paste": "Copy and paste",
      "import-service": "Service integration",
    };
    return methodMap[method ?? ""] ?? "Unknown method";
  }
}
