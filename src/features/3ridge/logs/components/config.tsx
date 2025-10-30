"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LogFilters, LogSearchBar } from "./filters";
import { LogList, LogPagination } from "./list";
import {
  type LogConfigurationProps,
  type LogTabContentProps,
} from "@/3ridge/logs/types";

export function LogTabContent({
  title,
  description,
  filterLevel = null,
  logs,
}: LogTabContentProps) {
  return (
    <Card>
      <CardHeader>
        {filterLevel === null ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <LogFilters />
          </div>
        ) : (
          <>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        {filterLevel === null && (
          <div className="mb-4">
            <LogSearchBar />
          </div>
        )}
        <LogList logs={logs} filterLevel={filterLevel} />
        {filterLevel === null && <LogPagination />}
      </CardContent>
    </Card>
  );
}

// Log Configuration Component
export function LogConfiguration({
  defaultLogLevel = "info",
  defaultRetentionDays = 30,
  onSave,
}: LogConfigurationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Configuration</CardTitle>
        <CardDescription>
          Configure logging behavior and retention
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Log Level</Label>
            <Select defaultValue={defaultLogLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Retention Period (days)</Label>
            <Input type="number" defaultValue={defaultRetentionDays} />
          </div>
        </div>

        <Button
          onClick={() =>
            onSave?.({
              logLevel: defaultLogLevel,
              retentionDays: defaultRetentionDays,
            })
          }
        >
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
}
