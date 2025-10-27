"use client";

import { useState } from "react";

import { ImportLayout } from "@/r3tain/community/components/import/import-layout";
import { ImportNotice } from "@/r3tain/community/components/import/import-notice";
import { StatusSection } from "@/r3tain/community/components/import/subscribe";
import {
  ContinueButton,
  PageHeader,
} from "@/r3tain/community/components/shared";
import { useImport } from "@/r3tain/community/context";
import { useImportNavigation } from "@/r3tain/community/hooks";
import {
  SUBSCRIPTION_STATUSES,
  type SubscriptionSettings,
} from "@/r3tain/community/types";

export default function SubscribePage() {
  const { state, updateSubscriptionSettings } = useImport();
  const { navigateToStep } = useImportNavigation();
  const [settings, setSettings] = useState<SubscriptionSettings>(
    state.subscriptionSettings ?? {
      selectedStatus: SUBSCRIPTION_STATUSES[0],
    }
  );

  const handleStatusChange = (status: (typeof SUBSCRIPTION_STATUSES)[0]) => {
    const newSettings = { ...settings, selectedStatus: status };
    setSettings(newSettings);
    updateSubscriptionSettings(newSettings);
  };

  const handleFinalizeImport = () => {
    navigateToStep("complete");
  };

  return (
    <ImportLayout currentStep={5}>
      <PageHeader
        title="Subscribe Community to Marketing"
        subtitle="The status you assign to the subscribers in this file will only be applied to new subscribers. Existing subscribers will not have their subscription status updated, but any other data that may have changed will be updated."
        helpLinks={[
          {
            text: "Understand the importance of permission",
            onClick: () => console.log("Permission help"),
          },
        ]}
      />

      <StatusSection
        selectedStatus={settings.selectedStatus}
        onStatusChange={handleStatusChange}
      />

      <ImportNotice />

      <ContinueButton onClick={handleFinalizeImport} text="Finalize Import" />
    </ImportLayout>
  );
}
