import { Network, Search, Users } from "lucide-react";

import { PRIVATE_ROUTES } from "@/config/app-routes";

export const dataModules = [
  {
    title: "Co-Build",
    description:
      "Real-time collaborative query editor with live preview and team comments",
    href: PRIVATE_ROUTES.ONCHAIN.DATA_CO_BUILD,
    icon: Users,
  },
  {
    title: "Schema Explorer",
    description:
      "Interactive graph visualization of your data schema and relationships",
    href: PRIVATE_ROUTES.ONCHAIN.DATA_SCHEMA,
    icon: Network,
  },
  {
    title: "Visual Search",
    description:
      "Natural language search to find entities and relationships in your data",
    href: PRIVATE_ROUTES.ONCHAIN.DATA_QUERY,
    icon: Search,
  },
];
