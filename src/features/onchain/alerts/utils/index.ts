import { type AlertSeverity, type AlertStatus } from "../types";

export const getSeverityVariant = (severity: AlertSeverity) => {
  switch (severity) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
  }
};

export const getStatusVariant = (status: AlertStatus) => {
  switch (status) {
    case "Active":
      return "destructive";
    case "Resolved":
      return "default";
    case "Snoozed":
      return "secondary";
  }
};
