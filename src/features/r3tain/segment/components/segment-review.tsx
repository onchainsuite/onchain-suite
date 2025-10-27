"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { SaveSegmentModal } from "./save-segment-modal";
import { type Filter } from "@/r3tain/segment/types";

interface Contact {
  id: string;
  name: string;
  email: string;
  birthday?: string;
  address?: string;
}

interface SegmentReviewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  filters: Filter[];
}

// Mock API function to simulate finding matching contacts
const findMatchingContacts = async (filters: Filter[]): Promise<Contact[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock logic - for demo purposes, return different results based on filter criteria
  const mockContacts: Contact[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      birthday: "January 15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      birthday: "January 22",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      birthday: "February 10",
    },
  ];

  // Simple mock filtering - in real app, this would be done server-side
  if (filters.some((f) => f.id === "Birthday" && f.value === "January")) {
    return mockContacts.filter((c) => c.birthday?.includes("January"));
  }

  return mockContacts.slice(0, Math.floor(Math.random() * 4)); // Random 0-3 contacts
};

export function SegmentReview({
  isOpen,
  onOpenChange,
  onBack,
  filters,
}: SegmentReviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [contactCount, setContactCount] = useState<number>(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setContactCount(0);
      setContacts([]);

      findMatchingContacts(filters).then((matchingContacts) => {
        setContacts(matchingContacts);
        setContactCount(matchingContacts.length);
        setIsLoading(false);
      });
    }
  }, [isOpen, filters]);

  const formatFilterCriteria = (filters: Filter[]) => {
    return filters
      .map((filter, index) => {
        const filterOp = filter.filterOperator?.label ?? "is";
        const value = filter.value ?? "";
        const line = `${filter.option?.label} > ${filterOp} > ${value}`;
        if (index === 0) return line;
        return `${filter.operator?.toUpperCase() ?? "AND"}\n${line}`;
      })
      .join("\n");
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    return `${now.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })} at ${now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  const handleUseSegment = () => {
    setShowSaveModal(true);
  };

  const handleSaveSegment = (segmentName: string) => {
    console.log(
      "Saving segment:",
      segmentName,
      "with",
      contactCount,
      "contacts"
    );
    setShowSaveModal(false);
    onOpenChange(false);
    // Here you would typically save to your backend
  };

  return (
    <>
      <Drawer
        open={isOpen && !showSaveModal}
        onOpenChange={onOpenChange}
        direction="bottom"
      >
        <DrawerContent className="mx-auto flex h-[95vh] w-full flex-col px-8 sm:max-w-7xl">
          <DrawerHeader className="px-0">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <DrawerTitle className="text-2xl font-semibold">
                Segment builder
              </DrawerTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleUseSegment}
                  disabled={isLoading}
                >
                  Use segment
                </Button>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
          </DrawerHeader>

          {/* Main scrollable area */}
          <div className="flex min-h-0 flex-1 flex-col space-y-4 sm:space-y-8">
            <h2 className="shrink-0 text-3xl font-bold">Review your segment</h2>

            {/* Scroll starts here */}
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-2">
              <div className="flex items-baseline gap-4">
                <div className="text-6xl font-bold">
                  {isLoading ? "-" : contactCount}
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-medium">
                    contacts in your segment
                  </div>
                  <div className="text-muted-foreground text-sm">
                    as of {getCurrentTimestamp()}
                  </div>
                </div>
              </div>

              {isLoading && (
                <div className="text-muted-foreground space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted-foreground h-2 w-2 animate-pulse rounded-full" />
                    Loading count...
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted-foreground h-2 w-2 animate-pulse rounded-full" />
                    Loading preview table...
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="text-muted-foreground text-sm whitespace-pre-line">
                  {formatFilterCriteria(filters)}
                </div>

                {!isLoading && contactCount === 0 && (
                  <div className="text-muted-foreground text-sm">
                    No contacts match these filters
                  </div>
                )}

                {!isLoading && contactCount > 0 && (
                  <div className="space-y-4">
                    <div className="text-sm font-medium">
                      Preview of matching contacts:
                    </div>
                    <div className="overflow-hidden rounded-lg border">
                      {/* Desktop Header - Hidden on mobile */}
                      <div className="bg-muted/50 hidden border-b px-4 py-2 md:block">
                        <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                          <div>Name</div>
                          <div>Email</div>
                          <div>Details</div>
                        </div>
                      </div>

                      {/* Contact List */}
                      <div className="divide-y">
                        {contacts.slice(0, 5).map((contact) => (
                          <div key={contact.id} className="p-4">
                            {/* Mobile Layout - Stacked */}
                            <div className="space-y-2 md:hidden">
                              <div className="text-base font-medium">
                                {contact.name}
                              </div>
                              <div className="text-muted-foreground text-sm break-all">
                                {contact.email}
                              </div>
                              {contact.birthday && (
                                <div className="text-muted-foreground text-sm">
                                  Birthday: {contact.birthday}
                                </div>
                              )}
                            </div>

                            {/* Desktop Layout - Grid */}
                            <div className="hidden gap-4 text-sm md:grid md:grid-cols-3">
                              <div className="font-medium">{contact.name}</div>
                              <div className="text-muted-foreground break-all">
                                {contact.email}
                              </div>
                              <div className="text-muted-foreground">
                                {contact.birthday &&
                                  `Birthday: ${contact.birthday}`}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {contactCount > 5 && (
                      <div className="text-muted-foreground text-sm">
                        And {contactCount - 5} more contacts...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <SaveSegmentModal
        isOpen={showSaveModal}
        onOpenChange={setShowSaveModal}
        onSave={handleSaveSegment}
        onBack={() => setShowSaveModal(false)}
      />
    </>
  );
}
