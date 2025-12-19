import type { Campaign } from "../../../campaigns/types";

interface CampaignNameCellProps {
  campaign: Campaign;
}

export function CampaignNameCell({ campaign }: CampaignNameCellProps) {
  return (
    <div className="flex flex-col gap-1 min-w-[200px]">
      <div className="font-medium text-foreground">{campaign.name}</div>
      <div className="text-sm text-muted-foreground line-clamp-1">
        {campaign.subject}
      </div>
    </div>
  );
}
