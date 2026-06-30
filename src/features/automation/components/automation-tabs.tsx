import {
  BoltIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

import { type PageTabItem, PageTabs } from "@/shared/components/page/page-tabs";

interface AutomationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  counts: {
    active: number;
    drafts: number;
    templates?: number;
  };
}

export const AutomationTabs = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  counts,
}: AutomationTabsProps) => {
  const tabs: PageTabItem[] = [
    { id: "active", label: "Active", icon: BoltIcon, badge: counts.active },
    {
      id: "drafts",
      label: "Drafts",
      icon: DocumentTextIcon,
      badge: counts.drafts,
    },
    {
      id: "templates",
      label: "Templates",
      icon: Squares2X2Icon,
      badge: counts.templates,
    },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <PageTabs
        tabs={tabs}
        value={activeTab}
        onValueChange={setActiveTab}
        layoutId="automation-tabs-active"
      />
      <div className="relative sm:w-64">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search automations…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
};
