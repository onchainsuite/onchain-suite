import {
  HelpCircle,
  Phone,
  Plus,
  Settings,
  Sparkles,
  Video,
} from "lucide-react";

import { NotificationsBellIcon } from "../components/notifications";

export const DOCK_ITEMS = [
  {
    title: "Create",
    icon: <Plus className="h-full w-full text-foreground" />,
    href: "#",
  },
  {
    title: "Upgrade",
    icon: <HelpCircle className="h-full w-full text-foreground" />,
    href: "#",
  },
  {
    title: "Call",
    icon: <Phone className="h-full w-full text-foreground" />,
    href: "#",
  },
  {
    title: "Video",
    icon: <Video className="h-full w-full text-foreground" />,
    href: "#",
  },
  {
    title: "Help",
    icon: <HelpCircle className="h-full w-full text-foreground" />,
    href: "#",
  },
  {
    title: "Settings",
    icon: <Settings className="h-full w-full text-foreground" />,
    href: "#",
  },
  {
    title: "Notifications",
    icon: <NotificationsBellIcon className="text-foreground" />,
    href: "#",
  },
  {
    title: "Assistant",
    icon: <Sparkles className="h-full w-full text-foreground" />,
    href: "#",
  },
];
