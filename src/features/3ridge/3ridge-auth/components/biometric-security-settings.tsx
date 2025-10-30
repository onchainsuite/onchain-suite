import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function BiometricSecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Configure biometric security and privacy settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Liveness Detection</Label>
            <p className="text-sm text-muted-foreground">
              Verify user is physically present
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Anti-Spoofing</Label>
            <p className="text-sm text-muted-foreground">
              Detect and prevent spoofing attempts
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Secure Enclave Storage</Label>
            <p className="text-sm text-muted-foreground">
              Store biometric data in secure hardware
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Multi-Factor Requirement</Label>
            <p className="text-sm text-muted-foreground">
              Require additional authentication factor
            </p>
          </div>
          <Switch />
        </div>

        <div className="space-y-2">
          <Label>Biometric Template Format</Label>
          <Select defaultValue="fido2">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fido2">FIDO2 / WebAuthn</SelectItem>
              <SelectItem value="proprietary">Proprietary Format</SelectItem>
              <SelectItem value="iso">ISO/IEC 19794</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Matching Threshold</Label>
          <Input
            type="number"
            defaultValue="0.95"
            step="0.01"
            min="0"
            max="1"
          />
          <p className="text-xs text-muted-foreground">
            Higher values = stricter matching (0.0 - 1.0)
          </p>
        </div>

        <Button className="w-full">Save Security Settings</Button>
      </CardContent>
    </Card>
  );
}
