"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/ui/button";

import { mockWallets } from "../data";

export function LiveTracker() {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedChain, setSelectedChain] = useState("all");

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <CardTitle>Live Wallet Tracker</CardTitle>
          <CardDescription>
            Real-time wallet activity monitoring
          </CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsPaused(!isPaused)}
          className="gap-2"
        >
          {isPaused ? (
            <Play className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
          {isPaused ? "Resume" : "Pause"} Stream
        </Button>
      </CardHeader>
      <CardContent>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Wallets</CardTitle>
                <CardDescription>
                  Streaming live blockchain activity
                </CardDescription>
              </div>
              <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chains</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="kaia">Kaia</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="avalanche">Avalanche</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWallets.map((wallet) => (
                  <TableRow key={v7()}>
                    <TableCell className="font-mono text-sm">
                      {wallet.address}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{wallet.chain}</Badge>
                    </TableCell>
                    <TableCell>{wallet.activity}</TableCell>
                    <TableCell className="font-semibold">
                      {wallet.value}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {wallet.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
