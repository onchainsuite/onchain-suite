import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/shared/components/page/page-skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <PageHeaderSkeleton />
      {/* Two-pane shell: list + reading pane */}
      <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
        <TableSkeleton rows={6} />
        <div className="hidden rounded-2xl border border-border bg-card p-6 lg:block">
          <TableSkeleton rows={4} className="border-0" />
        </div>
      </div>
    </div>
  );
}
