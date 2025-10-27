"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  className,
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-muted/50 border-0 pl-10 focus-visible:ring-1"
      />
    </div>
  );
}
