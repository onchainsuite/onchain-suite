"use client";

import { Filter, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui";
import {
  CustomTabs,
  CustomTabsContent,
  CustomTabsList,
  CustomTabsTrigger,
} from "@/components/ui/custom-tabs";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { CampaignFilters, ComparativeReports, EmptyState } from "../components";

export function ReportsPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Sticky Header */}
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
        <div className="px-4 py-4 lg:px-6 lg:py-6">
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-foreground text-2xl font-bold lg:text-3xl">
                Reports
              </h1>
            </div>

            <div className="space-y-2">
              <h2 className="text-foreground text-lg font-semibold lg:text-xl">
                R3tain
              </h2>
              <p className="text-muted-foreground text-sm lg:text-base">
                Your audience has{" "}
                <span className="text-primary font-medium">1 contact</span>.
                <span className="text-primary font-medium"> 1</span> of these is
                subscribed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - takes remaining height */}
      <div className="flex-1 overflow-hidden">
        <CustomTabs defaultValue="campaigns" className="flex h-full flex-col">
          {/* Sticky Tab Headers */}
          <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
            <div className="px-4 lg:px-6">
              <CustomTabsList>
                <CustomTabsTrigger value="campaigns">
                  Campaigns
                </CustomTabsTrigger>
                <CustomTabsTrigger value="comparative">
                  Comparative
                </CustomTabsTrigger>
              </CustomTabsList>
            </div>
          </div>

          {/* Tab Content - scrollable area */}
          <div className="flex-1 overflow-hidden">
            <CustomTabsContent value="campaigns" className="m-0 h-full">
              <div className="flex h-full flex-col lg:flex-row">
                {/* Desktop Filters Sidebar */}
                <div className="hidden lg:block">
                  <CampaignFilters
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    selectedTypes={selectedTypes}
                    onTypesChange={setSelectedTypes}
                  />
                </div>

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  {/* Sticky Search Bar */}
                  <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b p-4 backdrop-blur">
                    <div className="flex items-center gap-3">
                      {/* Mobile Filter Button */}
                      <Sheet
                        open={mobileFiltersOpen}
                        onOpenChange={setMobileFiltersOpen}
                      >
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent lg:hidden"
                          >
                            <Filter className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80 p-0">
                          <div className="flex items-center justify-between border-b p-4">
                            <h3 className="text-lg font-semibold">Filters</h3>
                          </div>
                          <div className="overflow-y-auto">
                            <CampaignFilters
                              selectedStatus={selectedStatus}
                              onStatusChange={setSelectedStatus}
                              selectedTypes={selectedTypes}
                              onTypesChange={setSelectedTypes}
                            />
                          </div>
                        </SheetContent>
                      </Sheet>

                      {/* Search Input */}
                      <div className="relative max-w-md flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                          placeholder="Search campaigns"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-muted/50 border-border/50 focus:bg-background pl-10 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="text-muted-foreground mt-2 text-sm">
                      You can also search by{" "}
                      <button className="text-primary hover:text-primary/80 underline">
                        all audiences
                      </button>
                      .
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="bg-muted/20 flex-1 overflow-y-auto">
                    <EmptyState />
                  </div>
                </div>
              </div>
            </CustomTabsContent>

            <CustomTabsContent value="comparative" className="m-0 h-full">
              <div className="bg-muted/20 h-full overflow-y-auto">
                <ComparativeReports />
              </div>
            </CustomTabsContent>
          </div>
        </CustomTabs>
      </div>
    </div>
  );
}
