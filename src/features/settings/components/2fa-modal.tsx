import React from 'react'

const 2FA-modal = () => {
  return (
    <div>
      {/* 2FA Modal */}
            <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-light tracking-tight text-[#111827]">
                    Two-factor authentication
                  </DialogTitle>
                  <DialogDescription className="text-[#6b7280]">
                    Manage your 2FA settings
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6 space-y-6">
                  <div className="flex flex-col items-center rounded-2xl bg-gray-50 p-6 lg:p-8">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white shadow-lg lg:h-32 lg:w-32">
                      <QrCode className="h-16 w-16 text-[#111827] lg:h-20 lg:w-20" />
                    </div>
                    <p className="mt-6 text-sm text-[#6b7280]">
                      Scan with your authenticator app
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-[#111827]">
                      Verification code
                    </Label>
                    <Input
                      placeholder="000000"
                      value={twoFACode}
                      onChange={(e) => setTwoFACode(e.target.value)}
                      className="h-12 border-gray-200/80 text-center font-mono text-lg tracking-widest"
                      maxLength={6}
                    />
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-800">
                      2FA is currently <span className="font-medium">enabled</span>.
                      Enter a code to disable it, or scan a new QR code to change
                      devices.
                    </p>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShow2FAModal(false)}
                    className="border-gray-200/80"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(() => {
                        setShow2FAModal(false);
                        setTwoFACode("");
                      })
                    }
                    disabled={saving || twoFACode.length !== 6}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="mr-2 h-4 w-4" />
                    )}
                    Verify
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    </div>
  )
}

export default 2FA-modal

