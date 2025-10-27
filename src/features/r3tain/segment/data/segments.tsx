import {
  Calendar,
  Clock,
  Mail,
  MailX,
  RefreshCw,
  ShoppingCart,
  UserPlus,
} from "lucide-react";

import type { SavedSegment, Segment } from "@/r3tain/segment/types";

export const prebuiltSegments: Segment[] = [
  {
    id: "new-subscribers",
    name: "New subscribers",
    description:
      "Find contacts who signed up for your marketing in the last 7 days.",
    icon: <Mail className="h-5 w-5" />,
    category: "subscriber",
  },
  {
    id: "engaged-subscribers",
    name: "Engaged subscribers",
    description:
      "Find contacts who have opened any or all of your last 5 emails.",
    icon: <Mail className="h-5 w-5" />,
    category: "subscriber",
  },
  {
    id: "disengaged-subscribers",
    name: "Disengaged subscribers",
    description: "Find contacts who haven't opened your last 5 emails.",
    icon: <MailX className="h-5 w-5" />,
    category: "subscriber",
  },
  {
    id: "potential-customers",
    name: "Potential customers",
    description: "Find contacts who haven't placed an order in your store.",
    icon: <ShoppingCart className="h-5 w-5" />,
    category: "customer",
  },
  {
    id: "repeat-customers",
    name: "Repeat customers",
    description:
      "Find contacts who have placed 2 or more orders in your store.",
    icon: <RefreshCw className="h-5 w-5" />,
    category: "customer",
  },
  {
    id: "lapsed-customers",
    name: "Lapsed customers",
    description:
      "Find contacts who haven't placed an order in the last 8 months.",
    icon: <Clock className="h-5 w-5" />,
    category: "customer",
  },
  {
    id: "recent-customers",
    name: "Recent customers",
    description: "Find contacts who have placed an order in the last 30 days.",
    icon: <Calendar className="h-5 w-5" />,
    category: "customer",
  },
  {
    id: "first-time-customers",
    name: "First-time customers",
    description:
      "Find contacts who have placed their first order in the last 30 days.",
    icon: <UserPlus className="h-5 w-5" />,
    category: "customer",
  },
];

export const savedSegments: SavedSegment[] = [
  {
    id: "1",
    name: "Address Segment1",
    created: "July 24, 2025",
    createdDate: new Date("2025-07-24"),
  },
  {
    id: "2",
    name: "Address Segment",
    created: "July 24, 2025",
    createdDate: new Date("2025-07-24"),
  },
];
