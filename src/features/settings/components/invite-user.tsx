import React from "react";

const InviteUser = () => {
  return (
    <div>
      {/* Invite User Modal */}
      <Dialog open={showInviteUserModal} onOpenChange={setShowInviteUserModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-tight text-[#111827]">
              Invite team member
            </DialogTitle>
            <DialogDescription className="text-[#6b7280]">
              Send an invitation to join your team
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#111827]">
                Email address
              </Label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-12 border-gray-200/80"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#111827]">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="h-12 border-gray-200/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin — Full access</SelectItem>
                  <SelectItem value="editor">
                    Editor — Create and edit
                  </SelectItem>
                  <SelectItem value="viewer">Viewer — Read only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowInviteUserModal(false)}
              className="border-gray-200/80"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                handleSave(() => {
                  setShowInviteUserModal(false);
                  setInviteEmail("");
                })
              }
              disabled={saving || !inviteEmail}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InviteUser;
