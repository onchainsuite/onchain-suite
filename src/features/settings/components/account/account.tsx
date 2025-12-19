
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fadeInUp } from "../../utils";

import CompanyInfo from "./company-info";
import Branding from "./branding";
import TeamMembers from "./team-members";
import SenderVerification from "./sender-verification";

export default function AccountSettings() {
  const [primaryColor, setPrimaryColor] = useState("#10b981");
  const [showLogoUploadModal, setShowLogoUploadModal] = useState(false);
  const [logoUploadType, setLogoUploadType] = useState<"primary" | "dark" | "favicon">("primary");
  const [showInviteUserModal, setShowInviteUserModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [showVerifySenderModal, setShowVerifySenderModal] = useState(false);
  const [newSenderEmail, setNewSenderEmail] = useState("");
  const [newSenderName, setNewSenderName] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Color picker state (implied requirement for Branding component)
  const [showColorPicker, setShowColorPicker] = useState(false); // Placeholder if modal needed
  const [colorPickerType, setColorPickerType] = useState<"primary" | "secondary">("primary");

  const openLogoUpload = (type: "primary" | "dark" | "favicon") => {
    setLogoUploadType(type);
    setShowLogoUploadModal(true);
  };

  const openColorPicker = (type: "primary" | "secondary") => {
    setColorPickerType(type);
    // In a real app, this might open a color picker modal or popover
    console.log(`Open color picker for ${type}`);
  };

  const handleSave = async (callback?: () => void) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    callback?.();
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-16 lg:space-y-24"
    >
      <CompanyInfo saving={saving} handleSave={handleSave} />
      
      <Branding 
        openLogoUpload={openLogoUpload} 
        openColorPicker={openColorPicker} 
      />
      
      <TeamMembers setShowInviteUserModal={setShowInviteUserModal} />
      
      <SenderVerification setShowVerifySenderModal={setShowVerifySenderModal} />

      {/* Modals */}
      <Dialog open={showLogoUploadModal} onOpenChange={setShowLogoUploadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload {logoUploadType} logo</DialogTitle>
            <DialogDescription>
              Recommended size: 512x512px. Max file size: 2MB.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-muted/50 py-12 transition-colors hover:bg-muted">
              <div className="rounded-full bg-card p-4 shadow-sm">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSave(() => setShowLogoUploadModal(false))}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Upload logo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showInviteUserModal} onOpenChange={setShowInviteUserModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite team member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Email address</Label>
              <Input
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
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
            <Button variant="outline" onClick={() => setShowInviteUserModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSave(() => setShowInviteUserModal(false))}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showVerifySenderModal} onOpenChange={setShowVerifySenderModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify new sender</DialogTitle>
            <DialogDescription>
              Add a new sender email address to use in your campaigns.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Sender name</Label>
              <Input
                placeholder="Marketing Team"
                value={newSenderName}
                onChange={(e) => setNewSenderName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email address</Label>
              <Input
                placeholder="marketing@company.com"
                value={newSenderEmail}
                onChange={(e) => setNewSenderEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifySenderModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSave(() => setShowVerifySenderModal(false))}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify sender"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
