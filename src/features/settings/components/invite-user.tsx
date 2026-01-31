import { Loader2, Mail } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";

interface InviteUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InviteUser = ({ open, onOpenChange }: InviteUserProps) => {
  const { data: session } = authClient.useSession();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [saving, setSaving] = useState(false);

  const handleSendInvite = async () => {
    if (!inviteEmail) return;
    if (!session?.session?.activeOrganizationId) {
        toast.error("No active organization");
        return;
    }

    setSaving(true);
    try {
        await authClient.organization.inviteMember({
            email: inviteEmail,
            role: inviteRole as any,
            organizationId: session.session.activeOrganizationId
        });
        toast.success("Invitation sent successfully");
        onOpenChange(false);
        setInviteEmail("");
    } catch (error: any) {
        toast.error(error.message || "Failed to send invitation");
    } finally {
        setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-tight text-foreground">
            Invite team member
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send an invitation to join your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Email address
            </Label>
            <Input
              placeholder="colleague@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="h-12 border-border/80"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Role</Label>
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger className="h-12 border-border/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border/80"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendInvite}
            disabled={saving || !inviteEmail}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Send invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUser;
