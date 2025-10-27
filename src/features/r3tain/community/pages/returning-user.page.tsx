/* eslint-disable no-console */
"use client";

import { useState } from "react";

import {
  CommunityHeader,
  EngagementSection,
  MessagesInbox,
  PopupFormsPromo,
  PredictedDemographics,
  RecentGrowth,
  TagsSection,
  TopLocations,
} from "@/r3tain/community/components/dashboard";
import {
  mockCommunityStats,
  mockEngagementData,
  mockGrowthData,
  mockLocationData,
  mockMessageInbox,
  mockTags,
} from "@/r3tain/community/data";
import {
  type CommunityStats,
  type EngagementData,
  type GrowthData,
  type LocationData,
  type MessageInbox,
  type TagData,
} from "@/r3tain/community/types";

export function ReturningUserCommunity() {
  const [communityStats] = useState<CommunityStats>(mockCommunityStats);
  const [messageInbox] = useState<MessageInbox>(mockMessageInbox);
  const [growthData] = useState<GrowthData>(mockGrowthData);
  const [tags] = useState<TagData[]>(mockTags);
  const [showPromo, setShowPromo] = useState(true);
  const [engagementData] = useState<EngagementData>(mockEngagementData);
  const [locationData] = useState<LocationData>(mockLocationData);

  // Event handlers
  const handleManageCommunity = () => console.log("Manage community");
  const handleViewInbox = () => console.log("View inbox");
  const handleTryPopupForms = () => console.log("Try popup forms");
  const handleDismissPromo = () => setShowPromo(false);
  const handleAddPopupForm = () => console.log("Add popup form");
  const handleCreateLandingPage = () => console.log("Create landing page");
  const handleConnectSite = () => console.log("Connect site");
  const handleAddTag = () => console.log("Add tag");
  const handleViewAllTags = () => console.log("View all tags");
  const handleUpgrade = () => console.log("Upgrade");
  const handleLearnMore = () => console.log("Learn more about location data");

  return (
    <div className="space-y-6 p-4 lg:space-y-8 lg:p-8">
      {/* Community Header */}
      <CommunityHeader
        stats={communityStats}
        onManageCommunity={handleManageCommunity}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Left Column */}
        <div className="space-y-6 lg:space-y-8">
          <MessagesInbox inbox={messageInbox} onViewInbox={handleViewInbox} />

          {showPromo && (
            <PopupFormsPromo
              onTryOut={handleTryPopupForms}
              onDismiss={handleDismissPromo}
            />
          )}

          <RecentGrowth
            growth={growthData}
            onAddPopupForm={handleAddPopupForm}
            onCreateLandingPage={handleCreateLandingPage}
            onConnectSite={handleConnectSite}
          />

          <PredictedDemographics onUpgrade={handleUpgrade} />
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:space-y-8">
          <TagsSection
            tags={tags}
            onAddTag={handleAddTag}
            onViewAllTags={handleViewAllTags}
          />

          <EngagementSection engagement={engagementData} />

          <TopLocations
            locationData={locationData}
            onLearnMore={handleLearnMore}
          />
        </div>
      </div>

      {/* Engagement Section - Full Width on Mobile */}
      <div className="lg:hidden">
        <h2 className="text-foreground mb-6 text-xl font-semibold">
          Engagement
        </h2>
      </div>
    </div>
  );
}
