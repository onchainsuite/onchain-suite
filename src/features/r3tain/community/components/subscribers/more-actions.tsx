import { Plus, Settings } from "lucide-react";

import { ReusableDropdownMenu } from "@/components/common";

interface MoreActionsProps {
  handleAddSubscribers: () => void;
  handleAddSingleSubscriber: () => void;
}

export function MoreActions({
  handleAddSubscribers,
  handleAddSingleSubscriber,
}: MoreActionsProps) {
  const moreOptionsItems = [
    { icon: Settings, label: "Community settings" },
    { icon: Settings, label: "Community fields and merge tags" },
    { icon: Settings, label: "Unsubscribe emails" },
    { icon: Settings, label: "Groups" },
    { icon: Settings, label: "Community overview" },
    { icon: Settings, label: "Archived subscribers" },
    { icon: Settings, label: "Import history" },
    { icon: Settings, label: "Export history" },
  ];

  const addSubscribersItems = [
    {
      icon: Plus,
      label: "Import subscribers",
      onClick: handleAddSubscribers,
    },
    {
      icon: Plus,
      label: "Add single subscriber",
      onClick: handleAddSingleSubscriber,
    },
  ];

  return (
    <div className="mt-4 flex items-center gap-2 sm:mt-0">
      <ReusableDropdownMenu
        triggerText="More options"
        triggerVariant="outline"
        menuItems={moreOptionsItems}
      />

      <ReusableDropdownMenu
        triggerText="Add subscribers"
        menuItems={addSubscribersItems}
        contentWidth=""
      />
    </div>
  );
}
