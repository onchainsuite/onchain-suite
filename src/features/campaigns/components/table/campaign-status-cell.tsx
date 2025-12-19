import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "../../../campaigns/utils/campaign";
import type { CampaignStatus } from "../../../campaigns/types";

interface CampaignStatusCellProps {
  status: CampaignStatus;
}

export function CampaignStatusCell({ status }: CampaignStatusCellProps) {
  return (
    <Badge
      variant="secondary"
      className={`capitalize ${getStatusColor(status)}`}
    >
      {status}
    </Badge>
  );
}
