"use client";

import { motion } from "framer-motion";
import { Plus, Users } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CreateCommunityModal } from "./create-community-modal";
import type { Community } from "@/r3tain/community/types";

interface CommunitySelectorProps {
  communities: Community[];
  selectedCommunityId: string;
  onCommunityChange: (communityId: string) => void;
  onCreateNew?: () => void;
}

export function CommunitySelector({
  communities,
  selectedCommunityId,
  onCommunityChange,
}: CommunitySelectorProps) {
  const selectedCommunity = communities.find(
    (c) => c.id === selectedCommunityId
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-3"
    >
      <label
        htmlFor="community-select"
        className="text-foreground block text-sm font-medium"
      >
        Current Community
      </label>

      <Select value={selectedCommunityId} onValueChange={onCommunityChange}>
        <SelectTrigger
          id="community-select"
          className="bg-background border-border hover:border-primary/50 !h-12 w-full cursor-pointer transition-colors duration-200"
        >
          <SelectValue placeholder="Select a community..." />
        </SelectTrigger>

        <SelectContent className="w-full">
          {communities.map((community) => (
            <SelectItem key={community.id} value={community.id} className="p-3">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <Users className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-foreground font-medium">
                      {community.name}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {community.subscriberCount.toLocaleString()} subscribers
                    </div>
                  </div>
                </div>
                {community.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}

          <SelectItem
            value="create-new"
            className="p-3"
            onSelect={handleCreateNew}
          >
            <div className="text-primary flex items-center gap-3">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <Plus className="h-4 w-4" />
              </div>
              <span className="font-medium">Create New Community</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {selectedCommunity && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="bg-muted/30 border-border rounded-lg border p-3"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Selected Community:</span>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-medium">
                {selectedCommunity.name}
              </span>
              <Badge variant="outline" className="text-xs">
                {selectedCommunity.subscriberCount.toLocaleString()} subscribers
              </Badge>
            </div>
          </div>
        </motion.div>
      )}

      <CreateCommunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCommunityCreated={(newCommunity) => {
          // Add the new community to the list and select it
          onCommunityChange(newCommunity.id);
          setIsModalOpen(false);
        }}
        existingCommunities={communities}
      />
    </motion.div>
  );
}
