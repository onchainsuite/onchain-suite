import { Filter, Search } from "lucide-react";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

import {
  type LogFiltersProps,
  type LogSearchBarProps,
  type LogSource,
} from "@/3ridge/logs/types";

export function LogFilters({
  selectedSource = "all",
  onSourceChange,
  onFilterClick,
}: LogFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select
        defaultValue={selectedSource}
        onValueChange={(value) => onSourceChange?.(value as LogSource)}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="auth">Auth Service</SelectItem>
          <SelectItem value="webhook">Webhooks</SelectItem>
          <SelectItem value="database">Database</SelectItem>
          <SelectItem value="zk">zk-Verifier</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        className="bg-transparent"
        onClick={onFilterClick}
      >
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function LogSearchBar({
  value = "",
  onChange,
  placeholder = "Search logs by message, user, or source...",
}: LogSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-8"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
