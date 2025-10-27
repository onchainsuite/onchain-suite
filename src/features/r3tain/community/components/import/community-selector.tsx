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
        className="block text-sm font-medium text-foreground"
      >
        Current Community
      </label>

      <Select value={selectedCommunityId} onValueChange={onCommunityChange}>
        <SelectTrigger
          id="community-select"
          className="bg-background border-border hover:border-primary/50 h-12! w-full cursor-pointer transition-colors duration-200"
        >
          <SelectValue placeholder="Select a community..." />
        </SelectTrigger>

        <SelectContent className="w-full">
          {communities.map((community) => (
            <SelectItem key={community.id} value={community.id} className="p-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {community.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
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
            <div className="flex items-center gap-3 text-primary">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <Plus className="w-4 h-4" />
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
          className="p-3 border rounded-lg bg-muted/30 border-border"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Selected Community:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">
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
