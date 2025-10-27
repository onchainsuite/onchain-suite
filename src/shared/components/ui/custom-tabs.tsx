"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";

interface CustomTabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

interface CustomTabsListProps {
  children: React.ReactNode;
}

interface CustomTabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface CustomTabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const CustomTabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({
  activeTab: "",
  setActiveTab: () => {},
});

export function CustomTabs({
  defaultValue,
  children,
  className,
}: CustomTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <CustomTabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("space-y-6", className)}>{children}</div>
    </CustomTabsContext.Provider>
  );
}

export function CustomTabsList({ children }: CustomTabsListProps) {
  return (
    <div className="border-border/50 scrollbar-thin flex space-x-6 overflow-x-auto border-b sm:space-x-8">
      {children}
    </div>
  );
}

export function CustomTabsTrigger({ value, children }: CustomTabsTriggerProps) {
  const { activeTab, setActiveTab } = React.useContext(CustomTabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative cursor-pointer px-1 pb-3 text-sm font-medium whitespace-nowrap transition-all duration-200",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
      {isActive && (
        <div className="bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-full transition-all duration-200" />
      )}
    </button>
  );
}

export function CustomTabsContent({
  value,
  children,
  className,
}: CustomTabsContentProps) {
  const { activeTab } = React.useContext(CustomTabsContext);

  if (activeTab !== value) return null;

  return (
    <div className={cn("animate-in fade-in-50 duration-200", className)}>
      {children}
    </div>
  );
}
