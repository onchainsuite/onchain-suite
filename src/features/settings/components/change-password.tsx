import React from "react";

const ChangePassword = () => {
  return (
    <div>
      {/* Change Password Modal */}
      <Dialog
        open={showChangePasswordModal}
        onOpenChange={setShowChangePasswordModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-tight text-[#111827]">
              Change password
            </DialogTitle>
            <DialogDescription className="text-[#6b7280]">
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#111827]">
                Current password
              </Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-12 border-gray-200/80"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#111827]">
                New password
              </Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 border-gray-200/80"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#111827]">
                Confirm new password
              </Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 border-gray-200/80"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowChangePasswordModal(false)}
              className="border-gray-200/80"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                handleSave(() => {
                  setShowChangePasswordModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                })
              }
              disabled={
                saving ||
                !currentPassword ||
                !newPassword ||
                newPassword !== confirmPassword
              }
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              Update password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangePassword;
