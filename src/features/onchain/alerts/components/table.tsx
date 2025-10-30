import { Send, Sparkles } from "lucide-react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { type Alert } from "../types";
import { getSeverityVariant, getStatusVariant } from "../utils";

interface AlertTableRowProps {
  alert: Alert;
  onExplainClick: (alert: Alert) => void;
}

// Components

function AlertTableRow({ alert, onExplainClick }: AlertTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <alert.icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{alert.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{alert.type}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={getSeverityVariant(alert.severity)}>
          {alert.severity}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">{alert.timestamp}</TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(alert.status)}>{alert.status}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => onExplainClick(alert)}
          >
            <Sparkles className="h-3 w-3" />
            Explain
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <Send className="h-3 w-3" />
            Send
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AlertsTable({
  alerts,
  onExplainClick,
}: {
  alerts: Alert[];
  onExplainClick: (alert: Alert) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Alert</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((alert) => (
          <AlertTableRow
            key={v7()}
            alert={alert}
            onExplainClick={onExplainClick}
          />
        ))}
      </TableBody>
    </Table>
  );
}
