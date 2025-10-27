"use client";

export function EmptyState({
  onCreateCampaign,
}: {
  onCreateCampaign: () => void;
}) {
  return (
    <div className="border-border bg-card flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
      <div className="bg-muted mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full">
        <svg
          className="text-muted-foreground h-12 w-12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 7L12 13L21 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-foreground mb-2 text-xl font-bold">
        You don&apos;t have any marketing yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Once you start creating, your items will show up here.
      </p>
      <button
        onClick={onCreateCampaign}
        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-ring rounded-md px-4 py-2 text-sm font-medium shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Create
      </button>
    </div>
  );
}
