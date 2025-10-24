"use client";

import * as React from "react";

export function useKeyboardShortcuts() {
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  const getModifierKey = React.useCallback(() => {
    return isMac ? "⌘" : "Ctrl";
  }, [isMac]);

  const checkModifier = React.useCallback(
    (event: KeyboardEvent) => {
      return isMac ? event.metaKey : event.ctrlKey;
    },
    [isMac]
  );

  return { isMac, getModifierKey, checkModifier };
}
