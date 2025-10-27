import { type ImportState } from "@/r3tain/community/context";
import type { ImportSummary } from "@/r3tain/community/types";

export function generateImportSummary(state: ImportState): ImportSummary {
  // Calculate subscriber count from validation data
  const subscriberCount = state.validation?.data?.length ?? 0;

  // Determine import method display name
  const getImportMethodName = (method: string | null): string => {
    switch (method) {
      case "upload-file":
        return "File upload";
      case "copy-paste":
        return "Copy and paste";
      case "import-service":
        return "Service integration";
      default:
        return "Unknown method";
    }
  };

  // Get community name
  const communityName = state.selectedCommunity?.name ?? "Unknown Community";

  // Get email marketing status
  const emailMarketingStatus =
    state.subscriptionSettings?.selectedStatus.name ?? "Not selected";

  // Get update existing setting
  const updateExistingSubscribers =
    state.organizeSettings?.updateExistingSubscribers ?? false;

  // Get selected tags
  const selectedTags = state.tagSettings.selectedTags.map((tag) => tag.name);

  return {
    subscriberCount,
    importMethod: getImportMethodName(state.selectedMethod),
    communityName,
    emailMarketingStatus,
    updateExistingSubscribers,
    selectedTags,
    planLimit: {
      current: 450, // This would come from user's actual plan data
      limit: 500,
      planType: "Free",
    },
  };
}

export function validateImportReadiness(state: ImportState): {
  isReady: boolean;
  missingSteps: string[];
} {
  const missingSteps: string[] = [];

  if (!state.selectedMethod) {
    missingSteps.push("Import method not selected");
  }

  if (!state.validation?.isValid) {
    missingSteps.push("Invalid or missing data");
  }

  if (state.fieldMappings.length === 0) {
    missingSteps.push("Field mappings not configured");
  }

  if (!state.organizeSettings || !state.selectedCommunity) {
    missingSteps.push("Community not selected");
  }

  if (!state.subscriptionSettings) {
    missingSteps.push("Subscription status not selected");
  }

  return {
    isReady: missingSteps.length === 0,
    missingSteps,
  };
}
