import React from "react";

const VerifySender = () => {
  return (
    <div>
      {/* Verify Sender Modal */}
      <Dialog
        open={showVerifySenderModal}
        onOpenChange={setShowVerifySenderModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-tight text-[#111827]">
              Add sender address
            </DialogTitle>
            <DialogDescription className="text-[#6b7280]">
              Verify a new email address for sending
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#111827]">
                Sender email
              </Label>
              <Input
                type="email"
                placeholder="hello@yourdomain.com"
                value={newSenderEmail}
                onChange={(e) => setNewSenderEmail(e.target.value)}
                className="h-12 border-gray-200/80"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#111827]">
                Display name
              </Label>
              <Input
                placeholder="Your Company"
                value={newSenderName}
                onChange={(e) => setNewSenderName(e.target.value)}
                className="h-12 border-gray-200/80"
              />
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                We&apos;ll send a verification email to this address.
                You&apos;ll also need to add DNS records to verify domain
                ownership.
              </p>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowVerifySenderModal(false)}
              className="border-gray-200/80"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                handleSave(() => {
                  setShowVerifySenderModal(false);
                  setNewSenderEmail("");
                  setNewSenderName("");
                })
              }
              disabled={saving || !newSenderEmail}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifySender;
