"use client";

import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { contextItems, mockMessages, starterMessages } from "../data";

export function AssistantPage() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // Handle message send
      setMessage("");
    }
  };

  return (
    <div className="h-full grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-balance">AI Data Coach</h1>
          <p className="text-muted-foreground mt-1">
            Your intelligent assistant for data insights
          </p>
        </div>

        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Chat</CardTitle>
            </div>
            <CardDescription>Ask questions about your data</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {mockMessages.map((msg) => (
                <div
                  key={v7()}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    <div
                      className={`text-xs mt-2 ${msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about your data..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend} className="gap-2">
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {starterMessages.map((starter) => (
              <Button
                key={v7()}
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={() => setMessage(starter.text)}
              >
                <starter.icon className="h-4 w-4" />
                {starter.text}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Context</CardTitle>
            <CardDescription>Current workspace state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {contextItems.map((item) => (
              <div
                key={v7()}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary"
              >
                <span className="text-sm font-medium">{item.title}</span>
                <Badge variant="outline">{item.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggested Actions</CardTitle>
            <CardDescription>Based on recent activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 rounded-lg bg-secondary text-sm">
              <p className="font-medium mb-1">Review High Churn Alert</p>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary text-sm">
              <p className="font-medium mb-1">Optimize New Users Segment</p>
              <p className="text-xs text-muted-foreground">AI recommendation</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary text-sm">
              <p className="font-medium mb-1">Generate Monthly Report</p>
              <p className="text-xs text-muted-foreground">Due in 3 days</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
