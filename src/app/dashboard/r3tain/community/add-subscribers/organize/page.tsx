"use client";

import { useState } from "react";

import { ImportLayout } from "@/r3tain/community/components/import/import-layout";
import {
  CommunitySection,
  UpdateSection,
} from "@/r3tain/community/components/import/organize";
import {
  ContinueButton,
  PageHeader,
} from "@/r3tain/community/components/shared";
import { useImport } from "@/r3tain/community/context";
import { mockCommunities } from "@/r3tain/community/data";
import { useImportNavigation } from "@/r3tain/community/hooks";
import { type OrganizeSettings } from "@/r3tain/community/types";

export default function OrganizePage() {
  const { state, updateOrganizeSettings } = useImport();
  const { navigateToStep } = useImportNavigation();
  const [settings, setSettings] = useState<OrganizeSettings>(
    state.organizeSettings ?? {
      selectedCommunityId: "r3tain-main",
      updateExistingSubscribers: true,
    }
  );

  const handleCommunityChange = (communityId: string) => {
    if (communityId === "create-new") {
      console.log("Create new community");
      return;
    }
    const newSettings = { ...settings, selectedCommunityId: communityId };
    const selectedCommunity = mockCommunities.find((c) => c.id === communityId);
    setSettings(newSettings);
    if (selectedCommunity) {
      updateOrganizeSettings(newSettings, selectedCommunity);
    }
  };

  const handleUpdateChange = (checked: boolean) => {
    const newSettings = { ...settings, updateExistingSubscribers: checked };
    setSettings(newSettings);
    const selectedCommunity = mockCommunities.find(
      (c) => c.id === settings.selectedCommunityId
    );
    if (selectedCommunity) {
      updateOrganizeSettings(newSettings, selectedCommunity);
    }
  };

  const handleHelpClick = () => {
    console.log("Show help for updating existing subscribers");
  };

  const handleContinue = () => {
    navigateToStep("tag");
  };

  const canContinue = settings.selectedCommunityId !== "";

  return (
    <ImportLayout currentStep={3}>
      <PageHeader
        title="Organize your Subscriber"
        subtitle="We recommend adding and keeping all your subscribers in one Community to make it easier to send personalized campaigns and to maintain your subscriber data as you grow."
        helpLinks={[
          {
            text: "How to organize subscribers",
            onClick: () => console.log("Help clicked"),
          },
        ]}
      />

      <CommunitySection
        communities={mockCommunities}
        selectedCommunityId={settings.selectedCommunityId}
        onCommunityChange={handleCommunityChange}
      />

      <UpdateSection
        updateExisting={settings.updateExistingSubscribers}
        onUpdateChange={handleUpdateChange}
        onHelpClick={handleHelpClick}
      />

      <ContinueButton onClick={handleContinue} disabled={!canContinue} />
    </ImportLayout>
  );
}
