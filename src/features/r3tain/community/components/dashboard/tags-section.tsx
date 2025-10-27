"use client";

import { Send, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { TagData } from "@/r3tain/community/types";

interface TagsSectionProps {
  tags: TagData[];
  onAddTag: () => void;
  onViewAllTags: () => void;
}

export function TagsSection({
  tags,
  onAddTag,
  onViewAllTags,
}: TagsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Tag className="h-4 w-4" />
          Tags
        </CardTitle>
        <Button
          variant="link"
          className="text-primary p-0"
          onClick={onViewAllTags}
        >
          View all tags →
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Your subscribers, organized by your tags.
        </p>

        <div className="space-y-3">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">{tag.count}</span>
                <span className="text-sm">{tag.name}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <Button
            variant="link"
            className="text-primary p-0"
            onClick={onAddTag}
          >
            <Tag className="mr-2 h-4 w-4" />
            Add a tag
          </Button>
          <span className="text-muted-foreground ml-1 text-sm">
            to organize your community.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
