"use client";

import * as React from "react";

interface UseSidebarOptions {
  isCollapsed: boolean;
  isMobileOpen: boolean;
}

export function useSidebar({ isCollapsed }: UseSidebarOptions) {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [expandedNestedItems, setExpandedNestedItems] = React.useState<
    Set<string>
  >(new Set());
  const [submenuPosition, setSubmenuPosition] = React.useState({
    top: 0,
    maxHeight: 0,
  });
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);
  const [focusedItemIndex, setFocusedItemIndex] = React.useState(0);
  const itemRefs = React.useRef<Map<string, HTMLLIElement>>(new Map());
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const submenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouchDevice();
  }, []);

  React.useEffect(() => {
    if (!isTouchDevice || !hoveredItem) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const clickedItem = itemRefs.current.get(hoveredItem);

      if (
        submenuRef.current &&
        !submenuRef.current.contains(target) &&
        clickedItem &&
        !clickedItem.contains(target)
      ) {
        setHoveredItem(null);
        setExpandedNestedItems(new Set());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isTouchDevice, hoveredItem]);

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const toggleNestedSubmenu = React.useCallback((title: string) => {
    setExpandedNestedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  }, []);

  const calculateSubmenuPosition = React.useCallback((itemTitle: string) => {
    const itemElement = itemRefs.current.get(itemTitle);
    if (itemElement) {
      const rect = itemElement.getBoundingClientRect();
      const sidebarRect = itemElement.closest("aside")?.getBoundingClientRect();
      if (sidebarRect) {
        const viewportHeight = window.innerHeight;
        const topPosition = rect.top - sidebarRect.top;
        const availableHeight = viewportHeight - rect.top - 16;

        setSubmenuPosition({
          top: topPosition,
          maxHeight: Math.max(200, availableHeight),
        });
      }
    }
  }, []);

  const handleItemClick = React.useCallback(
    (itemTitle: string, hasSubmenu: boolean) => {
      if (!isTouchDevice || !hasSubmenu) return;

      calculateSubmenuPosition(itemTitle);

      if (hoveredItem === itemTitle) {
        setHoveredItem(null);
        setExpandedNestedItems(new Set());
      } else {
        setHoveredItem(itemTitle);
        setExpandedNestedItems(new Set());
      }
    },
    [isTouchDevice, hoveredItem, calculateSubmenuPosition]
  );

  const handleItemHover = React.useCallback(
    (itemTitle: string) => {
      if (isTouchDevice) return;

      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      calculateSubmenuPosition(itemTitle);
      setHoveredItem(itemTitle);
    },
    [isTouchDevice, calculateSubmenuPosition]
  );

  const handleItemLeave = React.useCallback(() => {
    if (isTouchDevice) return;

    closeTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
      setExpandedNestedItems(new Set());
    }, 150);
  }, [isTouchDevice]);

  const handlePanelEnter = React.useCallback(() => {
    if (isTouchDevice) return;

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, [isTouchDevice]);

  const handlePanelLeave = React.useCallback(() => {
    if (isTouchDevice) return;

    closeTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
      setExpandedNestedItems(new Set());
    }, 150);
  }, [isTouchDevice]);

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent, itemTitles: string[]) => {
      if (isCollapsed) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedItemIndex((prev) => {
            const next = (prev + 1) % itemTitles.length;
            const nextItem = itemRefs.current.get(itemTitles[next]);
            nextItem?.focus();
            return next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedItemIndex((prev) => {
            const next = prev === 0 ? itemTitles.length - 1 : prev - 1;
            const nextItem = itemRefs.current.get(itemTitles[next]);
            nextItem?.focus();
            return next;
          });
          break;
        case "Enter":
        case " ": {
          e.preventDefault();
          const currentTitle = itemTitles[focusedItemIndex];
          const currentItem = itemRefs.current.get(currentTitle);
          if (currentItem) {
            currentItem.click();
          }
          break;
        }
        case "Home": {
          e.preventDefault();
          setFocusedItemIndex(0);
          const firstItem = itemRefs.current.get(itemTitles[0]);
          firstItem?.focus();
          break;
        }
        case "End": {
          e.preventDefault();
          const lastIndex = itemTitles.length - 1;
          setFocusedItemIndex(lastIndex);
          const lastItem = itemRefs.current.get(itemTitles[lastIndex]);
          lastItem?.focus();
          break;
        }
      }
    },
    [isCollapsed, focusedItemIndex]
  );

  const setItemRef = React.useCallback(
    (title: string, el: HTMLLIElement | null) => {
      if (el) {
        itemRefs.current.set(title, el);
      }
    },
    []
  );

  return {
    hoveredItem,
    expandedNestedItems,
    submenuPosition,
    isTouchDevice,
    submenuRef,
    focusedItemIndex,
    toggleNestedSubmenu,
    handleItemClick,
    handleItemHover,
    handleItemLeave,
    handlePanelEnter,
    handlePanelLeave,
    handleKeyDown,
    setItemRef,
    setFocusedItemIndex,
  };
}
