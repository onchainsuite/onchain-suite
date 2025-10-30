export const getLevelColor = (level: string) => {
  switch (level) {
    case "error":
      return "border-red-500/50 bg-red-500/10";
    case "warning":
      return "border-yellow-500/50 bg-yellow-500/10";
    case "info":
      return "border-blue-500/50 bg-blue-500/10";
    default:
      return "border-border bg-accent/50";
  }
};
