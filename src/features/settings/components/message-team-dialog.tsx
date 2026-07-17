"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  COMPANY_EMAIL,
  officialEmailService,
} from "@/features/settings/official-email.service";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

export interface MessageRecipient {
  name: string;
  email: string;
}

type RecipientChoice = "admins" | "company";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const toHtml = (message: string) =>
  message
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, "<br/>")}</p>`)
    .join("");

interface MessageTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Org admins/owners, excluding the current user. */
  admins: MessageRecipient[];
}

export function MessageTeamDialog({
  open,
  onOpenChange,
  admins,
}: MessageTeamDialogProps) {
  const [recipientChoice, setRecipientChoice] =
    useState<RecipientChoice>("admins");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const recipients =
    recipientChoice === "company"
      ? [{ name: "OnchainSuite", email: COMPANY_EMAIL }]
      : admins;

  const handleSend = async () => {
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();
    if (!trimmedSubject || !trimmedMessage) {
      toast.error("Subject and message are required");
      return;
    }
    if (recipients.length === 0) {
      toast.error("No admins to message in this organization");
      return;
    }

    setSending(true);
    try {
      const html = toHtml(trimmedMessage);
      const results = await Promise.allSettled(
        recipients.map((r) =>
          officialEmailService.send({
            to: r.email,
            subject: trimmedSubject,
            html,
            text: trimmedMessage,
          })
        )
      );
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed === results.length) {
        toast.error("Message could not be sent. Please try again.");
      } else {
        toast.success(
          failed > 0
            ? `Sent to ${results.length - failed} of ${results.length} recipients`
            : recipientChoice === "company"
              ? "Message sent to OnchainSuite"
              : `Message sent to ${results.length} admin${results.length === 1 ? "" : "s"}`
        );
        setSubject("");
        setMessage("");
        onOpenChange(false);
      }
    } catch {
      toast.error("Message could not be sent. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            Send a message
          </DialogTitle>
          <DialogDescription>
            Delivered by email from the official onchainsuite.com address.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message-recipients">To</Label>
            <Select
              value={recipientChoice}
              onValueChange={(v) => setRecipientChoice(v as RecipientChoice)}
            >
              <SelectTrigger id="message-recipients">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admins">
                  Organization admins
                  {admins.length > 0 ? ` (${admins.length})` : ""}
                </SelectItem>
                <SelectItem value="company">
                  OnchainSuite ({COMPANY_EMAIL})
                </SelectItem>
              </SelectContent>
            </Select>
            {recipientChoice === "admins" && admins.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                {admins.map((a) => a.name || a.email).join(", ")}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message-subject">Subject</Label>
            <Input
              id="message-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is this about?"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message-body">Message</Label>
            <Textarea
              id="message-body"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message…"
              rows={6}
              maxLength={5000}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
