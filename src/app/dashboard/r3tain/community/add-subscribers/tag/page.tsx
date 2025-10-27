/* eslint-disable no-console */
"use client";

import { useState } from "react";

import { ImportLayout } from "@/r3tain/community/components/import/import-layout";
import { PopularTagsSection } from "@/r3tain/community/components/import/tag/popular-tags-section";
import { TagInputSection } from "@/r3tain/community/components/import/tag/tag-input-section";
import {
  ContinueButton,
  PageHeader,
} from "@/r3tain/community/components/shared";
import { useImport } from "@/r3tain/community/context";
import { mockAvailableTags, mockPopularTags } from "@/r3tain/community/data";
import { useImportNavigation } from "@/r3tain/community/hooks";
import type { Tag, TagSettings } from "@/r3tain/community/types";

export default function TagPage() {
  const { state, updateTagSettings } = useImport();
  const { navigateToStep } = useImportNavigation();
  const [settings, setSettings] = useState<TagSettings>(state.tagSettings);

  const handleTagsChange = (tags: Tag[]) => {
    const newSettings = { ...settings, selectedTags: tags };
    setSettings(newSettings);
    updateTagSettings(newSettings);
  };

  const handlePopularTagSelect = (tag: Tag) => {
    if (!settings.selectedTags.some((selected) => selected.id === tag.id)) {
      handleTagsChange([...settings.selectedTags, tag]);
    }
  };

  const handleContinue = () => {
    navigateToStep("subscribe");
  };

  const allAvailableTags = [...mockAvailableTags, ...mockPopularTags];

  const helpLinks = [
    { text: "What Tags Are?", onClick: () => console.log("What tags help") },
    {
      text: "Why are they important?",
      onClick: () => console.log("Why important help"),
    },
    {
      text: "Tutorial on how to Add Tags on R3tain",
      onClick: () => console.log("Tutorial help"),
    },
  ];

  return (
    <ImportLayout currentStep={4}>
      <PageHeader
        title="Tag Your Community Members"
        subtitle="Tags are labels you create to differentiate your community members. You can use tags to send personalized campaigns, create a segment or to set up an automation. Any tags you add or create here will appear in your community members table after your import is complete."
        helpLinks={helpLinks}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <TagInputSection
          selectedTags={settings.selectedTags}
          availableTags={allAvailableTags}
          onTagsChange={handleTagsChange}
        />

        <PopularTagsSection
          popularTags={mockPopularTags}
          selectedTags={settings.selectedTags}
          onTagSelect={handlePopularTagSelect}
        />
      </div>

      <ContinueButton onClick={handleContinue} />
    </ImportLayout>
  );
}
