"use client";

import { Copy, ExternalLink, MessageCircle, Twitter } from "lucide-react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface UserTableRowProps {
  address: string;
  labels: string[];
  netWorth: string;
  socials: string[];
  apps: number;
  tokens: number;
  chains: string[];
  firstSeen: string;
  lastSeen: string;
}

export function UserTableRow({
  address,
  labels,
  netWorth,
  socials,
  apps,
  tokens,
  chains,
  firstSeen,
  lastSeen,
}: UserTableRowProps) {
  return (
    <TableRow className="hover:bg-muted/50 transition-colors group">
      <TableCell className="font-mono text-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold">
            {address[0].toUpperCase()}
          </div>
          {address}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {labels.map((label) => (
            <Badge key={v7()} variant="outline" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="font-semibold text-primary">{netWorth}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          {socials.includes("twitter") && (
            <div className="h-6 w-6 rounded bg-muted flex items-center justify-center">
              <Twitter className="h-3 w-3" />
            </div>
          )}
          {socials.includes("discord") && (
            <div className="h-6 w-6 rounded bg-muted flex items-center justify-center">
              <MessageCircle className="h-3 w-3" />
            </div>
          )}
          {socials.includes("farcaster") && (
            <div className="h-6 w-6 rounded bg-muted flex items-center justify-center text-xs font-bold">
              F
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{apps}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{tokens}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {chains.slice(0, 2).map((chain) => (
            <Badge key={v7()} variant="outline" className="text-xs">
              {chain}
            </Badge>
          ))}
          {chains.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{chains.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {firstSeen}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {lastSeen}
      </TableCell>
      <TableCell>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
