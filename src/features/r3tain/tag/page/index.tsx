"use client";

import { useState } from "react";

import {
  BulkTagModal,
  CreateTagModal,
  TagsHeader,
  TagsList,
} from "@/tag/components";

export function TagsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  return (
    <>
      <main className="flex flex-1 flex-col">
        <TagsHeader
          onCreateTag={() => setIsCreateModalOpen(true)}
          onBulkTag={() => setIsBulkModalOpen(true)}
        />

        <div className="flex-1 p-6">
          <TagsList />
        </div>
      </main>

      <CreateTagModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <BulkTagModal open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen} />
    </>
  );
}
