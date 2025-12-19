import { Badge } from "@/components/ui/badge";

import type { CampaignStatus } from "../../../campaigns/types";
import { getStatusColor } from "../../../campaigns/utils/campaign";

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
